'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const E=require('../js/engine.js');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const copy=x=>JSON.parse(JSON.stringify(x));

test('v2.3 acepta partidas v4 anteriores, sin campos nuevos, y valida 100 mutaciones corruptas',()=>{
 const game=E.createGame(1,12345);delete game.guard;
 assert.equal(E.validate(game),true);
 const s=E.createGame(3,999);
 const changes=[
  x=>x.log=[null],x=>x.log=[{text:'Sin turno'}],x=>x.log=[{turn:2,text:null,kind:'card'}],
  x=>x.enemies=[null],x=>x.enemies=[{id:1,type:'boss',hp:1,pos:99}],x=>x.enemies=[{id:1,type:'boss',hp:'cuatro',pos:22}],
  x=>x.lastEvent={id:'cold',name:'Frío imposible',flavor:null,type:'sanity',art:'eye'},x=>x.lastRoll={value:7,hit:true,crit:false,weapon:'axe',damage:3},
  x=>x.objectiveDone=[null],x=>x.sealed=[3],x=>x.encounterChoices=[{}],x=>x.storyBeats=[null],
  x=>x.blessings=[{}],x=>x.hp=999,x=>x.sanity=999,x=>x.ended='no',x=>x.guard=2,
  x=>x.revealed.push(x.revealed[0]),x=>x.deck=[null],x=>x.log=Array.from({length:91},()=>({turn:1,text:'x',kind:'card'}))
 ];
 let rejected=0;
 for(let i=0;i<100;i++){
  const broken=copy(s);changes[i%changes.length](broken);
  assert.equal(E.validate(broken),false,`Mutación ${i} no rechazada`);rejected++;
 }
 assert.equal(rejected,100);assert.ok(E.validate(s));
});

test('las cartas registran el cambio realmente aplicado (incluidas las limitaciones)',()=>{
 const make=(id)=>{const s=E.createGame(1,123);s.deck=[id];s.discard=[];s.encounterSpots=[];s.enemies=[];return s};
 let s=make('lantern');s.sanity=10;
 assert.equal(E.dispatch(s,{type:'END_TURN'}),true);
 assert.match(s.lastEvent.applied,/Sin efecto/);assert.equal(s.lastEvent.turn,1);assert.equal(s.sanity,10);assert.ok(E.validate(s));
 s=make('medicine');s.medkits=0;
 E.dispatch(s,{type:'END_TURN'});assert.match(s.lastEvent.applied,/\+1 botiquines/);assert.equal(s.medkits,1);
 s=make('roots');s.doom=4;
 E.dispatch(s,{type:'END_TURN'});assert.match(s.lastEvent.applied,/\+2 oscuridad/);assert.equal(s.doom,7);
 s=make('harvest');s.revealed=Array.from({length:25},(_,i)=>i);s.enemies=Array.from({length:10},(_,i)=>({id:i+1,type:'possessed',pos:i,hp:2}));s.nextId=11;
 E.dispatch(s,{type:'END_TURN'});assert.match(s.lastEvent.applied,/Sin aparición/);assert.equal(s.enemies.length,10);assert.ok(E.validate(s));
});

test('panel táctico del móvil expone acciones críticas y está conectado a los botones reales',()=>{
 const html=read('index.html'),app=read('js/app.js'),css=read('css/edition23.css');
 for(const id of ['mobileTactical','mobileVitals','mobileContext','mobileSealBtn','mobileInvestigateBtn','mobileEscapeBtn','mobileHealBtn','mobileWardBtn','mobileAbilityBtn','mobileFlareBtn','mobileMoreBtn','actionPanel'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(app,/function renderTacticalStrip\(/);assert.match(app,/mobileSealBtn','SEAL/);
 assert.match(css,/min-height:46px/);assert.match(css,/max-width:390px/);
});

test('versiones de PWA y empaquetado, compatibilidad de save v4 intacta',()=>{
 assert.equal(JSON.parse(read('package.json')).version,'3.0.0-rc.2');assert.match(read('sw.js'),/dead-cabin-404-v3-0-rc2/);
 assert.match(read('sw.js'),/edition23.css/);assert.match(read('scripts/build-single.js'),/edition23.css/);
 assert.equal(E.VERSION,4);
});

test('la campaña final mantiene objetivos y genera estados válidos',()=>{
 for(const chapter of [3,8])for(const difficulty of ['story','normal','nightmare'])for(let seed=1;seed<=10;seed++){
  const s=E.createGame(chapter,chapter*1000+seed,{difficulty});
  assert.ok(E.validate(s));assert.ok(E.doomLimit(s)>=12);
  E.dispatch(s,{type:'END_TURN'});assert.ok(E.validate(s));
 }
});
