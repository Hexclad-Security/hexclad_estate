# -*- coding: utf-8 -*-

from odoo import api, SUPERUSER_ID


STAGE_UPDATES = {
    "stage_new": {"name": "New", "sequence": 10, "is_won": False, "is_lost": False, "fold": False},
    "stage_offer": {"name": "Offer Received", "sequence": 20, "is_won": False, "is_lost": False, "fold": False},
    "stage_under_contract": {
        "name": "Offer Accepted",
        "sequence": 30,
        "is_won": False,
        "is_lost": False,
        "fold": False,
    },
    "stage_won": {"name": "Sold", "sequence": 40, "is_won": True, "is_lost": False, "fold": False},
    "stage_lost": {"name": "Canceled", "sequence": 50, "is_won": False, "is_lost": True, "fold": True},
}


def post_init_hook(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    for xml_id, values in STAGE_UPDATES.items():
        stage = env.ref(f"hexclad_estate.{xml_id}", raise_if_not_found=False)
        if stage:
            stage.write(values)

    properties = env["estate.property"].search([])
    for property_record in properties:
        stage_id = property_record._get_stage_id_for_state(property_record.state)
        if stage_id and property_record.stage_id.id != stage_id:
            property_record.stage_id = stage_id
