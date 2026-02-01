# -*- coding: utf-8 -*-

from werkzeug.exceptions import NotFound

from odoo import http
from odoo.http import request


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
        return request.render(
            "hexclad_estate.estate_property_detail",
            {"property": property},
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
        email = post.get("email")
        phone = post.get("phone")
        message = post.get("message") or ""
        body = """<p><strong>Website inquiry</strong></p>
<ul>
    <li><strong>Name:</strong> {}</li>
    <li><strong>Email:</strong> {}</li>
    <li><strong>Phone:</strong> {}</li>
</ul>
<p>{}</p>""".format(name, email or "", phone or "", message)
        property.sudo().message_post(
            body=body,
            message_type="comment",
            subtype_xmlid="mail.mt_comment",
            email_from=email,
        )
        return request.render(
            "hexclad_estate.estate_property_inquiry_thanks",
            {"property": property},
        )
