# HexClad Real Estate Module for Odoo 19

A comprehensive real estate property management module built for **NDWCM RE Group** operations.

## Features

### Core Property Management
- **Property Listings** - Full property details including address, bedrooms, bathrooms, sqft, etc.
- **Property Types** - Categorize properties (House, Apartment, Condo, Duplex, etc.)
- **Property Tags** - Label properties for quick filtering (Investment, Rental, Flip, Fixer Upper, etc.)
- **Offer Management** - Track buyer offers with accept/refuse workflow
- **State Workflow** - New → Offer Received → Offer Accepted → Sold/Canceled

### Investment Analysis (Built for Real Estate Investors)
- **Flip Analysis**
  - Purchase Price
  - ARV (After Repair Value)
  - Rehab Cost
  - Closing Costs
  - Holding Costs
  - Auto-calculated Potential Profit
  - Auto-calculated ROI %

- **Rental Analysis (Buy & Hold)**
  - Monthly Rent
  - Monthly Expenses
  - Auto-calculated Monthly/Annual Cash Flow
  - Auto-calculated Cap Rate %

### Additional Features
- Multi-company support
- Activity tracking (via Chatter)
- Kanban view organized by state
- Salesperson assignment
- Image attachments

## Installation

1. Copy the `hexclad_estate` folder to your Odoo custom addons directory
2. Restart Odoo
3. Go to Apps and click "Update Apps List"
4. Search for "HexClad Real Estate" and install

## Directory Structure

```
hexclad_estate/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   ├── estate_property.py        # Main property model
│   ├── estate_property_type.py   # Property types
│   ├── estate_property_tag.py    # Property tags
│   ├── estate_property_offer.py  # Buyer offers
│   └── res_users.py              # User extension
├── views/
│   ├── estate_property_views.xml
│   ├── estate_property_type_views.xml
│   ├── estate_property_tag_views.xml
│   ├── estate_property_offer_views.xml
│   ├── res_users_views.xml
│   └── estate_menus.xml
├── security/
│   ├── estate_security.xml       # Groups
│   └── ir.model.access.csv       # Access rights
├── data/
│   ├── estate_property_type_data.xml
│   ├── estate_property_tag_data.xml
│   └── estate_demo.xml           # Demo data
└── static/
    └── description/
        └── icon.svg
```

## Security Groups

- **Real Estate / Agent** - Can view and manage assigned properties
- **Real Estate / Manager** - Full access to all properties and settings

## Dependencies

- `base` - Core Odoo
- `web` - Web interface
- `mail` - For chatter/activity tracking

**No Enterprise or paid modules required!**

## Future Enhancements

This module provides a solid foundation. Planned additions:
- Website frontend for public property listings
- n8n webhook integrations for automated workflows
- PDF reports for property analysis
- Lead management integration
- Property import from CSV/Excel

## License

LGPL-3

## Author

HexClad Security / NDWCM RE Group

---

Built with ❤️ for real estate investors
