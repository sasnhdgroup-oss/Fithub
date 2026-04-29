from .client import OdooClient


def list_recent_pages(limit=5, client=None):
    if client is None:
        client = OdooClient()

    records = client.execute(
        "website.page",
        "search_read",
        [],
        fields=["name", "url", "website_published", "create_date", "write_date"],
        order="create_date desc",
        limit=limit,
    )
    return records
