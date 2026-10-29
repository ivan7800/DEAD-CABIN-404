'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../js/engine.js');
const mk=(n=1,seed=404,opts={})=>E.createGame(n,seed,opts);
function setupSilent(s){s.pendingChoice=null;s.encounterSpots=[];s.enemies=[];s.hp=12;s.sanity=10;s.doom=0}
test('ocho expedientes, tres supervivientes, tres dificultades y 24 cartas',()=>{
 assert.equal(E.CHAPTERS.length,8);assert.equal(Object.keys(E.SURVIVORS).length,3);assert.equal(Object.keys(E.DIFFICULTIES).length,3);assert.equal(E.CARDS.length,24);
 for(let n=1;n<=8;n++)for(const survivor of Object.keys(E.SURVIVORS))for(const difficulty of Object.keys(E.DIFFICULTIES)){
  const s=mk(n,123,{survivor,difficulty});assert.equal(E.validate(s),true);assert.equal(s.sealSpots.length,E.CHAPTERS[n-1].seals);
  assert.equal(new Set(s.sealSpots).size,s.sealSpots.length);
  assert.equal(s.objectiveSpots.length,new Set(s.objectiveSpots).size);assert.equal(s.pos,22);assert.equal(s.ap,3);
 }});
test('misiones distintas en ocho capítulos',()=>{
 const types=[1,2,3,4,5,6,7,8].map(n=>E.SIDE_OBJECTIVES[n].type);
 assert.ok(new Set(types).size>=5);
 for(let n of [1,2,5,6,7])assert.equal(mk(n).objectiveSpots.length,E.SIDE_OBJECTIVES[n].target);
});
test('caminar solo en ortogonal gasta un PA',()=>{const s=mk();assert.equal(E.dispatch(s,{type:'MOVE',to:0}),false);assert.equal(E.dispatch(s,{type:'MOVE',to:17}),true);assert.equal(s.ap,2);assert.ok(s.revealed.includes(17));assert.equal(E.validate(s),true)});
test('cada estancia solo puede buscarse una vez',()=>{const s=mk();assert.equal(E.dispatch(s,{type:'SEARCH'}),true);assert.equal(E.dispatch(s,{type:'SEARCH'}),false);assert.equal(s.ap,2)});
test('objetivo de pista requiere estar en sala, PA y ausencia de enemigo',()=>{const s=mk();const target=s.objectiveSpots[0];assert.equal(E.dispatch(s,{type:'INVESTIGATE'}),false);s.pos=target;s.revealed.push(target);s.encounterSpots=[];
 s.enemies=[{type:'possessed',id:5,pos:target,hp:2}];assert.equal(E.dispatch(s,{type:'INVESTIGATE'}),false);s.enemies=[];
 assert.equal(E.dispatch(s,{type:'INVESTIGATE'}),true);assert.equal(s.objectiveCount,1);assert.equal(s.ap,2);assert.equal(E.dispatch(s,{type:'INVESTIGATE'}),false);assert.ok(E.validate(s))});
test('explorador reconoce, sanadora cura y ocultista exorciza',()=>{for(const survivor of ['scout','medic','occultist']){
 const s=mk(1,12,{survivor});if(survivor==='medic')s.hp=8;if(survivor==='occultist')s.doom=4;
 assert.equal(E.dispatch(s,{type:'ABILITY'}),true);assert.equal(E.dispatch(s,{type:'ABILITY'}),false);assert.equal(s.ap,2);
 if(survivor==='scout')assert.ok(s.revealed.length>=3);if(survivor==='medic')assert.equal(s.hp,10);if(survivor==='occultist')assert.equal(s.doom,3);
 E.dispatch(s,{type:'END_TURN'});if(!s.ended){s.pendingChoice=null;s.hp=12;s.sanity=10;s.doom=0;assert.equal(E.dispatch(s,{type:'ABILITY'}),survivor!=='medic'&&survivor!=='occultist')}
 }});
test('combate usa dado de 6, munición, línea recta y críticos',()=>{const s=mk();s.revealed=[22,21,20,17,12];s.encounterSpots=[];
 s.enemies=[{id:1,pos:20,hp:4,type:'brute'},{id:2,pos:12,hp:4,type:'brute'}];s.nextId=3;
 assert.equal(E.hasShot(s,20),true);assert.equal(E.hasShot(s,12),true);
 assert.equal(E.dispatch(s,{type:'ATTACK',id:1,weapon:'axe'}),false);assert.equal(E.dispatch(s,{type:'ATTACK',id:1,weapon:'shotgun'}),true);
 assert.equal(s.ap,2);assert.equal(s.ammo,4);assert.ok(s.lastRoll.value>=1&&s.lastRoll.value<=6);assert.ok(E.validate(s))});
