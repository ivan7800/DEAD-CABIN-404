const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const E=require('../js/engine.js');
test('ocho consecuencias propias de capítulo con guardados v4 válidos',()=>{
 const seen=new Set();for(let chapter=1;chapter<=8;chapter++){
  const s=E.createGame(chapter,1000+chapter);s.pendingChoice=`c${chapter}-0`;
  assert.ok(E.dispatch(s,{type:'CHOOSE',option:0}));
  const echo=E.CHAPTER_ECHOES[chapter];assert.ok(echo);assert.ok(s.blessings.includes(echo.id));
  assert.equal(E.validate(s),true);seen.add(echo.id);
  const alternate=E.createGame(chapter,2000+chapter);alternate.pendingChoice=`c${chapter}-0`;
  assert.ok(E.dispatch(alternate,{type:'CHOOSE',option:1}));assert.ok(!alternate.blessings.includes(echo.id));
  assert.ok(E.validate(alternate));
 }assert.equal(seen.size,8);
});
test('la tormenta consume la protección y bloquea el +2 de oscuridad',()=>{
 const s=E.createGame(2,245);s.pendingChoice='c2-0';E.dispatch(s,{type:'CHOOSE',option:0});
 s.turn=3;s.doom=0;s.enemies=[];s.deck=['candle'];assert.ok(E.dispatch(s,{type:'END_TURN'}));
 assert.equal(s.blessings.includes('echo-storm'),false);assert.equal(s.doom,0);
 assert.equal(E.validate(s),true);
});
test('ecos sobreviven serialización JSON y lectura de partidas sin ecos',()=>{
 const s=E.createGame(6,605);s.pendingChoice='c6-0';E.dispatch(s,{type:'CHOOSE',option:0});
 assert.ok(E.validate(JSON.parse(JSON.stringify(s))));
 const old=E.createGame(6,605);assert.ok(E.validate(old));
});
test('UI, PWA y HTML independiente incluyen las nuevas ayudas narrativas',()=>{
 const index=fs.readFileSync('index.html','utf8');const sw=fs.readFileSync('sw.js','utf8');
 const app=fs.readFileSync('js/app.js','utf8');assert.match(index,/edition25.css/);
 assert.match(sw,/v2-11-0/);assert.match(sw,/edition25.css/);assert.match(app,/CONSECUENCIA ESPECIAL/);
});
test('rastro borrado consume la protección en turno cinco',()=>{
 const s=E.createGame(3,300);s.pendingChoice='c3-0';E.dispatch(s,{type:'CHOOSE',option:0});
 s.turn=5;s.deck=['candle'];s.enemies=[];s.doom=0;E.dispatch(s,{type:'END_TURN'});
 assert.ok(!s.blessings.includes('echo-hunt'));assert.ok(E.validate(s));
});
test('eco de geometría impide la maldición programada del turno tres',()=>{
 const s=E.createGame(5,500);s.pendingChoice='c5-0';E.dispatch(s,{type:'CHOOSE',option:0});
 s.turn=3;s.deck=['candle'];s.cursed=[];s.enemies=[];E.dispatch(s,{type:'END_TURN'});
 assert.deepEqual(s.cursed,[]);assert.ok(!s.blessings.includes('echo-geometry'));assert.ok(E.validate(s));
});
test('los ecos de silencio y del ritual se consumen una sola vez',()=>{
 for(const chapter of [6,7]){
  const s=E.createGame(chapter,chapter*100);s.pendingChoice=`c${chapter}-0`;E.dispatch(s,{type:'CHOOSE',option:0});
  s.turn=4;s.deck=['candle'];s.sanity=10;s.enemies=[];E.dispatch(s,{type:'END_TURN'});
  assert.ok(!s.blessings.includes(E.CHAPTER_ECHOES[chapter].id));assert.ok(E.validate(s));
 }
});
