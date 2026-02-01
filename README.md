# RANCS Capital Real Estate Module for Odoo 19

A comprehensive real estate property management module built for **RANCS Capital LLC** operations.

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
4. Search for "RANCS Capital Real Estate" and install

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
- `website` - Public website publishing and routing

**No Enterprise or paid modules required!**

## Website Listings (Publish/Unpublish + Public Pages)

This module already ships a public listings page and detail page:

- **Listings:** `/properties`
- **Detail:** `/properties/<slug>`

### 1) Set up the page in Website

1. Ensure the **Website** app is installed (dependency is already in `__manifest__.py`).
2. Go to **Website → Configuration → Menus** and add a menu item:
   - **Name:** Properties
   - **URL:** `/properties`
3. (Optional) Use Website → Edit to add static content blocks above or below the listing by inheriting the
   `estate_property_listing` template in `views/estate_property_website.xml`.

### 2) Publish/Unpublish a property safely

Each property uses `website.published.mixin`, so the **Publish/Unpublish** button on the form controls
`website_published`. The public site will only show properties that are:

- `website_published = True`
- `active = True`

This check is enforced in **both**:

- the website controllers (`controllers/estate_property.py`), and
- record rules for public/portal users (`security/estate_website_security.xml`).

### 3) URL + SEO-friendly slug (Sales-style)

Like Sales/Website Sale, we compute `website_url` with a slug, so URLs look like:

```
/properties/123-modern-4br-in-dallas
```

This is handled by `_compute_website_url` in `models/estate_property.py` using Odoo’s `slug()` helper.

### 4) Safe, standards-aligned public access

- **Routing:** `/properties` and `/properties/<model>` are public routes that only render published records.
- **CSRF protection:** inquiry POSTs include `csrf_token` and the route enforces `csrf=True`.
- **Access control:** record rules block public users from seeing unpublished/inactive data.

If you want to hide sold/canceled listings, add a state filter to the controller domain:

```
domain += [("state", "not in", ("sold", "canceled"))]
```

## Future Enhancements

This module provides a solid foundation. Planned additions:
- n8n webhook integrations for automated workflows
- PDF reports for property analysis
- Lead management integration
- Property import from CSV/Excel

## License

LGPL-3

## Author

RANCS Capital LLC

---

Built with ❤️ for real estate investors
