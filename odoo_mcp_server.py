#!/usr/bin/env python3
"""MCP server exposing Odoo tools to Claude via XML-RPC."""

import xmlrpc.client
import json
import os
import ssl
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

ODOO_URL  = os.getenv("ODOO_URL",      "https://www.o2maroc.com")
ODOO_DB   = os.getenv("ODOO_DB",       "o2maroc")
ODOO_USER = os.getenv("ODOO_USER",     "admin")
ODOO_PASS = os.getenv("ODOO_PASSWORD", os.getenv("ODOO_PASS", "admin"))
# ODOO_YOLO=true skips SSL verification (useful for self-signed certs)
ODOO_YOLO = os.getenv("ODOO_YOLO", "").lower() in ("1", "true", "yes")

server = Server("odoo-o2maroc")

# ── helpers ────────────────────────────────────────────────────────────────

def _ssl_context():
    if ODOO_YOLO:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    ca = os.getenv("SSL_CERT_FILE") or os.getenv("REQUESTS_CA_BUNDLE")
    if ca:
        ctx = ssl.create_default_context(cafile=ca)
        return ctx
    return None

def _proxy(path):
    url = f"{ODOO_URL}{path}"
    ctx = _ssl_context()
    if ctx:
        return xmlrpc.client.ServerProxy(url, context=ctx)
    return xmlrpc.client.ServerProxy(url)

def _connect():
    common = _proxy("/xmlrpc/2/common")
    uid    = common.authenticate(ODOO_DB, ODOO_USER, ODOO_PASS, {})
    if not uid:
        raise RuntimeError("Odoo authentication failed. Check ODOO_URL / ODOO_DB / ODOO_USER / ODOO_PASSWORD.")
    models = _proxy("/xmlrpc/2/object")
    return uid, models

def _exec(model, method, *args, **kw):
    uid, models = _connect()
    return models.execute_kw(ODOO_DB, uid, ODOO_PASS, model, method, list(args), kw)

def _fmt(records):
    return json.dumps(records, indent=2, default=str)

# ── tool definitions ───────────────────────────────────────────────────────

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="odoo_search_read",
            description="Search & read records from any Odoo model.",
            inputSchema={
                "type": "object",
                "properties": {
                    "model":   {"type": "string", "description": "e.g. res.partner, sale.order"},
                    "domain":  {"type": "array",  "description": "Odoo domain filter, e.g. [[\"active\",\"=\",true]]", "default": []},
                    "fields":  {"type": "array",  "description": "List of field names to return", "default": []},
                    "limit":   {"type": "integer","description": "Max records to return", "default": 10},
                    "offset":  {"type": "integer","description": "Pagination offset", "default": 0},
                },
                "required": ["model"],
            },
        ),
        Tool(
            name="odoo_create",
            description="Create a new record in an Odoo model.",
            inputSchema={
                "type": "object",
                "properties": {
                    "model":  {"type": "string"},
                    "values": {"type": "object", "description": "Field values for the new record"},
                },
                "required": ["model", "values"],
            },
        ),
        Tool(
            name="odoo_write",
            description="Update existing records in an Odoo model.",
            inputSchema={
                "type": "object",
                "properties": {
                    "model":  {"type": "string"},
                    "ids":    {"type": "array",  "items": {"type": "integer"}},
                    "values": {"type": "object"},
                },
                "required": ["model", "ids", "values"],
            },
        ),
        Tool(
            name="odoo_unlink",
            description="Delete records from an Odoo model.",
            inputSchema={
                "type": "object",
                "properties": {
                    "model": {"type": "string"},
                    "ids":   {"type": "array", "items": {"type": "integer"}},
                },
                "required": ["model", "ids"],
            },
        ),
        Tool(
            name="odoo_fields_get",
            description="Get field definitions for an Odoo model (schema introspection).",
            inputSchema={
                "type": "object",
                "properties": {
                    "model":      {"type": "string"},
                    "attributes": {"type": "array", "default": ["string", "type", "required"]},
                },
                "required": ["model"],
            },
        ),
        Tool(
            name="odoo_call",
            description="Call any method on an Odoo model (e.g. action_confirm on sale.order).",
            inputSchema={
                "type": "object",
                "properties": {
                    "model":  {"type": "string"},
                    "method": {"type": "string"},
                    "ids":    {"type": "array", "items": {"type": "integer"}, "default": []},
                    "kwargs": {"type": "object", "default": {}},
                },
                "required": ["model", "method"],
            },
        ),
    ]

# ── tool handlers ──────────────────────────────────────────────────────────

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    try:
        if name == "odoo_search_read":
            result = _exec(
                arguments["model"], "search_read",
                arguments.get("domain", []),
                fields=arguments.get("fields", []),
                limit=arguments.get("limit", 10),
                offset=arguments.get("offset", 0),
            )
            return [TextContent(type="text", text=_fmt(result))]

        elif name == "odoo_create":
            new_id = _exec(arguments["model"], "create", arguments["values"])
            return [TextContent(type="text", text=f"Created record id={new_id}")]

        elif name == "odoo_write":
            ok = _exec(arguments["model"], "write", arguments["ids"], arguments["values"])
            return [TextContent(type="text", text=f"Write OK: {ok}")]

        elif name == "odoo_unlink":
            ok = _exec(arguments["model"], "unlink", arguments["ids"])
            return [TextContent(type="text", text=f"Deleted: {ok}")]

        elif name == "odoo_fields_get":
            fields = _exec(
                arguments["model"], "fields_get",
                attributes=arguments.get("attributes", ["string", "type", "required"]),
            )
            return [TextContent(type="text", text=_fmt(fields))]

        elif name == "odoo_call":
            result = _exec(
                arguments["model"], arguments["method"],
                arguments.get("ids", []),
                **arguments.get("kwargs", {}),
            )
            return [TextContent(type="text", text=_fmt(result))]

        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]

    except Exception as exc:
        return [TextContent(type="text", text=f"Error: {exc}")]

# ── entry point ────────────────────────────────────────────────────────────

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
