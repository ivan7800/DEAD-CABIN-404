"""Cards archive regression: all cards and filters using DOM controls in Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
p=Path(__file__).resolve().parents[1]
source=(p/'CARTAS-24.html').read_text()
styles=[(p/'css'/'style.css').read_text(),(p/'css'/'edition21.css').read_text()]
source=re.sub(r'<link rel="stylesheet" href="css/[^\"]+">','',source)
source=source.replace('</head>','<style>'+''.join(styles)+'</style></head>')
source=re.sub(r'<script src="js/[^\"]+" defer></script>','',source)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1200,'height':900})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 # Gallery script registers a DOMContentLoaded handler, so source must load after modules.
 source=source.replace('<script>\nwindow.addEventListener', '<script>\nwindow.addEventListener')
 page.set_content(source,wait_until='load')
 for name in ['engine.js','card-ui.js']:
  page.add_script_tag(content=(p/'js'/name).read_text())
 page.evaluate('window.dispatchEvent(new Event("DOMContentLoaded"))')
 assert page.locator('#gallery .event-card').count()==24
 for family in ['threat','occult','hope','supply']:
  page.locator(f'[data-show="{family}"]').click()
  visible=page.locator('#gallery .event-card:visible').count()
  expected=page.locator(f'#gallery .event-card[data-family="{family}"]').count()
  assert visible==expected and visible>0,(family,visible,expected)
 page.locator('[data-show="all"]').click()
 assert page.locator('#gallery .event-card:visible').count()==24
 assert not errors,errors
 print('PASS: 24 cards in archive and all four category filters in Chromium')
 b.close()
