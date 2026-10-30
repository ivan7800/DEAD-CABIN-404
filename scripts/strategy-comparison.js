'use strict';
/** Decision-policy comparison on identical deterministic campaign seeds. Not human playtests. */
const E=require('../js/engine.js');
const fs=require('node:fs');
const path=require('node:path');
const stepToward=(pos,goal)=>E.neighbors(pos).map(i=>({i,d:E.dist(i,goal)})).sort((a,b)=>a.d-b.d||a.i-b.i)[0]?.i;
function baselineAction(s,step){
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


function tacticalAction(s){
 // Conservative enhancement of the proven baseline. Only override when a quantified threat justifies it.
 if(s.pendingChoice)return baselineAction(s);
 if(E.objectivesComplete(s)&&s.pos===E.ENTRANCE)return {type:'ESCAPE'};
 if(!s.ap)return {type:'END_TURN'};
 const bosses=s.enemies.filter(e=>e.type==='heart'||e.type==='boss');
 const imminent=bosses.some(e=>E.dist(s.pos,e.pos)<=2&&s.turn%3===0);
 const close=s.enemies.filter(e=>E.dist(s.pos,e.pos)<=1);
 if(imminent&&s.guard!==1&&s.ap===1)return {type:'GUARD'};
 if(s.flares&&close.length>=2&&s.hp<=6)return {type:'FLARE'};
 const base=baselineAction(s);
 // Don't spend a precious cartridge on a 1HP foe at melee range, unless it's a boss or objective stalker.
 if(base.type==='ATTACK'&&base.weapon==='shotgun'){
  const target=s.enemies.find(e=>e.id===base.id);
  if(target&&target.hp===1&&E.dist(target.pos,s.pos)<=1&&target.type!=='heart'&&target.type!=='boss'&&!(s.chapter===3&&s.objectiveCount<3&&target.type==='stalker'))return {...base,weapon:'axe'};
 }
 // In Nightmare, ward in advance only when it prevents a probable doom defeat; baseline otherwise unchanged.
 if(s.difficulty==='nightmare'&&s.wards&&s.doom>=E.doomLimit(s)-8&&base.type==='END_TURN')return {type:'WARD'};
 return base;
}

function playEpisode(chapter,difficulty,survivor,seed,legacy,policy){
 const s=E.createGame(chapter,seed,{difficulty,survivor,legacy});
 let actions=0,invalid=0;const counts={};
 while(!s.ended&&actions<1100&&s.turn<100){
  const cmd=(policy==='baseline'?baselineAction:tacticalAction)(s,actions);
  if(!E.dispatch(s,cmd))throw Error(`Rejected action ${JSON.stringify({chapter,difficulty,seed,policy,turn:s.turn,cmd})}`);
  if(!E.validate(s))throw Error(`Invalid state ${JSON.stringify({chapter,difficulty,seed,policy,turn:s.turn})}`);
  counts[cmd.type]=(counts[cmd.type]||0)+1;actions++;
 }
 return {chapter,win:s.won,ended:s.ended,turn:s.turn,actions,invalid,hp:s.hp,sanity:s.sanity,doom:s.doom,reason:s.lastAction,legacy:s.legacy,counts};
}
function simulate(policy,number=12){
 const rows=[];
 for(const difficulty of ['story','normal','nightmare'])for(const survivor of ['scout','medic','occultist'])for(let n=0;n<number;n++){
  const seed=28000+n*109;let legacy=null;const chapters=[];
  for(let ch=1;ch<=8;ch++){
   const ep=playEpisode(ch,difficulty,survivor,seed+ch*941,legacy,policy);
   chapters.push(ep);if(!ep.win)break;legacy=ep.legacy;
  }
  rows.push({difficulty,survivor,seed,completed:chapters.length===8&&chapters.at(-1).win,chapters});
 }
 return {policy,campaigns:rows.length,completed:rows.filter(x=>x.completed).length,episodes:rows.reduce((n,r)=>n+r.chapters.length,0),byDifficulty:Object.fromEntries(['story','normal','nightmare'].map(d=>[d,{completed:rows.filter(r=>r.difficulty===d&&r.completed).length,episodes:rows.filter(r=>r.difficulty===d).reduce((n,r)=>n+r.chapters.length,0)}])),rows};
}
function main(){
 const base=simulate('baseline'),tactical=simulate('tactical');
 const summary={engineVersion:E.VERSION,method:'paired same seeds; policies differ; neither is human',baseline:{completed:base.completed,episodes:base.episodes,byDifficulty:base.byDifficulty},tactical:{completed:tactical.completed,episodes:tactical.episodes,byDifficulty:tactical.byDifficulty},deltas:{completed:tactical.completed-base.completed,episodes:tactical.episodes-base.episodes}};
 if(process.argv.includes('--write')){fs.mkdirSync(path.join(__dirname,'..','qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'..','qa','strategy-comparison.json'),JSON.stringify({summary,base,tactical},null,2))}
 console.log(JSON.stringify(summary,null,2));
}
if(require.main===module)main();
module.exports={baselineAction,tacticalAction,simulate,playEpisode};
