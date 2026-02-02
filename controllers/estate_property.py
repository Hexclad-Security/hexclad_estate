# -*- coding: utf-8 -*-

import logging

from markupsafe import Markup
from werkzeug.exceptions import NotFound

from odoo import http
from odoo.http import request
from odoo.tools import html_escape
from odoo.tools.misc import formatLang


_logger = logging.getLogger(__name__)


class EstatePropertyWebsite(http.Controller):
    def _get_property_model(self):
        if "estate.property" not in request.env.registry.models:
            raise NotFound()
        return request.env["estate.property"].sudo()

    @http.route(["/properties"], type="http", auth="public", website=True, sitemap=True)
    def properties(self, type_id=None, state=None, **kwargs):
        Property = self._get_property_model()
        domain = [("website_published", "=", True), ("active", "=", True)]
        selected_type_id = False
        if type_id:
            try:
                selected_type_id = int(type_id)
                domain.append(("property_type_id", "=", selected_type_id))
            except (TypeError, ValueError):
                selected_type_id = False
        if state:
            domain.append(("state", "=", state))
        properties = Property.search(domain)
        property_types = request.env["estate.property.type"].sudo().search([])
        state_selection = request.env["estate.property"]._fields["state"].selection
        values = {
            "properties": properties,
            "property_types": property_types,
            "state_selection": state_selection,
            "selected_type_id": selected_type_id,
            "selected_state": state or False,
        }
        return request.render("hexclad_estate.estate_property_listing", values)

    @http.route(
        ["/properties/<model('estate.property'):property>"],
        type="http",
        auth="public",
        website=True,
        sitemap=True,
    )
    def property_detail(self, property, **kwargs):
        self._get_property_model()
        if not property.website_published or not property.active:
            raise NotFound()
        gallery_images = []
        index = 0
        if property.image:
            gallery_images.append(
                {
                    "url": f"/web/image/estate.property/{property.id}/image_1920",
                    "alt": property.name,
                    "index": index,
                }
            )
            index += 1
        for image in property.image_ids:
            gallery_images.append(
                {
                    "url": f"/web/image/estate.property.image/{image.id}/image_1920",
                    "alt": image.name or property.name,
                    "index": index,
                }
            )
            index += 1
        currency = (
            property.company_id.currency_id
            if property.company_id
            else request.env.company.currency_id
        )
        formatted_expected_price = formatLang(
            request.env, property.expected_price, currency_obj=currency
        )
        formatted_best_price = (
            formatLang(request.env, property.best_price, currency_obj=currency)
            if property.best_price
            else ""
        )
        state_selection = dict(property._fields["state"].selection)
        return request.render(
            "hexclad_estate.estate_property_detail",
            {
                "property": property,
                "currency": currency,
                "gallery_images": gallery_images,
                "gallery_count": len(gallery_images),
                "formatted_expected_price": formatted_expected_price,
                "formatted_best_price": formatted_best_price,
                "state_selection": state_selection,
            },
        )

    @http.route(
        ["/properties/<model('estate.property'):property>/inquiry"],
        type="http",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=True,
    )
    def property_inquiry(self, property, **post):
        self._get_property_model()
        if not property.website_published or not property.active:
            raise NotFound()
        name = (post.get("name") or "").strip() or "Website Visitor"
        email = (post.get("email") or "").strip()
        phone = (post.get("phone") or "").strip()
        message = (post.get("message") or "").strip()
        base_url = request.env["ir.config_parameter"].sudo().get_param("web.base.url")
        property_url = (
            f"{base_url}{property.website_url}"
            if base_url and property.website_url
            else ""
        )
        Partner = request.env["res.partner"].sudo()
        partner = False
        if email:
            partner = Partner.search([("email", "=ilike", email)], limit=1)
        if not partner:
            partner = Partner.create(
                {
                    "name": name,
                    "email": email or False,
                    "phone": phone or False,
                }
            )
        elif phone and not partner.phone:
            partner.phone = phone

        def _display(value):
            return html_escape(value) if value else "—"

        property_address = ", ".join(
            filter(
                None,
                [
                    property.street,
                    property.street2,
                    property.city,
                    property.state_id.name if property.state_id else False,
                    property.postcode,
                    property.country_id.name if property.country_id else False,
                ],
            )
        )
        property_url_html = (
            f'<a href="{html_escape(property_url)}">{html_escape(property_url)}</a>'
            if property_url
            else "—"
        )
        message_html = html_escape(message or "—").replace("\n", "<br/>")
        body = Markup(
            f"""
            <p><strong>Website Inquiry</strong></p>
            <ul>
              <li><strong>Name:</strong> {_display(name)}</li>
              <li><strong>Email:</strong> {_display(email)}</li>
              <li><strong>Phone:</strong> {_display(phone)}</li>
              <li><strong>Property:</strong> {_display(property.name)}</li>
              <li><strong>Address:</strong> {_display(property_address)}</li>
              <li><strong>Property URL:</strong> {property_url_html}</li>
            </ul>
            <p><strong>Message:</strong></p>
            <p>{message_html}</p>
        """
        )

        salesperson_partner = (
            property.user_id.partner_id if property.user_id else False
        )
        partner_ids = [salesperson_partner.id] if salesperson_partner else []

        property.sudo().message_post(
            body=body,
            message_type="comment",
            subtype_xmlid="mail.mt_comment",
            author_id=partner.id,
            email_from=email or False,
            partner_ids=partner_ids,
        )

        lead = False
        if "crm.lead" in request.env.registry.models:
            Lead = request.env["crm.lead"].sudo()
            stage = request.env["crm.stage"].sudo().search(
                [("name", "=", "New Prospect")], limit=1
            )
            if not stage:
                stage = request.env["crm.stage"].sudo().search(
                    [], order="sequence,id", limit=1
                )
            description_lines = [
                "Website Inquiry",
                f"Name: {name or '—'}",
                f"Email: {email or '—'}",
                f"Phone: {phone or '—'}",
                f"Property: {property.name or '—'}",
                f"Address: {property_address or '—'}",
                f"Property URL: {property_url or '—'}",
                "Message:",
                message or "—",
            ]
            lead_vals = {
                "name": f"Website Inquiry: {property.name}",
                "partner_id": partner.id,
                "email_from": email or False,
                "phone": phone or False,
                "user_id": property.user_id.id if property.user_id else False,
                "description": "\n".join(description_lines),
            }
            if "type" in Lead._fields:
                lead_vals["type"] = "opportunity"
            if stage:
                lead_vals["stage_id"] = stage.id
            lead = Lead.create(lead_vals)
            lead.message_post(
                body=body,
                message_type="comment",
                subtype_xmlid="mail.mt_comment",
                author_id=partner.id,
                email_from=email or False,
                partner_ids=partner_ids,
            )

        salesperson_email = salesperson_partner.email if salesperson_partner else False
        sender_email = (
            property.company_id.email or request.env.company.email or email or False
        )
        if salesperson_email:
            mail_vals = {
                "subject": f"New website inquiry: {property.name}",
                "body_html": body,
                "email_to": salesperson_email,
                "email_from": (
                    f"Notifications <{sender_email}>" if sender_email else False
                ),
                "auto_delete": True,
            }
            try:
                request.env["mail.mail"].sudo().create(mail_vals).send()
            except Exception:
                _logger.exception(
                    "Failed to send inquiry email to salesperson for property %s",
                    property.id,
                )
        return request.render(
            "hexclad_estate.estate_property_inquiry_thanks",
            {"property": property},
        )
