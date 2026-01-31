# -*- coding: utf-8 -*-
# HexClad Real Estate Module for Odoo 19
# Built by HexClad Security for RANCS Capital LLC
# License: LGPL-3

{
    "name": "HexClad Real Estate",
    "version": "19.0.1.0.0",
    "category": "Real Estate/Brokerage",
    "summary": "Real Estate Property Management & Investment Tracking",
    "description": """
HexClad Real Estate Management
==============================

A comprehensive real estate module for property investment and management.

Features:
---------
* Property listings with full details
* Property types and tags for organization
* Offer management with accept/refuse workflow
* Investment analysis fields (ARV, rehab costs, cash flow)
* Salesperson assignment and tracking
* State workflow (New → Offer Received → Offer Accepted → Sold/Canceled)

Built by HexClad Security for RANCS Capital LLC.
    """,
    "author": "HexClad Security",
    "website": "https://hexcladsecurity.com",
    "license": "LGPL-3",
    "depends": [
        "base",
        "web",
        "mail",  # For chatter/activity tracking
    ],
    "data": [
        # Security first (for existing models)
        "data/estate_security.xml",
        "security/ir.model.access.csv",
        # Data - stages must be loaded early
        "data/estate_property_stage_data.xml",
        "data/estate_property_type_data.xml",
        "data/estate_property_tag_data.xml",
        # Stage security (after stage model is registered)
        "security/ir.model.access.stage.csv",
        # Views - load related models first
        "views/estate_property_stage_views.xml",
        "views/estate_property_type_views.xml",
        "views/estate_property_tag_views.xml",
        "views/estate_property_offer_views.xml",
        "views/estate_property_views.xml",
        "views/res_users_views.xml",
        "views/estate_menus.xml",
    ],
    "demo": [
        "data/estate_demo.xml",
    ],
    "assets": {
        # Add custom CSS/JS here later if needed
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "sequence": 1,
}
