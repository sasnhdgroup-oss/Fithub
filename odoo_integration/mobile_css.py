"""Injects or updates a mobile-optimized CSS view into Odoo website."""
from .client import OdooClient

MOBILE_CSS = """
<t t-name="website_o2maroc.mobile_devis_boost">
  <xpath expr="//head" position="inside">
    <style>
/* ===== O2 MAROC — MOBILE BOOST CSS ===== */
@media (max-width: 768px) {

  /* --- Typographie lisible --- */
  body { font-size: 16px !important; line-height: 1.6 !important; }
  h1 { font-size: 1.7rem !important; line-height: 1.3 !important; }
  h2 { font-size: 1.4rem !important; }
  p  { font-size: 1rem !important; }

  /* --- Hero section plein écran --- */
  .o_hero, [class*="hero"], .s_banner, .s_cover {
    min-height: 60vh !important;
    padding: 24px 16px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    text-align: center !important;
  }

  /* --- Tous les boutons touch-friendly --- */
  .btn, a.btn, button {
    min-height: 48px !important;
    font-size: 1rem !important;
    padding: 12px 20px !important;
    border-radius: 8px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* --- CTA principal (devis) très visible --- */
  .btn-primary, a.btn-primary,
  [href*="devis"], [href*="contact"],
  [class*="cta"] {
    background: #e8491e !important;
    border-color: #e8491e !important;
    color: #fff !important;
    font-weight: 700 !important;
    font-size: 1.05rem !important;
    width: 100% !important;
    box-shadow: 0 4px 14px rgba(232,73,30,0.35) !important;
  }

  /* --- Formulaire devis optimisé --- */
  .s_website_form, form, [class*="form"] {
    padding: 20px 16px !important;
    border-radius: 12px !important;
    background: #fff !important;
    box-shadow: 0 2px 20px rgba(0,0,0,0.10) !important;
    margin: 0 8px 24px !important;
  }
  .s_website_form input,
  .s_website_form textarea,
  .s_website_form select,
  form input, form textarea, form select {
    font-size: 1rem !important;
    padding: 12px 14px !important;
    min-height: 48px !important;
    border-radius: 8px !important;
    border: 1.5px solid #ddd !important;
    width: 100% !important;
    margin-bottom: 12px !important;
  }
  .s_website_form .btn[type="submit"],
  form .btn[type="submit"] {
    width: 100% !important;
    background: #e8491e !important;
    border-color: #e8491e !important;
    color: #fff !important;
    font-weight: 700 !important;
    font-size: 1.1rem !important;
    padding: 14px !important;
  }

  /* --- Sticky CTA bar en bas d'écran --- */
  #o2-sticky-cta {
    position: fixed !important;
    bottom: 0 !important; left: 0 !important; right: 0 !important;
    z-index: 9999 !important;
    background: #fff !important;
    padding: 10px 16px !important;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.15) !important;
    display: flex !important;
    gap: 10px !important;
  }
  #o2-sticky-cta a {
    flex: 1 !important;
    text-align: center !important;
    padding: 12px 8px !important;
    border-radius: 8px !important;
    font-weight: 700 !important;
    font-size: 0.95rem !important;
    text-decoration: none !important;
  }
  #o2-sticky-cta .o2-cta-devis {
    background: #e8491e !important;
    color: #fff !important;
  }
  #o2-sticky-cta .o2-cta-tel {
    background: #f0f0f0 !important;
    color: #333 !important;
    border: 1.5px solid #ddd !important;
  }

  /* Éviter que le contenu se cache derrière la sticky bar */
  body { padding-bottom: 72px !important; }

  /* --- Sections trop larges/padding desktop --- */
  section, .container, .o_container_small {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  /* --- Images responsives --- */
  img { max-width: 100% !important; height: auto !important; }

  /* --- Espacement des cartes services --- */
  .card, [class*="service-card"], [class*="s_card"] {
    margin-bottom: 16px !important;
    border-radius: 10px !important;
  }

  /* --- Navigation plus accessible --- */
  .navbar .nav-link {
    font-size: 1rem !important;
    padding: 10px 12px !important;
  }

}
/* ===== FIN O2 MAROC MOBILE BOOST ===== */
    </style>
    <script>
      /* Sticky CTA bar — injectée dynamiquement si absente */
      document.addEventListener('DOMContentLoaded', function() {
        if (window.innerWidth <= 768 &amp;&amp; !document.getElementById('o2-sticky-cta')) {
          var bar = document.createElement('div');
          bar.id = 'o2-sticky-cta';
          bar.innerHTML =
            '<a href="#o2-devis,#contact,#wrapwrap form" class="o2-cta-devis" ' +
            'onclick="var f=document.querySelector(\'form,#o2-devis,[data-snippet=s_website_form]\');' +
            'if(f){f.scrollIntoView({behavior:\'smooth\'});return false;}">📋 Demander un devis</a>' +
            '<a href="tel:+212XXXXXXXXX" class="o2-cta-tel">📞 Appeler</a>';
          document.body.appendChild(bar);
        }
      });
    </script>
  </xpath>
</t>
"""

VIEW_KEY = "website_o2maroc.mobile_devis_boost"
VIEW_NAME = "O2 Maroc — Mobile Boost (devis CTA)"


def inject_mobile_css(client=None):
    if client is None:
        client = OdooClient()

    # Find the website id
    websites = client.execute(
        "website", "search_read", [[]], fields=["id", "name", "domain"], limit=1
    )
    website_id = websites[0]["id"] if websites else False

    # Find the main website layout view to inherit from
    layout_views = client.execute(
        "ir.ui.view",
        "search_read",
        [[["key", "=", "website.layout"]]],
        fields=["id", "name", "key"],
        limit=1,
    )
    inherit_id = layout_views[0]["id"] if layout_views else False

    # Check if our custom view already exists
    existing = client.execute(
        "ir.ui.view",
        "search_read",
        [[["key", "=", VIEW_KEY]]],
        fields=["id", "name", "active"],
        limit=1,
    )

    if existing:
        view_id = existing[0]["id"]
        client.execute(
            "ir.ui.view",
            "write",
            [[view_id]],
            {"arch": MOBILE_CSS, "active": True},
        )
        action = "updated"
    else:
        view_id = client.execute(
            "ir.ui.view",
            "create",
            [
                {
                    "name": VIEW_NAME,
                    "key": VIEW_KEY,
                    "type": "qweb",
                    "arch": MOBILE_CSS,
                    "inherit_id": inherit_id,
                    "website_id": website_id,
                    "active": True,
                    "priority": 99,
                }
            ],
        )
        action = "created"

    return {"action": action, "view_id": view_id, "website_id": website_id}
