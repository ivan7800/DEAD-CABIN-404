'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../js/engine.js');
const {action:baseline}=require('../scripts/audit-balance-1152.js');
const {tactical,episode}=require('../scripts/strategy-eval.js');
test('las dos políticas ofrecen una acción válida desde el comienzo de campaña',()=>{
 for(const difficulty of ['story','normal','nightmare']){
  const s=E.createGame(1,1011,{difficulty});
  for(const p of [baseline,tactical])assert.equal(E.dispatch(structuredClone(s),p(s,0)),true);
 }
});
test('comparación sin acciones rechazadas, con juego terminado y estado válido',()=>{
 for(const policy of ['baseline','tactical'])for(const chapter of [1,3,8]){
  const r=episode(chapter,'nightmare','medic',28000+chapter*941,null,policy);
  assert.equal(r.ended,true);
  assert.ok(r.actions<1100);
 }
});