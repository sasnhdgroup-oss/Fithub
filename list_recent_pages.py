#!/usr/bin/env python3
from odoo_integration import list_recent_pages

pages = list_recent_pages(limit=5)

if not pages:
    print("Aucune page trouvée.")
else:
    print(f"{'#':<4} {'Titre':<40} {'URL':<35} {'Publiée':<8} {'Créée le'}")
    print("-" * 100)
    for i, p in enumerate(pages, 1):
        print(
            f"{i:<4} {(p.get('name') or ''):<40} {(p.get('url') or ''):<35} "
            f"{'Oui' if p.get('website_published') else 'Non':<8} {p.get('create_date', '')}"
        )