test('tres chatarras mejoran impacto automático y se consumen',()=>{const s=mk(1,1234);s.scrap=3;s.enemies=[{id:1,pos:22,hp:100,type:'boss'}];s.nextId=2;s.encounterSpots=[];
 for(let n=0;n<3;n++){s.ap=3;E.dispatch(s,{type:'ATTACK',id:1,weapon:'axe'});if(s.lastRoll.hit)break}assert.ok(s.lastRoll.hit);assert.equal(s.scrap,0)});
test('botiquines y talismanes modifican recursos y cuestan PA',()=>{const s=mk();s.hp=5;s.sanity=5;s.doom=5;assert.equal(E.dispatch(s,{type:'HEAL'}),true);assert.equal(s.hp,9);assert.equal(E.dispatch(s,{type:'WARD'}),true);assert.equal(s.sanity,7);assert.equal(s.doom,3)});
test('bengala ilumina vecinos y aturde monstruos',()=>{const s=mk();s.enemies=[{id:1,type:'possessed',pos:22,hp:2}];s.nextId=2;assert.equal(E.dispatch(s,{type:'FLARE'}),true);assert.equal(s.flares,0);assert.ok(s.revealed.includes(17));assert.equal(s.enemies[0].stunnedUntil,1);assert.ok(E.validate(s))});
test('barricada consume chatarra y detiene un enemigo',()=>{const s=mk();s.scrap=1;assert.equal(E.dispatch(s,{type:'BARRICADE'}),true);assert.equal(s.scrap,0);assert.ok(s.barricades.includes(22));s.revealed=[22,17];s.enemies=[{id:1,type:'possessed',pos:17,hp:2}];s.deck=['candle'];E.dispatch(s,{type:'END_TURN'});assert.equal(s.barricades.includes(22),false);assert.equal(s.hp,12)});
test('encuentros de dos elecciones bloquean otras acciones',()=>{const s=mk();s.encounterSpots=[17];s.encounterPool=['telephone'];E.dispatch(s,{type:'MOVE',to:17});assert.equal(s.pendingChoice,'telephone');
 const ap=s.ap;assert.equal(E.dispatch(s,{type:'END_TURN'}),false);assert.equal(E.dispatch(s,{type:'MOVE',to:12}),false);assert.equal(s.ap,ap);
 assert.equal(E.dispatch(s,{type:'CHOOSE',option:2}),false);assert.equal(E.dispatch(s,{type:'CHOOSE',option:1}),true);assert.equal(s.pendingChoice,null);assert.equal(s.encounterChoices.length,1);assert.ok(E.validate(s))});
test('sello consume cordura, mitiga oscuridad y queda marcado',()=>{const s=mk();s.pos=s.sealSpots[0];s.revealed.push(s.pos);s.doom=4;s.encounterSpots=[];assert.equal(E.dispatch(s,{type:'SEAL'}),true);assert.equal(s.seals,1);assert.equal(s.doom,1);assert.equal(E.dispatch(s,{type:'SEAL'}),false)});
test('matar acechadores completa la misión de capítulo 3',()=>{const s=mk(3,77);s.revealed=[22];for(let i=0;i<3;i++){
 s.enemies=[{id:i+1,type:'stalker',pos:22,hp:1}];s.nextId=i+2;s.ap=3;let killed=false;
 for(let z=0;z<9&&!killed;z++){E.dispatch(s,{type:'ATTACK',id:i+1,weapon:'shotgun'});killed=!s.enemies.length;s.ap=3}
 assert.ok(killed)}assert.equal(s.objectiveCount,3);assert.equal(E.objectivesComplete(s),false)});
test('capítulo 4 requiere sellar, derrotar jefe y retornar',()=>{const s=mk(4);s.sealed=s.sealSpots.slice(0,2);s.seals=2;s.pos=s.sealSpots[2];s.revealed=[22,s.pos,12];s.ap=3;s.encounterSpots=[];
 assert.equal(E.dispatch(s,{type:'SEAL'}),true);assert.ok(s.enemies.some(x=>x.type==='boss'));s.pos=22;assert.equal(E.dispatch(s,{type:'ESCAPE'}),false);s.bossKilled=true;s.objectiveCount=1;s.enemies=[];assert.equal(E.dispatch(s,{type:'ESCAPE'}),true);assert.equal(s.won,true)});
