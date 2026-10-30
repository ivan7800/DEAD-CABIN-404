const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const E=require('../js/engine.js');
function prepared(chapter){const s=E.createGame(chapter,26100+chapter);s.sealed=s.sealSpots.slice();s.seals=s.sealed.length;s.totalSeals=s.seals;s.objectiveCount=E.SIDE_OBJECTIVES[chapter].target;s.bossKilled=true;s.pos=E.ENTRANCE;s.pendingChoice=null;return s}
test('eight distinct playable finales, both decisions, correct exit and no deadlock',()=>{
 const names=new Set();for(let chapter=1;chapter<=8;chapter++){
  for(let option=0;option<=1;option++){
   const s=prepared(chapter);assert.ok(E.validate(s));assert.equal(E.dispatch(s,{type:'ESCAPE'}),true);
   assert.equal(s.pendingChoice,`finale-${chapter}`);assert.equal(s.ended,false);
   assert.equal(E.dispatch(s,{type:'END_TURN'}),false);
   assert.equal(E.dispatch(s,{type:'ESCAPE'}),false);
   assert.ok(E.dispatch(s,{type:'CHOOSE',option}));assert.equal(s.pendingChoice,null);
   assert.deepEqual(s.storyBeats.filter(x=>x==='finale'),['finale']);assert.ok(E.validate(s));
   const count=s.encounterChoices.length;assert.equal(E.dispatch(s,{type:'ESCAPE'}),true);assert.equal(s.ended,true);assert.equal(s.won,true);
   assert.equal(s.encounterChoices.length,count);assert.ok(E.validate(s));
   names.add(E.CHAPTER_FINALES[chapter].name);
  }
 }
 assert.equal(names.size,8)
});
test('next chapter receives the selected narrative legacy exactly once',()=>{
 const expected={1:['archive','wards',1],2:['storm','medkits',1],3:['hunt','ammo',2],4:['mask','wards',1],5:['map','flares',1],6:['radio','wards',1],7:['name','medkits',1]};
 for(let ch=1;ch<=7;ch++){
  const prev=prepared(ch);E.dispatch(prev,{type:'ESCAPE'});E.dispatch(prev,{type:'CHOOSE',option:0});
  assert.equal(prev.legacy.kind,expected[ch][0]);assert.ok(E.validate(prev));
  const sameSeed=9200+ch;const baseline=E.createGame(ch+1,sameSeed);const next=E.createGame(ch+1,sameSeed,{legacy:prev.legacy});
  assert.equal(next[expected[ch][1]],baseline[expected[ch][1]]+expected[ch][2]);assert.equal(E.validate(next),true);
  assert.equal(E.createGame(ch+1,sameSeed).legacy,null);
  assert.equal(E.createGame(ch+2>8?8:ch+2,sameSeed,{legacy:prev.legacy}).legacy,null);
 }
});
test('old v4 saves without legacy still pass and malformed legacy is rejected',()=>{
 const old=E.createGame(4,234);delete old.legacy;assert.ok(E.validate(JSON.parse(JSON.stringify(old))));
 const broken=E.createGame(4,234);broken.legacy={from:3,kind:'mask'};assert.equal(E.validate(broken),false);
});
test('standalone and service worker version tracks release',()=>{
 assert.equal(require('../package.json').version,'3.0.0-rc.6');
 const sw=fs.readFileSync('sw.js','utf8');assert.match(sw,/dead-cabin-404-v3-0-rc6/);
 const app=fs.readFileSync('js/app.js','utf8');assert.match(app,/legacy:game\.legacy/);
});
