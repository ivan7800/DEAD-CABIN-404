const test=require('node:test');const assert=require('node:assert/strict');const E=require('../js/engine.js');
function bossState(difficulty='nightmare'){
 const s=E.createGame(8,28080,{difficulty});s.turn=3;s.ap=3;s.pos=E.ENTRANCE;s.revealed=[E.ENTRANCE, E.ENTRANCE-1];s.enemies=[{id:900,type:'heart',pos:E.ENTRANCE-1,hp:9,stunnedUntil:0,exposedUntil:0}];s.nextId=901;s.bossSummoned=true;s.deck=['archive'];return s;
}
test('Defender amortigua mente y evita oscuridad del pulso ritual del Corazón',()=>{
 const unguarded=bossState();const guarded=bossState();const beforeU=unguarded.doom,beforeG=guarded.doom;
 assert.equal(E.dispatch(guarded,{type:'GUARD'}),true);
 assert.equal(E.dispatch(unguarded,{type:'END_TURN'}),true);
 assert.equal(E.dispatch(guarded,{type:'END_TURN'}),true);
 assert.equal(unguarded.doom-beforeU,guarded.doom-beforeG+1);
 assert.ok(guarded.log.some(x=>x.text.includes('DEFENSA RITUAL')));
 assert.ok(E.validate(unguarded));assert.ok(E.validate(guarded));
});
test('La reserva final solo aparece al invocar al Corazón en Pesadilla',()=>{
 for(const difficulty of ['story','normal','nightmare']){
  const s=E.createGame(8,28012,{difficulty});
  const before=s.wards;
  s.sealed=s.sealSpots.slice(0,-1);s.seals=s.sealed.length;s.pos=s.sealSpots.at(-1);s.revealed.push(s.pos);s.enemies=[];
  assert.ok(E.dispatch(s,{type:'SEAL'}));assert.equal(s.bossSummoned,true);
  assert.equal(s.wards,before+(difficulty==='nightmare'?1:0));assert.ok(E.validate(s));
 }
});
test('Los guardados v4 siguen siendo compatibles',()=>{const s=E.createGame(8,28002);const reloaded=JSON.parse(JSON.stringify(s));assert.ok(E.validate(reloaded));assert.equal(reloaded.version,s.version)});
