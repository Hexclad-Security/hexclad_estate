# -*- coding: utf-8 -*-

from odoo import api, fields, models
from odoo.exceptions import UserError
from odoo.tools import float_compare
from dateutil.relativedelta import relativedelta


class EstatePropertyOffer(models.Model):
    """
    Offers made on properties.
    Tracks buyer offers with accept/refuse workflow.
    """
    
    # ----------------------------------------
    # Private Attributes
    # ----------------------------------------
    
    _name = "estate.property.offer"
    _description = "Real Estate Property Offer"
    _order = "price desc"
    
    _sql_constraints = [
        (
            "check_price",
            "CHECK(price > 0)",
            "The offer price must be strictly positive",
        ),
    ]
    
    # ----------------------------------------
    # Fields Declaration
    # ----------------------------------------
    
    # Basic fields
    price = fields.Float(string="Price", required=True)
    validity = fields.Integer(string="Validity (days)", default=7)
    
    # Dates
    date_deadline = fields.Date(
        string="Deadline",
        compute="_compute_date_deadline",
        inverse="_inverse_date_deadline",
        store=True,
    )
    create_date = fields.Datetime(string="Create Date", readonly=True)
    
    # State
    state = fields.Selection(
        selection=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("refused", "Refused"),
        ],
        string="Status",
        copy=False,
        default="pending",
    )
    
    # Relational fields
    partner_id = fields.Many2one(
        "res.partner",
        string="Buyer",
        required=True,
    )
    property_id = fields.Many2one(
        "estate.property",
        string="Property",
        required=True,
        ondelete="cascade",
    )
    
    # Related fields for convenience
    property_type_id = fields.Many2one(
        "estate.property.type",
        related="property_id.property_type_id",
        string="Property Type",
        store=True,
    )
    
    # ----------------------------------------
    # Compute Methods
    # ----------------------------------------
    
    @api.depends("validity", "create_date")
    def _compute_date_deadline(self):
        for record in self:
            if record.create_date:
                record.date_deadline = record.create_date.date() + relativedelta(days=record.validity)
            else:
                record.date_deadline = fields.Date.context_today(record) + relativedelta(days=record.validity)
    
    def _inverse_date_deadline(self):
        for record in self:
            if record.date_deadline and record.create_date:
                record.validity = (record.date_deadline - record.create_date.date()).days
            elif record.date_deadline:
                record.validity = (record.date_deadline - fields.Date.context_today(record)).days
    
    # ----------------------------------------
    # CRUD Methods
    # ----------------------------------------
    
    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            property_id = vals.get("property_id")
            if property_id:
                property_obj = self.env["estate.property"].browse(property_id)
                
                # Check if property accepts offers
                if property_obj.state in ("sold", "canceled"):
                    raise UserError(
                        f"Cannot create offer: Property '{property_obj.name}' is {property_obj.state}."
                    )
                
                # Check if offer is higher than existing offers
                if property_obj.offer_ids:
                    max_offer = max(property_obj.offer_ids.mapped("price"))
                    if float_compare(vals.get("price", 0), max_offer, precision_digits=2) <= 0:
                        raise UserError(
                            f"The offer must be higher than {max_offer:.2f}"
                        )
                
                # Update property state
                property_obj.state = "offer_received"
                stage_id = property_obj._get_stage_id("stage_offer")
                if stage_id:
                    property_obj.stage_id = stage_id
        
        return super().create(vals_list)
    
    # ----------------------------------------
    # Action Methods
    # ----------------------------------------
    
    def action_accept(self):
        """Accept this offer."""
        for record in self:
            if record.property_id.state in ("sold", "canceled"):
                raise UserError("This property is no longer available for offer acceptance.")
            
            # Refuse all other offers
            other_offers = record.property_id.offer_ids.filtered(
                lambda o: o.id != record.id and o.state == "pending"
            )
            other_offers.action_refuse()
            
            # Update offer state
            record.state = "accepted"
            
            # Update property
            record.property_id.write({
                "state": "offer_accepted",
                "selling_price": record.price,
                "buyer_id": record.partner_id.id,
            })
            stage_id = record.property_id._get_stage_id("stage_under_contract")
            if stage_id:
                record.property_id.stage_id = stage_id
        
        return True
    
    def action_refuse(self):
        """Refuse this offer."""
        for record in self:
            if record.state == "accepted":
                raise UserError("Cannot refuse an accepted offer.")
            record.state = "refused"
        return True
    
    def action_reset(self):
        """Reset offer to pending (for testing/admin purposes)."""
        for record in self:
            record.state = "pending"
        return True
