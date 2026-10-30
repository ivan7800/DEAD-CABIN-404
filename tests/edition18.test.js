'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('8 cinematic chapter illustrations are unique, SVG and local',()=>{
 const ctx={globalThis:{}};vm.runInNewContext(read('js/chapter-art.js'),ctx);
 const render=ctx.globalThis.DeadCabinChapterArt.render;
 const arts=Array.from({length:8},(_,i)=>render(i+1));
 assert.equal(new Set(arts).size,8);
 for(let i=0;i<8;i++){
  assert.match(arts[i],/<svg[^>]+viewBox="0 0 960 330"/);
  assert.match(arts[i],new RegExp(`capítulo ${i+1}`));
  assert.match(arts[i],/feTurbulence/);
  assert.ok(arts[i].length>2000);
 }
});
test('feedback controller is optional, no game mutations and provides an accessible toggle',()=>{
 const script=read('js/feedback.js');assert.doesNotMatch(script,/DeadCabinEngine|\.dispatch\(|fetch\(/);
 const html=read('index.html');assert.match(html,/id="fxBtn"/);assert.match(html,/id="fxStage" aria-hidden="true"/);
 assert.match(read('css/edition18.css'),/prefers-reduced-motion/);
});
test('chapter illustrations and feedback module loaded ahead of the game controller',()=>{
 const html=read('index.html');const list=Array.from(html.matchAll(/<script src="([^"]+)" defer><\/script>/g),m=>m[1]);
 for(const filename of ['js/chapter-art.js','js/feedback.js']){assert.ok(list.includes(filename));assert.ok(list.indexOf(filename)<list.indexOf('js/app.js'))}
 assert.match(read('js/app.js'),/CA\.render\(game\.chapter\)/);
});
test('PWA and standalone builder include v1.8 assets',()=>{
 const sw=read('sw.js'),builder=read('scripts/build-single.js');
 for(const asset of ['js/chapter-art.js','js/feedback.js','css/edition18.css']){
  assert.ok(sw.includes(`'./${asset}'`),`PWA missing ${asset}`);
  assert.ok(builder.includes(path.basename(asset)),`Builder missing ${asset}`);
 }
 assert.match(sw,/dead-cabin-404-v3-0-rc2/);
});
