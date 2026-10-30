'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const E=require('../js/engine.js');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const seeded=(chapter,seed=41000)=>{const s=E.createGame(chapter,seed);s.deck=['candle'];s.encounterSpots=[];s.objectiveSpots=[];s.enemies=[];return s};
const copy=s=>JSON.parse(JSON.stringify(s));

test('ocho escenarios verificables y misión de purificación ligada a estancias realmente malditas',()=>{
 assert.equal(E.CHAPTERS.length,8);
 for(let chapter=1;chapter<=8;chapter++){
  const s=E.createGame(chapter,chapter*521);assert.ok(E.validate(s));
  assert.equal(s.sealSpots.length,E.CHAPTERS[chapter-1].seals);
  assert.ok(E.STORY_BEATS[chapter].length>=2);
  assert.ok(E.SIDE_OBJECTIVES[chapter].name.length>4);
  if(chapter===5){assert.equal(s.objectiveSpots.length,2);assert.deepEqual(s.cursed,s.objectiveSpots)}
 }
 const s=E.createGame(5,1414);const target=s.objectiveSpots[0];s.pos=target;s.revealed.push(target);s.ap=3;s.encounterSpots=[];
 assert.equal(s.cursed.includes(target),true);assert.equal(E.dispatch(s,{type:'INVESTIGATE'}),true);assert.equal(s.cursed.includes(target),false);
 assert.equal(E.validate(s),true);
});

test('guardia tiene telegráfica, fase II y reloj de tres turnos, sin romper guardado anterior',()=>{
 const s=seeded(4);s.enemies=[{id:11,type:'boss',pos:17,hp:8}];s.revealed=[22,17];s.nextId=12;
 assert.equal(E.bossThreat(s).ritual,false);assert.equal(E.bossThreat(s).turnsUntil,2);assert.equal(E.bossThreat(s).phase,1);
 s.turn=3;assert.equal(E.bossThreat(s).ritual,true);assert.equal(E.bossThreat(s).range,1);
 s.enemies[0].hp=4;assert.equal(E.bossThreat(s).phase,2);
 s.enemies[0].exposedUntil=3;assert.equal(E.bossThreat(s).exposed,true);
 assert.ok(E.validate(copy(s)));delete s.enemies[0].exposedUntil;assert.ok(E.validate(copy(s)));
 s.enemies=[];assert.equal(E.bossThreat(s),null)
});

test('Guardia: barrido adyacente en noche de ritual, defensa amortigua el golpe',()=>{
 let witnessed=false;
 for(let seed=1;seed<150&&!witnessed;seed++){
  const s=seeded(4,seed);s.turn=3;s.pos=22;s.revealed=[22,17,16];s.enemies=[{id:9,type:'boss',pos:16,hp:8}];s.nextId=10;
  const a=copy(s),b=copy(s);b.guard=1;
  assert.equal(E.dispatch(a,{type:'END_TURN'}),true);assert.equal(E.dispatch(b,{type:'END_TURN'}),true);
  assert.ok(E.validate(a));assert.ok(E.validate(b));
  if(a.log.some(x=>x.text.includes('BARRIDO DEL GUARDIÁN')&&x.text.includes('impacto'))){
   assert.ok(b.hp>=a.hp);assert.equal(b.hp-a.hp,1);witnessed=true;
   assert.ok(b.log.some(x=>x.text.includes('DEFENSA: resistes el barrido')));
  }
 }
 assert.equal(witnessed,true,'La prueba debe cubrir un barrido acertado, no sólo fallos');
});

test('Corazón: onda radial distintiva de segunda fase, sin línea de visión',()=>{
 const s=seeded(8,27);s.turn=3;s.pos=22;s.revealed=[22,12];s.enemies=[{id:9,type:'heart',pos:12,hp:9}];s.nextId=10;
 assert.equal(E.bossThreat(s).range,1);
 const before=copy(s);E.dispatch(s,{type:'END_TURN'});
 assert.ok(E.validate(s));assert.equal(s.enemies[0].pos,12);assert.equal(s.log.some(x=>x.text.includes('PULSO RITUAL')),false);
 const second=copy(before);second.enemies[0].hp=4;assert.equal(E.bossThreat(second).range,2);
 const guarded=copy(second);guarded.guard=1;
 E.dispatch(second,{type:'END_TURN'});E.dispatch(guarded,{type:'END_TURN'});
 assert.ok(second.log.some(x=>x.text.includes('PULSO RITUAL')));
 assert.equal(second.sanity,guarded.sanity-1);
 assert.equal(second.doom,guarded.doom+1);
 assert.equal(second.enemies[0].exposedUntil,4);
 assert.ok(E.validate(second));
});

test('ventana de vulnerabilidad: golpe acertado +1 y se cierra al cambiar de turno',()=>{
 let observed=false;
 for(let seed=1;seed<400&&!observed;seed++){
  const s=seeded(4,seed);s.turn=4;s.enemies=[{id:7,type:'boss',pos:22,hp:8,exposedUntil:4}];s.nextId=8;
  const a=copy(s),b=copy(s);delete b.enemies[0].exposedUntil;
  E.dispatch(a,{type:'ATTACK',id:7,weapon:'axe'});E.dispatch(b,{type:'ATTACK',id:7,weapon:'axe'});
  if(a.lastRoll?.hit){assert.equal(a.lastRoll.damage,b.lastRoll.damage+1);observed=true}
 }
 assert.equal(observed,true);
});

test('UI de jefe, PWA, versión y HTML offline incluyen los módulos nuevos',()=>{
 const html=read('index.html'),js=read('js/app.js'),sw=read('sw.js'),builder=read('scripts/build-single.js');
 for(const id of ['bossPanel','bossName','bossPhase','bossHp','bossBar','bossIntent','bossDetail'])assert.ok(html.includes(`id="${id}"`));
 assert.match(js,/function renderBoss\(/);assert.match(js,/E\.bossThreat\(game\)/);
 assert.match(sw,/dead-cabin-404-v3-0-rc6/);assert.match(sw,/css\/edition22\.css/);
 assert.match(builder,/edition22\.css/);assert.equal(JSON.parse(read('package.json')).version,'3.0.0-rc.6');
 assert.equal(E.VERSION,4,'No modificar formato de guardados para un campo opcional en los enemigos');
});

test('purificación no desvela casillas no exploradas; copias JSON validadas antes de reemplazar',()=>{
 const ui=read('js/app.js'),html=read('index.html');
 assert.match(ui,/known&&game\.cursed\.includes\(i\)\?'cursed'/);
 for(const id of ['importBtn','exportBtn','importFile'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(ui,/dead-cabin-404-backup-v1/);assert.match(ui,/E\.validate\(backup\.game\)/);
 assert.match(ui,/RESTAURAR COPIA/);assert.match(ui,/1_000_000/);
});
test('PWA prioriza red para navegación y mantiene fallback offline',()=>{
 const sw=read('sw.js');
 assert.match(sw,/request\.mode==='navigate'/);assert.match(sw,/\.catch\(\(\)=>caches\.match\(event\.request\)/);
 assert.match(sw,/\.\/CARTAS-24\.html/);
});
