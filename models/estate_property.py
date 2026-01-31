# -*- coding: utf-8 -*-

from odoo import api, fields, models
from odoo.exceptions import UserError, ValidationError
from odoo.tools import float_compare, float_is_zero
from dateutil.relativedelta import relativedelta


STATE_STAGE_XML_IDS = {
    "new": "stage_new",
    "offer_received": "stage_offer",
    "offer_accepted": "stage_under_contract",
    "sold": "stage_won",
    "canceled": "stage_lost",
}


class EstateProperty(models.Model):
    """
    Main property model for real estate listings.
    
    This is the core model that stores all property information including
    basic details, pricing, investment analysis, and workflow state.
    """
    
    # ----------------------------------------
    # Private Attributes
    # ----------------------------------------
    
    _name = "estate.property"
    _description = "Real Estate Property"
    _order = "id desc"
    _inherit = ["mail.thread", "mail.activity.mixin"]  # Enable chatter
    
    _sql_constraints = [
        (
            "check_expected_price",
            "CHECK(expected_price > 0)",
            "The expected price must be strictly positive",
        ),
        (
            "check_selling_price",
            "CHECK(selling_price >= 0)",
            "The selling price must be positive",
        ),
    ]
    
    # ----------------------------------------
    # Default Methods
    # ----------------------------------------
    
    def _default_date_availability(self):
        """Default availability date is 3 months from today."""
        return fields.Date.context_today(self) + relativedelta(months=3)
    
    def _default_stage_id(self):
        """Get the default stage for new properties."""
        stage_id = self._get_stage_id_for_state("new")
        if stage_id:
            return stage_id
        return self.env['estate.property.stage'].search([], limit=1).id

    def _get_stage_id(self, xml_id):
        """Return stage ID for a given XML ID or False if not found."""
        stage = self.env.ref(f"hexclad_estate.{xml_id}", raise_if_not_found=False)
        return stage.id if stage else False
    
    @api.model
    def _read_group_stage_ids(self, stages, domain):
        """Always display all stages in kanban view."""
        stage_ids = self._get_default_stage_ids()
        if stage_ids:
            return self.env['estate.property.stage'].search(
                [("id", "in", stage_ids)],
                order="sequence",
            )
        return self.env['estate.property.stage'].search([])
    
    # ----------------------------------------
    # Fields Declaration
    # ----------------------------------------
    
    # Basic Info
    name = fields.Char(
        string="Title",
        required=True,
        tracking=True,
    )
    description = fields.Text(string="Description")
    postcode = fields.Char(string="Postcode")
    
    # Address fields
    street = fields.Char(string="Street")
    street2 = fields.Char(string="Street 2")
    city = fields.Char(string="City")
    state_id = fields.Many2one(
        "res.country.state",
        string="State",
        ondelete="restrict",
        domain="[('country_id', '=', country_id)]",
    )
    country_id = fields.Many2one(
        "res.country",
        string="Country",
        ondelete="restrict",
        default=lambda self: self.env.company.country_id,
    )
    
    # Dates
    date_availability = fields.Date(
        string="Available From",
        default=lambda self: self._default_date_availability(),
        copy=False,
    )
    date_created = fields.Date(
        string="Created Date",
        default=fields.Date.context_today,
        readonly=True,
    )
    
    # Pricing
    expected_price = fields.Float(string="Expected Price", required=True, tracking=True)
    selling_price = fields.Float(string="Selling Price", readonly=True, copy=False, tracking=True)
    best_price = fields.Float(string="Best Offer", compute="_compute_best_price")
    
    # Investment Analysis Fields (for NDWCM RE Group)
    purchase_price = fields.Float(string="Purchase Price", help="Actual or estimated purchase price")
    arv = fields.Float(string="ARV (After Repair Value)", help="Estimated value after repairs")
    rehab_cost = fields.Float(string="Rehab Cost", help="Estimated repair/renovation costs")
    closing_costs = fields.Float(string="Closing Costs", help="Estimated closing costs")
    holding_costs = fields.Float(string="Holding Costs", help="Monthly holding costs during rehab")
    potential_profit = fields.Float(
        string="Potential Profit",
        compute="_compute_potential_profit",
        store=True,
        help="ARV - Purchase Price - Rehab Cost - Closing Costs",
    )
    roi_percentage = fields.Float(
        string="ROI %",
        compute="_compute_potential_profit",
        store=True,
        help="Return on Investment percentage",
    )
    
    # Rental Analysis (for buy & hold)
    monthly_rent = fields.Float(string="Monthly Rent", help="Expected monthly rental income")
    monthly_expenses = fields.Float(string="Monthly Expenses", help="Taxes, insurance, maintenance, etc.")
    monthly_cash_flow = fields.Float(
        string="Monthly Cash Flow",
        compute="_compute_cash_flow",
        store=True,
    )
    annual_cash_flow = fields.Float(
        string="Annual Cash Flow",
        compute="_compute_cash_flow",
        store=True,
    )
    cap_rate = fields.Float(
        string="Cap Rate %",
        compute="_compute_cash_flow",
        store=True,
        help="Capitalization rate",
    )
    
    # Property Details
    bedrooms = fields.Integer(string="Bedrooms", default=2)
    bathrooms = fields.Float(string="Bathrooms", default=1)
    living_area = fields.Integer(string="Living Area (sqft)")
    lot_size = fields.Integer(string="Lot Size (sqft)")
    facades = fields.Integer(string="Facades")
    garage = fields.Boolean(string="Garage")
    garden = fields.Boolean(string="Garden")
    garden_area = fields.Integer(string="Garden Area (sqft)")
    garden_orientation = fields.Selection(
        selection=[
            ("N", "North"),
            ("S", "South"),
            ("E", "East"),
            ("W", "West"),
        ],
        string="Garden Orientation",
    )
    total_area = fields.Integer(
        string="Total Area (sqft)",
        compute="_compute_total_area",
        store=True,
    )
    
    # State & Workflow
    stage_id = fields.Many2one(
        "estate.property.stage",
        string="Stage",
        ondelete="restrict",
        tracking=True,
        group_expand="_read_group_stage_ids",
        copy=False,
        index=True,
        default=lambda self: self._default_stage_id(),
    )
    state = fields.Selection(
        selection=[
            ("new", "New"),
            ("offer_received", "Offer Received"),
            ("offer_accepted", "Offer Accepted"),
            ("sold", "Sold"),
            ("canceled", "Canceled"),
        ],
        string="Status",
        required=True,
        copy=False,
        default="new",
        tracking=True,
    )
    active = fields.Boolean(string="Active", default=True)
    
    # Relational Fields
    property_type_id = fields.Many2one(
        "estate.property.type",
        string="Property Type",
    )
    user_id = fields.Many2one(
        "res.users",
        string="Salesperson",
        default=lambda self: self.env.user,
        tracking=True,
    )
    buyer_id = fields.Many2one(
        "res.partner",
        string="Buyer",
        copy=False,
        tracking=True,
    )
    tag_ids = fields.Many2many(
        "estate.property.tag",
        string="Tags",
    )
    offer_ids = fields.One2many(
        "estate.property.offer",
        "property_id",
        string="Offers",
    )
    
    # Images
    image = fields.Image(string="Main Image", max_width=1920, max_height=1920)
    
    # Company (multi-company support)
    company_id = fields.Many2one(
        "res.company",
        string="Company",
        required=True,
        default=lambda self: self.env.company,
    )
    
    # ----------------------------------------
    # Compute Methods
    # ----------------------------------------
    
    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            record.total_area = record.living_area + record.garden_area
    
    @api.depends("offer_ids.price")
    def _compute_best_price(self):
        for record in self:
            if record.offer_ids:
                record.best_price = max(record.offer_ids.mapped("price"))
            else:
                record.best_price = 0.0
    
    @api.depends("arv", "purchase_price", "rehab_cost", "closing_costs")
    def _compute_potential_profit(self):
        for record in self:
            total_investment = (
                record.purchase_price + record.rehab_cost + record.closing_costs
            )
            record.potential_profit = record.arv - total_investment
            if total_investment > 0:
                record.roi_percentage = (record.potential_profit / total_investment) * 100
            else:
                record.roi_percentage = 0.0
    
    @api.depends("monthly_rent", "monthly_expenses", "purchase_price")
    def _compute_cash_flow(self):
        for record in self:
            record.monthly_cash_flow = record.monthly_rent - record.monthly_expenses
            record.annual_cash_flow = record.monthly_cash_flow * 12
            if record.purchase_price > 0:
                noi = record.annual_cash_flow  # Net Operating Income
                record.cap_rate = (noi / record.purchase_price) * 100
            else:
                record.cap_rate = 0.0
    
    # ----------------------------------------
    # Onchange Methods
    # ----------------------------------------
    
    @api.onchange("garden")
    def _onchange_garden(self):
        if self.garden:
            self.garden_area = 100
            self.garden_orientation = "S"
        else:
            self.garden_area = 0
            self.garden_orientation = False
    
    # ----------------------------------------
    # Constraint Methods
    # ----------------------------------------
    
    @api.constrains("selling_price", "expected_price")
    def _check_selling_price(self):
        for record in self:
            if (
                not float_is_zero(record.selling_price, precision_digits=2)
                and float_compare(
                    record.selling_price,
                    record.expected_price * 0.9,
                    precision_digits=2,
                ) < 0
            ):
                raise ValidationError(
                    "The selling price cannot be lower than 90% of the expected price.\n"
                    f"Expected price: {record.expected_price}\n"
                    f"Minimum selling price: {record.expected_price * 0.9}"
                )
    
    # ----------------------------------------
    # CRUD Methods
    # ----------------------------------------

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if "stage_id" not in vals:
                state = vals.get("state", "new")
                stage_id = self._get_stage_id_for_state(state)
                if stage_id:
                    vals["stage_id"] = stage_id
        return super().create(vals_list)

    def write(self, vals):
        if "state" in vals and "stage_id" not in vals:
            stage_id = self._get_stage_id_for_state(vals.get("state"))
            if stage_id:
                vals["stage_id"] = stage_id
        return super().write(vals)
    
    @api.ondelete(at_uninstall=False)
    def _unlink_if_not_new_or_canceled(self):
        for record in self:
            if record.state not in ("new", "canceled"):
                raise UserError(
                    "You cannot delete a property that is not in 'New' or 'Canceled' state."
                )
    
    # ----------------------------------------
    # Action Methods
    # ----------------------------------------

    def action_offer_received(self):
        """Mark property as offer received."""
        for record in self:
            if record.state in ("sold", "canceled"):
                raise UserError("You cannot receive offers on a sold or canceled property.")
            record.write({"state": "offer_received"})
        return True

    def action_offer_accepted(self):
        """Mark property as offer accepted."""
        for record in self:
            if record.state in ("sold", "canceled"):
                raise UserError("You cannot accept offers on a sold or canceled property.")
            record.write({"state": "offer_accepted"})
        return True
    
    def action_sold(self):
        """Mark property as sold."""
        for record in self:
            if record.state == "canceled":
                raise UserError("A canceled property cannot be sold.")
            record.state = "sold"
            stage_id = record._get_stage_id("stage_won")
            if stage_id:
                record.stage_id = stage_id
        return True
    
    def action_cancel(self):
        """Cancel the property listing."""
        for record in self:
            if record.state == "sold":
                raise UserError("A sold property cannot be canceled.")
            record.state = "canceled"
            stage_id = record._get_stage_id("stage_lost")
            if stage_id:
                record.stage_id = stage_id
        return True
    
    def action_reset(self):
        """Reset property to new state."""
        for record in self:
            record.state = "new"
            record.selling_price = 0
            record.buyer_id = False
            stage_id = record._get_stage_id("stage_new")
            if stage_id:
                record.stage_id = stage_id
        return True