test('capítulo 8 invoca un Corazón de 9 puntos',()=>{const s=mk(8);s.sealed=s.sealSpots.slice(0,3);s.seals=3;s.pos=s.sealSpots[3];s.revealed=[22,s.pos,12];s.encounterSpots=[];
 assert.equal(E.dispatch(s,{type:'SEAL'}),true);assert.ok(s.enemies.some(x=>x.type==='heart'&&x.hp===9))});
test('victoria exige tanto misión secundaria como grietas',()=>{const s=mk();s.sealed=s.sealSpots.slice();s.seals=3;assert.equal(E.dispatch(s,{type:'ESCAPE'}),false);s.objectiveCount=1;assert.equal(E.dispatch(s,{type:'ESCAPE'}),true);assert.equal(s.won,true)});
test('derrota por oscuridad, salud o cordura y estados terminales',()=>{for(const resource of ['hp','sanity','doom']){
 const s=mk();if(resource==='doom')s.doom=E.doomLimit(s)-1;else s[resource]=0;
 E.dispatch(s,{type:'END_TURN'});assert.equal(s.ended,true);assert.equal(s.won,false);assert.equal(E.dispatch(s,{type:'MOVE',to:17}),false)}});
test('baraja sin repetición durante el ciclo de 24',()=>{const s=mk();const ids=[];for(let i=0;i<24;i++){setupSilent(s);s.ap=3;s.encounterSpots=[];E.dispatch(s,{type:'END_TURN'});ids.push(s.lastEvent.id);assert.ok(E.validate(s))}
 assert.equal(new Set(ids).size,24);assert.equal(s.deck.length,0);
 setupSilent(s);E.dispatch(s,{type:'END_TURN'});assert.equal(s.deck.length,23)});
test('pesadilla avanza oscuridad más rápido que Historia',()=>{const e=mk(1,55,{difficulty:'story'}),h=mk(1,55,{difficulty:'nightmare'});e.deck=['candle'];h.deck=['candle'];e.encounterSpots=[];h.encounterSpots=[];E.dispatch(e,{type:'END_TURN'});E.dispatch(h,{type:'END_TURN'});assert.ok(h.doom-e.doom>=3)});
test('infinito repone grietas y permite extraer desde turno 12',()=>{const s=mk(1,456,{mode:'endless'});const list=s.sealSpots.slice();s.revealed=[...new Set([22,...list])];s.encounterSpots=[];s.sanity=10;s.ap=3;
 for(const spot of list){s.pos=spot;s.ap=3;assert.equal(E.dispatch(s,{type:'SEAL'}),true)}assert.equal(s.seals,0);assert.equal(s.totalSeals,4);assert.equal(s.sealSpots.length,4);
 s.pos=22;s.turn=11;assert.equal(E.dispatch(s,{type:'ESCAPE'}),false);s.turn=12;assert.equal(E.dispatch(s,{type:'ESCAPE'}),true);assert.equal(s.won,true)});
test('semilla y secuencia idénticas producen resultado determinista',()=>{const a=mk(6,9999,{survivor:'medic'}),b=mk(6,9999,{survivor:'medic'});assert.deepEqual(a,b);
 for(const action of [{type:'SEARCH'},{type:'MOVE',to:17},{type:'END_TURN'},{type:'WARD'}]){E.dispatch(a,action);E.dispatch(b,action)}assert.deepEqual(a,b)});
test('validación y migración 0.3 y 0.2',()=>{const s=mk();assert.ok(E.validate(JSON.parse(JSON.stringify(s))));s.sealSpots=[22];assert.equal(E.validate(s),false);

 const legacy={version:1,pos:22,turn:3,hp:7,sanity:6,ammo:2,ap:1,dark:4,sealSpots:[0,5,12],sealed:[5],revealed:[22,17,12,5],searched:[17],enemies:[{pos:12,hp:2}]};
 assert.ok(E.validate(E.migrateLegacy(legacy)));
 const v3={version:3,chapter:1,rng:1000,turn:3,ap:2,pos:22,hp:8,sanity:9,ammo:4,medkits:1,wards:1,doom:3,seals:0,sealSpots:[0,5,12],sealed:[],revealed:[22,17],searched:[],enemies:[],nextId:1,deck:['steps'],discard:[],log:[],cursed:[],bossSummoned:false,bossKilled:false,ended:false,won:false};
 assert.ok(E.validate(E.upgradeV3(v3)))});
