'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const E=require('../js/engine.js'),C=require('../js/card-ui.js');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
test('Las 24 cartas tienen ilustraciones SVG propias y descripciones de efectos',()=>{
 const cards=E.CARDS.map(x=>({id:x.id,meta:C.describe(x),art:C.illustration(x.id,C.describe(x).family)}));
 assert.equal(cards.length,24);assert.equal(new Set(cards.map(x=>x.art)).size,24);
 for(const c of cards){assert.match(c.art,/<svg/);assert.match(c.art,/viewBox="0 0 320 180"/);assert.match(c.art,/<\/svg>/);assert.ok(c.meta.effect.length>=8,c.id);assert.ok(c.meta.label.length>0);assert.ok(['threat','occult','hope','supply'].includes(c.meta.family));assert.doesNotMatch(c.art,/<script|<image|https?:\/\//i)}
});
test('La clasificación es coherente con las consecuencias reales del motor',()=>{
 const get=id=>C.describe(E.CARDS.find(x=>x.id===id));
 assert.equal(get('cold').family,'occult');assert.match(get('cold').effect,/-1 de cordura/);
 assert.match(get('whisper').effect,/-2 de cordura/);
 assert.equal(get('lantern').family,'hope');assert.match(get('lantern').effect,/\+2 de cordura/);
 assert.match(get('steps').effect,/1 criatura/);assert.match(get('harvest').effect,/2 criaturas/);
 assert.equal(get('blood').family,'threat');assert.match(get('blood').effect,/1 de salud/);
 assert.match(get('candle').effect,/-1 de oscuridad/);
 assert.match(get('shells').effect,/\+2 cartuchos/);
});
test('El panel de cartas ofrece tipo, efecto explícito y decoración accesible',()=>{
 const html=read('index.html');const js=read('js/app.js');
 for(const id of ['eventCard','eventGlyph','eventArt','eventTitle','eventType','eventEffect','eventDescription','eventCode'])assert.ok(html.includes(`id="${id}"`),id);
 for(const category of ['threat','occult','hope','supply'])assert.ok(read('css/edition21.css').includes(`[data-family="${category}"]`),category);
 assert.ok(js.includes('C.describe(canonical)'));assert.ok(js.includes('C.illustration('));
 assert.match(html,/card-effect" role="status" aria-live="polite"/);
});
test('Controles agrupados, acciones rápidas y punto de entrada estable',()=>{
 const html=read('index.html'),js=read('js/app.js');
 for(const id of ['mobileAttackBtn','mobileSearchBtn','mobileGuardBtn','mobileTurnBtn','guardStatus'])assert.ok(html.includes(`id="${id}"`),id);
 for(const id of ['combat','explore','ritual'])assert.ok(html.includes(`action-group-${id}`),id);
 for(const id of ['primary-nav','support-nav','settings-nav'])assert.ok(html.includes(id),id);
 assert.ok(js.includes('syncQuickButtons()'));
 assert.match(read('sw.js'),/dead-cabin-404-v2-3-0/);
 const head=html.indexOf('js/card-ui.js'),app=head>0?html.indexOf('js/app.js'):-1;assert.ok(head>0&&app>head);
});
test('Guarda y motor siguen en la versión 4 y no se altera el esquema',()=>{
 const s=E.createGame(1,1234),p=JSON.parse(JSON.stringify(s));
 assert.equal(E.VERSION,4);assert.ok(E.validate(p));assert.equal(typeof p.guard,'number');
 assert.equal(C.describe(null).family,'dormant');assert.equal(E.CARDS.length,24);
});
