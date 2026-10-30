const test=require('node:test');const assert=require('node:assert/strict');require('../js/engine.js');require('../js/tension.js');const E=globalThis.DeadCabinEngine||globalThis.DeadCabin404Engine;const T=globalThis.DeadCabinTension;
const state={hp:12,sanity:10,doom:0,pos:0,enemies:[],ended:false};const api={doomLimit:()=>26,bossThreat:()=>null};
test('estado calmado',()=>assert.equal(T.assess(state,api).level,'calm'));
test('oscuridad extrema',()=>assert.equal(T.assess({...state,doom:25},api).level,'critical'));
test('ritual tiene prioridad',()=>assert.equal(T.assess({...state,doom:20},{...api,bossThreat:()=>({ritual:true})}).title,'RITUAL INMINENTE'));
test('criatura en la sala',()=>assert.equal(T.assess({...state,enemies:[{pos:0}]},api).level,'danger'));
test('cordura baja',()=>assert.equal(T.assess({...state,sanity:2},api).level,'danger'));
test('fin de partida seguro',()=>assert.equal(T.assess({...state,ended:true,won:true},api).level,'calm'));
test('sin efectos laterales sobre el estado',()=>{const s=JSON.parse(JSON.stringify(state));T.assess(state,api);assert.deepEqual(state,s)});
