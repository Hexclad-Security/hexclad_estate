# -*- coding: utf-8 -*-

from odoo import fields, models


class ResUsers(models.Model):
    """
    Extend res.users to add real estate properties assigned to each user.
    """
    
    _inherit = "res.users"
    
    # ----------------------------------------
    # Fields Declaration
    # ----------------------------------------
    
    property_ids = fields.One2many(
        "estate.property",
        "user_id",
        string="Assigned Properties",
        domain=[("state", "in", ["new", "offer_received", "offer_accepted"])],
    )