test('logros por campaña, dificultad, salud y decisiones',()=>{const s=mk(8,55,{difficulty:'nightmare'});s.won=true;s.hp=10;s.encounterChoices=['a','b','c','d'];
 assert.deepEqual(E.achievementsFor(s).sort(),['first','end','hard','clean','stories'].sort());s.mode='endless';s.turn=17;assert.ok(E.achievementsFor(s).includes('long'))});
test('simulación adversarial: 100 partidas con acciones aleatorias nunca rompe el estado',()=>{
 for(let seed=1;seed<=100;seed++){const s=mk(1+seed%8,seed*31,{difficulty:['story','normal','nightmare'][seed%3],survivor:['scout','medic','occultist'][seed%3],mode:seed%9===0?'endless':'campaign'});
 for(let step=0;step<180&&!s.ended;step++){
  if(s.pendingChoice){E.dispatch(s,{type:'CHOOSE',option:step%2});assert.ok(E.validate(s),`seed ${seed} step ${step} choice`);continue}
  const enemies=s.enemies.filter(x=>E.dist(s.pos,x.pos)<=1);const actions=[{type:'END_TURN'},{type:'SEARCH'},{type:'REST'},{type:'SEAL'},{type:'ABILITY'},{type:'INVESTIGATE'},{type:'FLARE'},{type:'WARD'},{type:'HEAL'},{type:'BARRICADE'},{type:'ESCAPE'},...E.neighbors(s.pos).map(to=>({type:'MOVE',to}))];
  if(enemies.length)actions.push({type:'ATTACK',id:enemies[0].id,weapon:'axe'});
  const idx=(seed*11+step*19)%actions.length;E.dispatch(s,actions[idx]);assert.ok(E.validate(s),`seed ${seed} step ${step}`)}
 }});
test('16 escenas exclusivas de capítulo y 8 encuentros genéricos',()=>{
 assert.equal(E.ALL_ENCOUNTERS.length,24);
 for(let c=1;c<=8;c++)assert.equal(E.STORY_BEATS[c].length,2);
 const s=mk(2,2026);s.encounterSpots=[];s.pos=s.sealSpots[0];s.revealed.push(s.pos);
 assert.equal(E.dispatch(s,{type:'SEAL'}),true);assert.equal(s.pendingChoice,'c2-0');
 assert.equal(E.dispatch(s,{type:'CHOOSE',option:0}),true);assert.equal(s.storyBeats.includes('seal'),true);
 for(const place of s.objectiveSpots){s.pos=place;s.revealed.push(place);s.ap=3;E.dispatch(s,{type:'INVESTIGATE'})}
 assert.equal(s.pendingChoice,'c2-1');assert.equal(E.dispatch(s,{type:'CHOOSE',option:1}),true);
 assert.equal(s.storyBeats.length,2);assert.equal(E.validate(s),true)
});
test('bucle infinito admite más de 24 cierres de grieta',()=>{
 const s=mk(1,999,{mode:'endless',difficulty:'story'});s.encounterSpots=[];
 for(let i=0;i<28;i++){const spot=s.sealSpots.find(x=>!s.sealed.includes(x));s.pos=spot;
 if(!s.revealed.includes(spot))s.revealed.push(spot);s.ap=3;s.sanity=10;s.doom=0;
 assert.equal(E.dispatch(s,{type:'SEAL'}),true);assert.equal(E.validate(s),true)}
 assert.equal(s.totalSeals,28);assert.equal(s.seals,0);assert.equal(s.sealSpots.length,4)
});
test('un encuentro revelado por explorador se activa al pisarlo después',()=>{
 const s=mk(1,102);s.encounterSpots=[17];s.encounterPool=['telephone'];
 assert.equal(E.dispatch(s,{type:'ABILITY'}),true);assert.ok(s.revealed.includes(17));assert.equal(s.pendingChoice,null);
 assert.equal(E.dispatch(s,{type:'MOVE',to:17}),true);assert.equal(s.pendingChoice,'telephone');assert.equal(E.dispatch(s,{type:'CHOOSE',option:1}),true)
});
