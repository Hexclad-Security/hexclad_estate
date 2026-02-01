# -*- coding: utf-8 -*-

from werkzeug.exceptions import NotFound

from odoo import http
from odoo.http import request
from odoo.tools.misc import formatLang


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
        name = post.get("name") or "Website Visitor"
        email = post.get("email") or ""
        phone = post.get("phone") or ""
        message = post.get("message") or ""
        base_url = request.env["ir.config_parameter"].sudo().get_param("web.base.url")
        property_url = (
            f"{base_url}{property.website_url}"
            if base_url and property.website_url
            else ""
        )
        message_lines = [
            "Website Inquiry",
            f"Name: {name or '—'}",
            f"Email: {email or '—'}",
            f"Phone: {phone or '—'}",
            f"Property URL: {property_url or '—'}",
            "Message:",
            message or "-",
        ]
        body = "\n".join(message_lines)
        property.sudo().message_post(
            body=body,
            message_type="comment",
            subtype_xmlid="mail.mt_note",
            email_from=email or False,
        )
        return request.render(
            "hexclad_estate.estate_property_inquiry_thanks",
            {"property": property},
        )
