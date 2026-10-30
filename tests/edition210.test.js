'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const E=require('../js/engine.js');
function game(difficulty='nightmare',mode='campaign'){const s=E.createGame(2,25001,{difficulty,mode});s.doom=9;s.wards=2;s.ap=3;return s}
test('Talismán protege más en Pesadilla sin alterar Historia y Normal',()=>{
 for(const diff of ['story','normal','nightmare']){const s=game(diff),before=s.doom;assert.equal(E.dispatch(s,{type:'WARD'}),true);assert.equal(before-s.doom,diff==='nightmare'?4:2);assert.ok(E.validate(s))}
});
test('La bonificación se aplica solo a campaña Pesadilla',()=>{
 const s=game('nightmare','endless'),before=s.doom;assert.equal(E.dispatch(s,{type:'WARD'}),true);assert.equal(before-s.doom,2);assert.ok(E.validate(s))
});
function kill(s,id){s.enemies.push({id,type:'possessed',hp:1,pos:s.pos});s.nextId=Math.max(s.nextId,id+1);for(let i=0;i<20&&s.enemies.some(e=>e.id===id);i++){s.ap=3;assert.equal(E.dispatch(s,{type:'ATTACK',id,weapon:'axe'}),true)}assert.ok(!s.enemies.some(e=>e.id===id));assert.ok(E.validate(s))}
test('Cada segunda victoria reduce oscuridad en Pesadilla, nunca en Normal',()=>{
 for(const diff of ['nightmare','normal']){const s=game(diff);s.wards=0;kill(s,1000);assert.equal(s.kills,1);assert.equal(s.doom,9);kill(s,1001);assert.equal(s.kills,2);assert.equal(s.doom,diff==='nightmare'?6:9)}
});
test('No se genera oscuridad negativa y las partidas v4 siguen válidas',()=>{
 const s=game();s.doom=1;kill(s,1200);kill(s,1201);assert.equal(s.doom,0);assert.equal(s.version,4);assert.ok(E.validate(JSON.parse(JSON.stringify(s))))
});
