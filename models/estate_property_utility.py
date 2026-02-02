# -*- coding: utf-8 -*-

from odoo import fields, models


class EstatePropertyUtility(models.Model):
    """
    Utility tags for properties.
    Examples: Electric, Sewer, Water, Gas, etc.
    """

    _name = "estate.property.utility"
    _description = "Real Estate Property Utility"
    _order = "name"

    _constraints = [
        models.Constraint(
            "check_name",
            "UNIQUE(name)",
            "The utility name must be unique",
        ),
    ]

    name = fields.Char(string="Name", required=True)
    color = fields.Integer(string="Color")
