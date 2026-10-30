'use strict';
/* Simulation heurística de campañas encadenadas, NO un playtest humano. */
const E=require('../js/engine.js');const fs=require('node:fs');
const stepToward=(pos,goal)=>{let choices=E.neighbors(pos).map(i=>({i,d:E.dist(i,goal)}));choices.sort((a,b)=>a.d-b.d||a.i-b.i);return choices[0]?.i};
function action(s,step){
 if(s.pendingChoice)return {type:'CHOOSE',option:1};
 if(E.objectivesComplete(s)&&s.pos===E.ENTRANCE)return {type:'ESCAPE'};
 if(s.hp<=7&&s.medkits&&s.ap)return {type:'HEAL'};
 if((s.sanity<=7||s.doom>=E.doomLimit(s)-6)&&s.wards&&s.ap)return {type:'WARD'};
 const here=s.enemies.filter(e=>e.pos===s.pos),range=s.enemies.filter(e=>E.hasShot(s,e.pos));
 const needHunt=s.chapter===3&&s.objectiveCount<3;
 const dangerous=s.enemies.filter(e=>E.dist(e.pos,s.pos)<=1||E.hasShot(s,e.pos));
 const priority=[...dangerous].sort((a,b)=>(['heart','boss','stalker','brute','possessed'].indexOf(a.type))-(['heart','boss','stalker','brute','possessed'].indexOf(b.type)));
 if(priority.length&&s.ap){
  if(s.ammo&&E.hasShot(s,priority[0].pos))return {type:'ATTACK',id:priority[0].id,weapon:'shotgun'};
  if(E.dist(s.pos,priority[0].pos)<=1)return {type:'ATTACK',id:priority[0].id,weapon:'axe'};
 }
 if(s.ap&&s.objectiveSpots.includes(s.pos)&&!s.objectiveDone.includes(s.pos)&&!here.length)return {type:'INVESTIGATE'};
 if(s.ap&&s.sealSpots.includes(s.pos)&&!s.sealed.includes(s.pos)&&!here.length)return {type:'SEAL'};
 if(s.ap&&s.sanity<=7&&s.survivor==='occultist'&&s.abilityTurn!==s.turn)return {type:'ABILITY'};
 if(s.ap&&s.hp<=9&&s.survivor==='medic'&&s.abilityTurn!==s.turn)return {type:'ABILITY'};
 if(s.ap&&s.survivor==='scout'&&s.abilityTurn!==s.turn&&s.revealed.length<20)return {type:'ABILITY'};
 if(s.ap&&s.sanity<=7&&s.chapter!==6)return {type:'REST'};
 if(s.ap&&s.flares&&s.enemies.some(e=>E.dist(e.pos,s.pos)<=1)&&s.hp<7)return {type:'FLARE'};
 if(s.ap&&s.enemies.some(e=>['boss','heart'].includes(e.type))&&s.turn%3===0&&s.guard!==1)return {type:'GUARD'};
 const remaining=[...s.sealSpots.filter(i=>!s.sealed.includes(i)),...s.objectiveSpots.filter(i=>!s.objectiveDone.includes(i))];
 const boss=s.enemies.find(e=>e.type==='boss'||e.type==='heart');
 if(boss)remaining.unshift(boss.pos);
 if(needHunt){for(const enemy of s.enemies.filter(e=>e.type==='stalker'))remaining.unshift(enemy.pos)}
 if(!remaining.length&&E.objectivesComplete(s))remaining.push(E.ENTRANCE);
 // Hunt requires staying in the game long enough for multiple stalkers to spawn.
 if(remaining.length&&s.ap){remaining.sort((a,b)=>E.dist(s.pos,a)-E.dist(s.pos,b)||a-b);let dest=remaining[0];if(dest!==s.pos){let next=stepToward(s.pos,dest);if(next!==undefined)return {type:'MOVE',to:next}}}
 if(s.ap&&s.ammo<3&&!s.searched.includes(s.pos)&&!here.length)return {type:'SEARCH'};
 if(s.ap&&s.wards===0&&s.sanity<=7&&s.rest!==false&&s.chapter!==6)return {type:'REST'};
 if(s.ap&&s.sanity<10&&s.chapter!==6)return {type:'REST'};
 if(needHunt&&s.ap&&s.survivor==='scout'&&s.abilityTurn!==s.turn)return {type:'ABILITY'};
 return {type:'END_TURN'};
}

function episode(chapter,difficulty,survivor,seed,legacy){
 const s=E.createGame(chapter,seed,{difficulty,survivor,legacy});let actions=0,invalid=0,finale=0;
 while(!s.ended&&actions<1100&&s.turn<100){
  const cmd=action(s,actions);
  if(s.pendingChoice && s.pendingChoice.startsWith('finale-'))finale++;
  let ok=E.dispatch(s,cmd);if(!ok){invalid++;throw new Error('Acción rechazada: '+JSON.stringify({chapter,difficulty,cmd,seed,turn:s.turn}));}
  if(!E.validate(s))throw new Error('Estado inválido '+JSON.stringify({chapter,difficulty,cmd,seed,turn:s.turn}));
  actions++;
 }
 return {chapter,win:s.won,ended:s.ended,turn:s.turn,actions,invalid,hp:s.hp,sanity:s.sanity,doom:s.doom,finale,legacy:s.legacy,reason:s.lastAction};
}
function campaign(difficulty,survivor,seed){
 let legacy=null;const chapters=[];
 for(let ch=1;ch<=8;ch++){
  const run=episode(ch,difficulty,survivor,seed+ch*941,legacy);chapters.push(run);
  if(!run.win)break;
  legacy=run.legacy;
 }
 return {difficulty,survivor,seed,completed:chapters.length===8&&chapters.at(-1).win,chapters};
}
const rows=[];for(const d of ['story','normal','nightmare'])for(const h of ['scout','medic','occultist'])for(let n=0;n<12;n++)rows.push(campaign(d,h,28000+n*109));
const info={campaigns:rows.length,complete:rows.filter(r=>r.completed).length,episodes:rows.reduce((a,r)=>a+r.chapters.length,0),invalid:rows.reduce((a,r)=>a+r.chapters.reduce((b,c)=>b+c.invalid,0),0),byDifficulty:Object.fromEntries(['story','normal','nightmare'].map(d=>[d,{campaigns:rows.filter(r=>r.difficulty===d).length,completed:rows.filter(r=>r.difficulty===d&&r.completed).length,episodes:rows.filter(r=>r.difficulty===d).reduce((a,r)=>a+r.chapters.length,0)}])),rows};
if(process.argv.includes('--write')){fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/campaign-chain-v29.json',JSON.stringify(info,null,2))}
console.log(JSON.stringify({...info,rows:undefined},null,2));
