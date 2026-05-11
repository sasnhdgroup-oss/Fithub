#!/usr/bin/env python3
"""
Apply mobile UX improvements to O2 Maroc Odoo website.
Run from your Mac: python3 apply_mobile_boost.py
"""
import json
from odoo_integration.client import OdooClient
from odoo_integration.mobile_css import inject_mobile_css
from odoo_integration.fetch_homepage import get_homepage_views


def main():
    client = OdooClient()
    client.authenticate()
    print(f"Connected — user ID: {client.uid}\n")

    # Step 1: fetch homepage structure for reference
    print("Fetching homepage structure...")
    data = get_homepage_views(client)
    print(f"  Homepage views found : {len(data['homepage_views'])}")
    print(f"  Existing mobile views: {len(data['custom_mobile_views'])}")
    for v in data["custom_mobile_views"]:
        print(f"    - {v['name']} (active={v['active']})")

    # Step 2: inject/update mobile CSS
    print("\nInjecting mobile CSS...")
    result = inject_mobile_css(client)
    print(f"  View {result['action']} — id={result['view_id']}, website_id={result['website_id']}")

    print("\nDone. Visit https://www.o2maroc.com on mobile to verify the changes.")
    print("To roll back: deactivate view id", result["view_id"], "in Odoo > Settings > Technical > Views")


if __name__ == "__main__":
    main()
