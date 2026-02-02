# -*- coding: utf-8 -*-

from odoo import api, fields, models


class EstatePropertyType(models.Model):
    """
    Property types for categorizing properties.
    Examples: House, Apartment, Land, Commercial, etc.
    """
    
    # ----------------------------------------
    # Private Attributes
    # ----------------------------------------
    
    _name = "estate.property.type"
    _description = "Real Estate Property Type"
    _order = "sequence, name"
    
    _constraints = [
        models.Constraint(
            "check_name",
            "UNIQUE(name)",
            message="The property type name must be unique",
        ),
    ]
    
    # ----------------------------------------
    # Fields Declaration
    # ----------------------------------------
    
    name = fields.Char(string="Name", required=True)
    sequence = fields.Integer(string="Sequence", default=10)
    
    # Relational fields
    property_ids = fields.One2many(
        "estate.property",
        "property_type_id",
        string="Properties",
    )
    
    # Computed fields for stat buttons
    offer_ids = fields.Many2many(
        "estate.property.offer",
        string="Offers",
        compute="_compute_offer",
    )
    offer_count = fields.Integer(
        string="Offers Count",
        compute="_compute_offer",
    )
    property_count = fields.Integer(
        string="Properties Count",
        compute="_compute_property_count",
    )
    
    # ----------------------------------------
    # Compute Methods
    # ----------------------------------------
    
    @api.depends("property_ids.offer_ids")
    def _compute_offer(self):
        for record in self:
            offers = record.property_ids.mapped("offer_ids")
            record.offer_ids = offers
            record.offer_count = len(offers)
    
    @api.depends("property_ids")
    def _compute_property_count(self):
        for record in self:
            record.property_count = len(record.property_ids)
    
    # ----------------------------------------
    # Action Methods
    # ----------------------------------------
    
    def action_view_offers(self):
        """Open a view with all offers for this property type."""
        self.ensure_one()
        return {
            "type": "ir.actions.act_window",
            "name": f"Offers for {self.name}",
            "res_model": "estate.property.offer",
            "view_mode": "tree,form",
            "domain": [("property_type_id", "=", self.id)],
            "context": {"default_property_type_id": self.id},
        }
    
    def action_view_properties(self):
        """Open a view with all properties of this type."""
        self.ensure_one()
        return {
            "type": "ir.actions.act_window",
            "name": f"{self.name} Properties",
            "res_model": "estate.property",
            "view_mode": "tree,form,kanban",
            "domain": [("property_type_id", "=", self.id)],
            "context": {"default_property_type_id": self.id},
        }
