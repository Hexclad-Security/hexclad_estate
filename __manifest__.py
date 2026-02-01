# -*- coding: utf-8 -*-
# RANCS Capital Real Estate Module for Odoo 19
# Built for RANCS Capital LLC
# License: LGPL-3

{
    "name": "RANCS Capital Real Estate",
    "version": "19.0.1.0.0",
    "category": "Real Estate/Brokerage",
    "summary": "Real Estate Property Management & Investment Tracking for RANCS Capital",
    "description": """
RANCS Capital Real Estate Management
====================================

A comprehensive real estate module for property investment and management.

Features:
---------
* Property listings with full details
* Property types and tags for organization
* Offer management with accept/refuse workflow
* Investment analysis fields (ARV, rehab costs, cash flow)
* Salesperson assignment and tracking
* State workflow (New → Offer Received → Offer Accepted → Sold/Canceled)

Built for RANCS Capital LLC.
    """,
    "author": "RANCS Capital LLC",
    "website": "https://rancscapital.com",
    "license": "LGPL-3",
    "depends": [
        "base",
        "web",
        "mail",  # For chatter/activity tracking
        "website",
    ],
    "data": [
        # Security first (for existing models)
        "data/estate_security.xml",
        "security/estate_website_security.xml",
        "security/ir.model.access.csv",
        # Data - stages must be loaded early
        "data/estate_property_stage_data.xml",
        "data/estate_property_type_data.xml",
        "data/estate_property_tag_data.xml",
        "data/estate_property_utility_data.xml",
        # Views - load related models first
        "views/estate_property_stage_views.xml",
        "views/estate_property_type_views.xml",
        "views/estate_property_tag_views.xml",
        "views/estate_property_utility_views.xml",
        "views/estate_property_offer_views.xml",
        "views/estate_property_views.xml",
        "views/res_users_views.xml",
        "views/estate_property_website.xml",
        "views/estate_menus.xml",
    ],
    "demo": [
        "data/estate_demo.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "hexclad_estate/static/src/css/estate_property.css",
        ],
    },
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": True,
    "auto_install": False,
    "sequence": 1,
}
