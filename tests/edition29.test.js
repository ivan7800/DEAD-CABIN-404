'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
test('la calibración de Pesadilla permite completar campañas sin alterar las otras dificultades',()=>{
  const output=execFileSync(process.execPath,[path.join(__dirname,'../scripts/audit-chain.js')],{encoding:'utf8'});
  const report=JSON.parse(output);
  assert.equal(report.invalid,0);
  assert.equal(report.campaigns,108);
  assert.equal(report.byDifficulty.story.completed,22);
  assert.equal(report.byDifficulty.normal.completed,5);
  assert.ok(report.byDifficulty.nightmare.completed>=2);
  assert.ok(report.byDifficulty.nightmare.episodes>=115);
});
