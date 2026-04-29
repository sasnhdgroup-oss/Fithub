import os
import ssl
import xmlrpc.client
from dotenv import load_dotenv

load_dotenv()


class OdooClient:
    def __init__(self):
        self.url = os.environ["ODOO_URL"].rstrip("/")
        self.db = os.environ["ODOO_DB"]
        self.user = os.environ["ODOO_USER"]
        self.password = os.environ["ODOO_PASSWORD"]
        self.yolo = os.getenv("ODOO_YOLO", "false").lower() == "true"
        self.uid = None
        self._models = None

        transport = None
        if self.yolo:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            transport = xmlrpc.client.SafeTransport(context=ctx)

        common_url = f"{self.url}/xmlrpc/2/common"
        self._common = xmlrpc.client.ServerProxy(common_url, transport=transport)
        models_url = f"{self.url}/xmlrpc/2/object"
        self._models_proxy = xmlrpc.client.ServerProxy(models_url, transport=transport)

    def authenticate(self):
        self.uid = self._common.authenticate(self.db, self.user, self.password, {})
        if not self.uid:
            raise ConnectionError(f"Authentication failed for user {self.user}")
        return self.uid

    def execute(self, model, method, *args, **kwargs):
        if not self.uid:
            self.authenticate()
        return self._models_proxy.execute_kw(
            self.db, self.uid, self.password, model, method, list(args), kwargs
        )
