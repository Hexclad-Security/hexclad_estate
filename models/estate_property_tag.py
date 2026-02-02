# -*- coding: utf-8 -*-

from odoo import fields, models


class EstatePropertyTag(models.Model):
    """
    Tags for labeling properties.
    Examples: Renovated, Fixer Upper, Investment, Rental, etc.
    """
    
    # ----------------------------------------
    # Private Attributes
    # ----------------------------------------
    
    _name = "estate.property.tag"
    _description = "Real Estate Property Tag"
    _order = "name"
    
    _constraints = [
        models.Constraint(
            "check_name",
            "UNIQUE(name)",
            "The tag name must be unique",
        ),
    ]
    
    # ----------------------------------------
    # Fields Declaration
    # ----------------------------------------
    
    name = fields.Char(string="Name", required=True)
    color = fields.Integer(string="Color")
    
    # For quick filtering in Kanban views
    property_count = fields.Integer(
        string="Properties",
        compute="_compute_property_count",
    )
    
    # ----------------------------------------
    # Compute Methods
    # ----------------------------------------
    
    def _compute_property_count(self):
        for record in self:
            record.property_count = self.env["estate.property"].search_count([
                ("tag_ids", "in", record.id)
            ])
