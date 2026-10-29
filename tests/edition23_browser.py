"""Regresión real en Chromium de la restauración transaccional y el panel táctico v2.3."""
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[1]
html=(p/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="css/[^"]+">','',html)
html=re.sub(r'<script src="js/[^"]+" defer></script>','',html)
styles='\n'.join((p/'css'/name).read_text() for name in ['style.css','premium.css','cinematic.css','illustration.css','edition18.css','edition20.css','edition21.css','edition22.css','edition23.css'])
html=html.replace('</head>',f'<style>{styles}</style></head>')
scripts=[(p/'js'/name).read_text() for name in ['engine.js','art.js','premium-art.js','chapter-art.js','audio.js','feedback.js','card-ui.js','app.js','cinematic.js']]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load')
 page.evaluate("""() => {window.__storage={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__storage[k]??null,setItem:(k,v)=>{window.__storage[k]=String(v)},removeItem:k=>{delete window.__storage[k]}}})}""")
 for script in scripts:page.add_script_tag(content=script)
 page.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
 assert page.locator('#mobileTactical').is_visible()
 assert page.locator('#mobileVitals').inner_text().startswith('♥')
 assert page.locator('#mobileSealBtn').is_disabled()
 assert page.locator('#mobileEscapeBtn').is_disabled()
 assert page.locator('#mobileMoreBtn').is_enabled()
 assert page.locator('#mobileHealBtn').is_disabled()
 box_board=page.locator('.board-frame').bounding_box()
 box_strip=page.locator('#mobileTactical').bounding_box()
 assert box_strip['y']-box_board['y']-box_board['height']<30,(box_board,box_strip)
 assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
 page.locator('#mobileMoreBtn').click()
 y=page.evaluate('window.scrollY')
 assert y>0
 # La copia mala jamás debe mostrar el cuadro de confirmación ni sustituir la partida.
 state=page.evaluate('JSON.parse(JSON.stringify(window.__deadCabin.state))')
 old=page.evaluate("window.__storage['dead-cabin-404-v4']")
 bad=json.loads(json.dumps(state));bad['log']=[None]
 envelope={'format':'dead-cabin-404-backup-v1','game':bad,'unlocked':8}
 page.locator('#importFile').set_input_files({'name':'corrupto.json','mimeType':'application/json','buffer':json.dumps(envelope).encode()})
 page.wait_for_timeout(120)
 assert 'dañada' in page.locator('#toast').inner_text().lower(),page.locator('#toast').inner_text()
 assert page.locator('#modal').get_attribute('class').find('hidden')>=0
 assert page.evaluate("window.__storage['dead-cabin-404-v4']")==old
 assert page.evaluate('window.__deadCabin.unlocked')==1
 # Copia válida importa y persiste después de renderizar.
 good=json.loads(json.dumps(state));good['hp']=7
 envelope={'format':'dead-cabin-404-backup-v1','game':good,'unlocked':5}
 page.locator('#importFile').set_input_files({'name':'valido.json','mimeType':'application/json','buffer':json.dumps(envelope).encode()})
 page.wait_for_timeout(80)
 assert 'Importar' in page.locator('#modalTitle').inner_text()
 page.get_by_role('button',name='RESTAURAR COPIA').click()
 assert page.evaluate('window.__deadCabin.state.hp')==7
 assert page.locator('#mobileVitals').inner_text().startswith('♥ 7/12')
 assert page.evaluate('window.__deadCabin.unlocked')>=5
 assert json.loads(page.evaluate("window.__storage['dead-cabin-404-v4']"))['hp']==7
 # Móvil pequeño con controles táctiles 46px
 page.set_viewport_size({'width':320,'height':740})
 assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
 for name in ['mobileSealBtn','mobileInvestigateBtn','mobileEscapeBtn','mobileHealBtn','mobileWardBtn','mobileAbilityBtn','mobileFlareBtn','mobileMoreBtn']:
  assert page.locator('#'+name).bounding_box()['height']>=44,name
 page.screenshot(path=str(p/'tests'/'edition23-mobile.png'),full_page=True)
 assert not errors,errors
 browser.close()
 print('PASS v2.3: panel contextual 320/390, backup corrupto rechazado sin persistir, backup válido restaura; sin errores JS')
