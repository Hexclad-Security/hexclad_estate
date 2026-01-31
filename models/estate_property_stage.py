# -*- coding: utf-8 -*-

from odoo import fields, models


class EstatePropertyStage(models.Model):
    _name = "estate.property.stage"
    _description = "Property Stage"
    _order = "sequence, id"

    name = fields.Char(string="Stage Name", required=True, translate=True)
    sequence = fields.Integer(string="Sequence", default=10)
    fold = fields.Boolean(
        string="Folded in Pipeline",
        help="This stage is folded in the kanban view when there are no records in that stage to display."
    )
    is_won = fields.Boolean(
        string="Is Won Stage",
        help="Properties in this stage are considered as won/sold."
    )
    is_lost = fields.Boolean(
        string="Is Lost Stage", 
        help="Properties in this stage are considered as lost/canceled."
    )
    requirements = fields.Text(
        string="Requirements",
        help="Enter the internal requirements for this stage. It will appear as a tooltip when moving properties to this stage."
    )
    property_count = fields.Integer(
        string="Property Count",
        compute="_compute_property_count"
    )

    def _compute_property_count(self):
        for stage in self:
            stage.property_count = self.env['estate.property'].search_count([
                ('stage_id', '=', stage.id)
            ])
