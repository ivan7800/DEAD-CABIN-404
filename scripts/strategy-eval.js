'use strict';
/** Same-seed, full-campaign comparison. This is simulated decision making, NOT a human playtest. */
const E=require('../js/engine.js');
const {action:baseline}=require('./audit-balance-1152.js');
function tactical(s,step){
  if(s.pendingChoice || s.ended || s.ap===0)return baseline(s,step);
  const boss=s.enemies.some(e=>['heart','boss'].includes(e.type)&&E.dist(s.pos,e.pos)<=2);
  const imminent=boss&&s.turn%3===0;
  const close=s.enemies.filter(e=>E.dist(s.pos,e.pos)<=1);
  if(imminent&&s.guard!==1&&s.ap===1)return {type:'GUARD'};
  if(s.flares&&close.length>=2&&s.hp<=6)return {type:'FLARE'};
  const choice=baseline(s,step);
  if(choice.type==='ATTACK'&&choice.weapon==='shotgun'){
    const target=s.enemies.find(e=>e.id===choice.id);
    const mandatory=target&&s.chapter===3&&s.objectiveCount<3&&target.type==='stalker';
    if(target&&target.hp===1&&E.dist(s.pos,target.pos)<=1&&!mandatory&&!['boss','heart'].includes(target.type))return {...choice,weapon:'axe'};
  }
  if(s.difficulty==='nightmare'&&choice.type==='END_TURN'&&s.wards&&s.doom>=E.doomLimit(s)-8)return {type:'WARD'};
  return choice;
}
function episode(chapter,difficulty,survivor,seed,legacy,policy){
  const s=E.createGame(chapter,seed,{difficulty,survivor,legacy});
  let count=0;const actionCounts={};
  while(!s.ended&&count<1100&&s.turn<100){
    const cmd=(policy==='baseline'?baseline:tactical)(s,count);
    if(!E.dispatch(s,cmd))throw Error('Rejected action: '+JSON.stringify({chapter,difficulty,survivor,seed,policy,turn:s.turn,cmd}));
    if(!E.validate(s))throw Error('Invalid state: '+JSON.stringify({chapter,difficulty,policy,turn:s.turn}));
    actionCounts[cmd.type]=(actionCounts[cmd.type]||0)+1;count++;
  }
  return {chapter,win:s.won,turn:s.turn,actions:count,ended:s.ended,legacy:s.legacy,reason:s.lastAction,actionCounts};
}
function evaluate(policy,count=12){
 const rows=[];
 for(const difficulty of ['story','normal','nightmare'])for(const survivor of ['scout','medic','occultist'])for(let i=0;i<count;i++){
  const seed=28000+i*109;let legacy=null;const chapters=[];
  for(let ch=1;ch<=8;ch++){const r=episode(ch,difficulty,survivor,seed+ch*941,legacy,policy);chapters.push(r);if(!r.win)break;legacy=r.legacy}
  rows.push({difficulty,survivor,seed,chapters,complete:chapters.length===8&&chapters.at(-1).win});
 }
 return {policy,rows,summary:{
  campaigns:rows.length,complete:rows.filter(r=>r.complete).length,
  episodes:rows.reduce((a,r)=>a+r.chapters.length,0),
  byDifficulty:Object.fromEntries(['story','normal','nightmare'].map(d=>[d,{
   complete:rows.filter(r=>r.difficulty===d&&r.complete).length,
   episodes:rows.filter(r=>r.difficulty===d).reduce((a,r)=>a+r.chapters.length,0)
  }]))
 }};
}
function run(){
 const base=evaluate('baseline'),candidate=evaluate('tactical');
 const report={method:'paired campaigns, fixed seeds; neither policy is human',
   baseline:base.summary,tactical:candidate.summary,
   changes:{complete:candidate.summary.complete-base.summary.complete,episodes:candidate.summary.episodes-base.summary.episodes}};
 if(process.argv.includes('--write')){
  const fs=require('node:fs'),path=require('node:path');fs.mkdirSync(path.join(__dirname,'..','qa'),{recursive:true});
  fs.writeFileSync(path.join(__dirname,'..','qa','policy-comparison.json'),JSON.stringify({report,base,candidate},null,2));
 }
 console.log(JSON.stringify(report,null,2));return report;
}
if(require.main===module)run();
module.exports={tactical,episode,evaluate,run};