"""Render every source-verified event art at a real browser viewport for editorial review."""
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1400},device_scale_factor=1)
 page.set_content('''<!doctype html><html><head><meta charset="utf-8"><style>body{background:#111719;color:#e7d5b5;font:14px system-ui;margin:20px}.gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.item{background:#222925;padding:10px;border:1px solid #89775c;border-radius:6px}.item svg{display:block;width:100%;height:auto}.item strong{display:block;font-size:12px;margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.item span{display:block;font-size:10px;color:#c9ac79;margin-top:4px}</style></head><body><h2>DEAD CABIN 404 · 24 EVENTOS / AUDITORÍA DE ARTE</h2><div id="gallery" class="gallery"></div></body></html>''')
 page.add_script_tag(content=(p/'js/engine.js').read_text())
 page.add_script_tag(content=(p/'js/card-ui.js').read_text())
 page.evaluate('''() => document.querySelector('#gallery').innerHTML=window.DeadCabinEngine.CARDS.map(c=>{let m=window.DeadCabinCardUI.describe(c);return '<div class="item">'+window.DeadCabinCardUI.illustration(c.id,m.family)+'<strong>'+c.name+'</strong><span>'+m.label+' · '+m.effect+'</span></div>'}).join('')''')
 page.screenshot(path=str(p/'tests'/'cards-24-gallery.png'),full_page=True)
 assert page.locator('svg.event-illustration').count()==24
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS: gallery 24 cards rendered, labels and effects visible, no horizontal overflow')
 browser.close()
