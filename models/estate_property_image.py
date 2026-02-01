# -*- coding: utf-8 -*-

from odoo import fields, models


class EstatePropertyImage(models.Model):
    _name = "estate.property.image"
    _description = "Estate Property Image"
    _order = "sequence, id"

    name = fields.Char(string="Name")
    property_id = fields.Many2one(
        "estate.property",
        string="Property",
        required=True,
        ondelete="cascade",
    )
    sequence = fields.Integer(default=10)
    image_1920 = fields.Image(
        string="Image",
        max_width=1920,
        max_height=1920,
    )
