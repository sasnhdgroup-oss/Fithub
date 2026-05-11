"""Fetches the homepage ir.ui.view arch from Odoo for analysis."""
from .client import OdooClient


def get_homepage_views(client=None):
    if client is None:
        client = OdooClient()

    # Find the website page at URL /
    pages = client.execute(
        "website.page",
        "search_read",
        [[["url", "in", ["/", "/home"]]]],
        fields=["name", "url", "view_id", "website_published"],
        limit=5,
    )

    views = []
    for page in pages:
        if page.get("view_id"):
            view_id = page["view_id"][0]
            view = client.execute(
                "ir.ui.view",
                "read",
                [view_id],
                fields=["name", "arch", "key", "inherit_id", "website_id"],
            )
            if view:
                views.append({"page": page, "view": view[0]})

    # Also fetch any existing custom mobile CSS views
    custom_views = client.execute(
        "ir.ui.view",
        "search_read",
        [[["name", "ilike", "mobile"], ["website_id", "!=", False]]],
        fields=["name", "arch", "key", "active"],
        limit=10,
    )

    return {"homepage_views": views, "custom_mobile_views": custom_views}
