/* Checks local release wiring without browser/network dependencies. */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('all CSS and JS referenced in index exist and are local',()=>{
 const html=read('index.html');for(const [,url] of html.matchAll(/(?:src|href)="((?:js|css)\/[a-z-]+\.(?:js|css))"/g)){
  assert.ok(fs.existsSync(path.join(root,url)),`Missing ${url}`);
 }
 assert.match(html,/premium-art\.js/);assert.match(html,/illustration\.css/);assert.match(html,/cinematic-room/);
});
test('PWA precaches all runtime scripts and styles',()=>{
 const html=read('index.html'),sw=read('sw.js');for(const [,url] of html.matchAll(/(?:src|href)="((?:js|css)\/[a-z-]+\.(?:js|css))"/g))assert.ok(sw.includes(`'./${url}'`),`Uncached ${url}`);
 assert.match(sw,/dead-cabin-404-v1-7-0/);
});
test('source contains no external font, tracking, or audio dependency',()=>{
 const html=read('index.html'),audio=read('js/audio.js');assert.doesNotMatch(html,/https?:\/\//);assert.doesNotMatch(audio,/fetch\(|\.mp3|\.ogg|\.wav/);
});
test('illustrations cover all 25 rooms and 7 enemy variants',()=>{
 const engine=require('node:vm'),ctx={globalThis:{}};ctx.globalThis.DeadCabinEngine={ROOM_TYPES:Array(25).fill('hall'),ENEMY_TYPES:Object.fromEntries(['possessed','stalker','brute','boss','wraith','leech','heart'].map(x=>[x,{}]))};
 ctx.globalThis.DeadCabinArt={roomArt:(i,k)=>k?`<svg><rect/></svg>`:'<svg></svg>'};
 engine.runInNewContext(read('js/premium-art.js'),ctx);for(let i=0;i<25;i++)assert.match(ctx.globalThis.DeadCabinArt.roomArt(i,true),new RegExp(`dcGlow${i}`));
 for(const type of ['hero','possessed','stalker','brute','boss','wraith','leech','heart'])assert.match(ctx.globalThis.DeadCabinArt.miniature(type),/miniature-art/);
});
