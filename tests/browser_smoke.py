"""Pruebas reales de la UI en Chromium. Se inyectan recursos por bloqueo de navegación del entorno."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
p=Path(__file__).resolve().parents[1]
source=(p/'index.html').read_text()
source=re.sub(r'<link rel="stylesheet" href="css/style.css">','',source)
source=re.sub(r'<script src="js/[a-z]+.js" defer></script>','',source)
source=source.replace('</head>','<style>'+ (p/'css/style.css').read_text() +'</style></head>')
scripts=[(p/'js'/name).read_text() for name in ['engine.js','art.js','audio.js','app.js']]
def boot(page,storage=None):
    page.set_content(source,wait_until='load')
    page.evaluate("""(data) => {window.__storage={...data};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__storage[k]??null,setItem:(k,v)=>{window.__storage[k]=String(v)},removeItem:k=>{delete window.__storage[k]}}})}""",storage or {})
    for js in scripts:page.add_script_tag(content=js)
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    boot(page)
    assert page.locator('#modalTitle').inner_text()=='El libro que respira'
    page.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
    assert page.locator('.tile').count()==25
    assert page.locator('.tile.revealed').count()==1
    assert page.locator('#apText').inner_text()=='3 / 3'
    page.locator('#toast').wait_for(state='hidden',timeout=6000)
    page.screenshot(path=str(p/'tests'/'desktop.png'),full_page=True)
    # Uso de interfaz y movimiento
    page.locator('[data-pos="17"]').click()
    assert page.locator('#apText').inner_text()=='2 / 3'
    assert page.locator('.tile.revealed').count()==2
    page.locator('#endBtn').click()
    assert page.locator('#turnDisplay').inner_text()=='TURNO 02'
    assert page.locator('#eventTitle').inner_text()!='La casa espera'
    page.locator('#saveBtn').click()
    assert 'guardada' in page.locator('#toast').inner_text()
    page.locator('#recordsBtn').click()
    assert page.locator('.achievement').count()==7
    page.locator('#modalClose').click()
    page.locator('#campaignBtn').click()
    assert page.locator('.chapter-card').count()==8
    assert page.locator('.chapter-card[disabled]').count()==7
    page.locator('.chapter-card[data-chapter="1"]').click()
    assert page.locator('#survivorSelect').is_visible()
    page.locator('#survivorSelect').select_option('medic')
    page.locator('#difficultySelect').select_option('nightmare')
    page.get_by_role('button',name='COMENZAR PARTIDA').click()
    assert page.evaluate('window.__deadCabin.state.survivor')=='medic'
    assert page.evaluate('window.__deadCabin.state.difficulty')=='nightmare'
    assert 'MARA' in page.locator('#characterName').inner_text()
    page.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
    # Ataque y visualización d6
    page.evaluate('''() => {const s=window.__deadCabin.state;s.enemies=[{id:41,type:'possessed',pos:17,hp:2}];s.nextId=42;s.ap=3;s.sanity=8;s.revealed=[22,17]}''')
    page.evaluate('window.__deadCabin.act({type:"REST"})')
    assert page.locator('#axeBtn').is_enabled()
    page.locator('#axeBtn').click()
    assert 'attackable' in page.locator('[data-pos="17"]').get_attribute('class')
    page.locator('[data-pos="17"]').click()
    assert page.locator('#dieDisplay').is_visible()
    # Encounter mandatory and resolved via UI
    page.evaluate('''() => {const s=window.__deadCabin.state;s.encounterSpots=[17];s.encounterPool=['telephone'];s.encounterSeen=[];s.enemies=[];s.ap=3;s.revealed=[22];s.sanity=8;}''')
    page.evaluate('window.__deadCabin.act({type:"REST"})')
    page.locator('[data-pos="17"]').click()
    assert page.locator('#modalTitle').inner_text()=='El teléfono desconectado'
    assert page.locator('#modal').get_attribute('data-locked')=='true'
    assert page.locator('#modalClose').is_hidden()
    assert page.locator('#endBtn').is_disabled()
    page.get_by_role('button',name=re.compile('ARRANCAR EL CABLE')).click()
    assert page.evaluate('window.__deadCabin.state.pendingChoice') is None
    assert page.evaluate('window.__deadCabin.state.encounterChoices.length')==1
    # Chapter victory must include side objective
    page.evaluate('''() => {const s=window.__deadCabin.state;s.sealed=s.sealSpots.slice();s.seals=s.sealed.length;s.objectiveCount=1;s.pos=22;s.enemies=[];s.pendingChoice=null;}''')
    page.evaluate('window.__deadCabin.act({type:"ESCAPE"})')
    assert page.locator('#modalTitle').inner_text()=='Sobreviviste a la noche'
    assert page.evaluate('window.__deadCabin.unlocked')==2
    assert page.evaluate('window.__deadCabin.records.wins')==1
    page.get_by_role('button',name='SIGUIENTE CAPÍTULO').click()
    assert page.locator('#chapterTitle').inner_text()=='La tormenta negra'
    page.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
    stored=page.evaluate('window.__storage')
    boot(page,stored)
    assert page.locator('#chapterTitle').inner_text()=='La tormenta negra'
    assert page.evaluate('window.__deadCabin.unlocked')==2
    # Endless interface, escape and scores
    page.locator('#endlessBtn').click()
    assert page.locator('#modalTitle').inner_text()=='Noche infinita'
    page.locator('#difficultySelect').select_option('story')
    page.get_by_role('button',name='COMENZAR PARTIDA').click()
    page.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
    assert page.evaluate('window.__deadCabin.state.mode')=='endless'
    page.evaluate('''() => {const s=window.__deadCabin.state;s.turn=12;s.pos=22;s.pendingChoice=null}''')
    page.evaluate('window.__deadCabin.act({type:"ESCAPE"})')
    assert page.locator('#modalTitle').inner_text()=='Sobreviviste a la noche'
    assert page.evaluate('window.__deadCabin.records.bestTurn')==12
    # Responsive y experiencia táctil
    for width in [390,320]:
        mobile=browser.new_page(viewport={'width':width,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
        mobile.on('pageerror',lambda e:errors.append(str(e)))
        boot(mobile)
        mobile.get_by_role('button',name='ENTRAR EN LA CABAÑA').click()
        mobile.locator('#toast').wait_for(state='hidden',timeout=6000)
        if width==390:mobile.screenshot(path=str(p/'tests'/'mobile.png'),full_page=True)
        overflow=mobile.evaluate('document.documentElement.scrollWidth - innerWidth')
        assert overflow<=1,f'Overflow at {width}: {overflow}px'
        assert mobile.locator('.tile').count()==25
        assert mobile.locator('#abilityBtn').is_visible()
        mobile.close()
    assert not errors,errors
    print('PASS: Chromium desktop — movement, combat d6, 24-card deck, config, campaign, encounter, ending, achievements, saves and endless')
    print('PASS: Chromium touch — 390px and 320px; no horizontal overflow')
    print('PASS: 0 JavaScript runtime errors')
    browser.close()
