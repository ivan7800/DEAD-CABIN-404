"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {baselineAction,tacticalAction,playEpisode}=require("../scripts/strategy-comparison.js");
const E=require("../js/engine.js");
test("estrategia táctica devuelve acciones válidas en arranque y situaciones de riesgo",()=>{
 for(const difficulty of ["story","normal","nightmare"]){
  const s=E.createGame(8,12845,{difficulty});
  for(const cmd of [baselineAction(s),tacticalAction(s)])assert.equal(E.dispatch(structuredClone(s),cmd),true);
 }
});
test("políticas reproducibles sin estados inválidos en capítulos de riesgo",()=>{
 for(const policy of ["baseline","tactical"])for(const chapter of [1,3,8]){
  const x=playEpisode(chapter,"nightmare","medic",28747+chapter*941,null,policy);
  assert.equal(x.invalid,0);assert.equal(x.ended,true);assert.ok(x.actions<1100);
 }
});
