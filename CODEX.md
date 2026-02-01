# Codex Context

This is a custom Odoo 19 Community Edition module called `hexclad_estate`.

## Framework
- Odoo 19 Community Edition (open source, Python-based ERP)
- No internet access needed — write all code based on standard Odoo 19 patterns
- Do NOT try to pip install anything or fetch external packages

## How Odoo Modules Work
- `__manifest__.py` declares the module metadata and dependencies
- `models/` contains Python files that define database models (inherit from `models.Model`)
- `views/` contains XML files for backend UI (list views, form views) and website templates (QWeb)
- `controllers/` contains Python route handlers for website pages (inherit from `http.Controller`)
- `security/ir.model.access.csv` defines who can read/write each model
- `data/` contains XML data files loaded on install
- Templates use Odoo's QWeb syntax, not Jinja or Django templates

## Your Task
Read all existing files in this repo before making changes. The prompt will tell you what to build.
