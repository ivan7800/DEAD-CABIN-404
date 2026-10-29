'use strict';
/* Exploración automatizada heurística. No es una partida humana ni un certificado de balance. */
const E=require('../js/engine.js');
const difficulties=['story','normal','nightmare'];
const rows=[];
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
function play(chapter,difficulty,seed,survivor){const s=E.createGame(chapter,seed,{difficulty,survivor});let steps=0,invalid=0;
 while(!s.ended&&steps<900&&s.turn<90){const a=action(s,steps);const ok=E.dispatch(s,a);if(!ok){invalid++; E.dispatch(s,{type:'END_TURN'})}if(!E.validate(s))throw Error('Invalid state chapter '+chapter+' seed '+seed+' step '+steps+' action '+JSON.stringify(a));steps++}
 return {chapter,difficulty,survivor,seed,win:s.won,turn:s.turn,steps,hp:s.hp,sanity:s.sanity,doom:s.doom,objective:s.objectiveCount,needed:E.currentObjective(s).target,seals:s.seals,limit:E.doomLimit(s),invalid,reason:s.lastAction};}
if(require.main===module){
const survivors=['scout','medic','occultist'];
for(let chapter=1;chapter<=8;chapter++)for(const difficulty of difficulties)for(const survivor of survivors)for(let trial=0;trial<16;trial++)rows.push(play(chapter,difficulty,100000+chapter*10000+difficulties.indexOf(difficulty)*1000+survivors.indexOf(survivor)*100+trial,survivor));
if(rows.some(x=>x.invalid))throw Error('Acciones rechazadas durante simulaciones');
const stats=[];for(let chapter=1;chapter<=8;chapter++)for(const difficulty of difficulties)for(const survivor of survivors){const a=rows.filter(x=>x.chapter===chapter&&x.difficulty===difficulty&&x.survivor===survivor);stats.push({chapter,difficulty,survivor,wins:a.filter(x=>x.win).length,total:a.length,medianTurn:a.map(x=>x.turn).sort((a,b)=>a-b)[8],death:a.filter(x=>!x.win).length});}
const fs=require('fs');fs.writeFileSync('qa/audit-balance-1152.json',JSON.stringify({samples:rows.length,overallWin:rows.filter(x=>x.win).length,stats,rows},null,2));
console.table(stats.filter(x=>x.survivor==='scout'));
console.log('samples:',rows.length,'wins:',rows.filter(x=>x.win).length,'invalid:',rows.reduce((n,x)=>n+x.invalid,0));

}
module.exports={action,play};
