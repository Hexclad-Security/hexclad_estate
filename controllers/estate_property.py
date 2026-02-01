# -*- coding: utf-8 -*-

from markupsafe import Markup, escape
from werkzeug.exceptions import NotFound

from odoo import http
from odoo.http import request
from odoo.tools.misc import formatLang


class EstatePropertyWebsite(http.Controller):
    @http.route(["/properties"], type="http", auth="public", website=True, sitemap=True)
    def properties(self, type_id=None, state=None, **kwargs):
        Property = request.env["estate.property"].sudo()
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
        name_safe = escape(name)
        message_safe = escape(message).replace("\n", "<br/>") or "-"
        email_safe = escape(email)
        phone_safe = escape(phone)
        email_html = (
            Markup('<a href="mailto:{0}">{0}</a>').format(email_safe)
            if email_safe
            else "—"
        )
        phone_html = (
            Markup('<a href="tel:{0}">{0}</a>').format(phone_safe)
            if phone_safe
            else "—"
        )
        url_html = (
            Markup('<a href="{0}" target="_blank" rel="noopener">{0}</a>').format(
                escape(property_url)
            )
            if property_url
            else "—"
        )
        body = Markup(
            """
<div>
    <p><strong>Website inquiry</strong></p>
    <ul>
        <li><strong>Name:</strong> {name}</li>
        <li><strong>Email:</strong> {email}</li>
        <li><strong>Phone:</strong> {phone}</li>
        <li><strong>Property URL:</strong> {url}</li>
    </ul>
    <div><strong>Message:</strong><br/>{message}</div>
</div>
"""
        ).format(
            name=name_safe,
            email=email_html,
            phone=phone_html,
            url=url_html,
            message=message_safe,
        )
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
