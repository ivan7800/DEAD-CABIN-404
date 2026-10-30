/* Diagnóstico voluntario de sesiones. Solo almacenamiento local, sin red. */
(function(root){'use strict';
const KEY='dead-cabin-404-qa-v1',MAX_EVENTS=2500;
const TYPES=new Set(['MOVE','ATTACK','GUARD','SEARCH','REST','INVESTIGATE','ABILITY','SEAL','ESCAPE','END_TURN','HEAL','WARD','FLARE','BARRICADE','CHOOSE','NEW_GAME','IMPORT']);
const read=()=>{try{const data=JSON.parse(root.localStorage.getItem(KEY));return data&&data.format==='dead-cabin-404-qa-v1'&&Array.isArray(data.events)?data:null}catch{return null}};
const empty=()=>({format:'dead-cabin-404-qa-v1',enabled:false,events:[]});
let data=read()||empty();
const store=()=>{try{root.localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}};
const safeInt=(n,min=0,max=100000)=>Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):0;
function snapshot(game){return {chapter:safeInt(game.chapter,1,8),turn:safeInt(game.turn),mode:game.mode==='endless'?'endless':'campaign',difficulty:['story','normal','nightmare'].includes(game.difficulty)?game.difficulty:'unknown',survivor:['scout','medic','occultist'].includes(game.survivor)?game.survivor:'unknown',hp:safeInt(game.hp,0,12),sanity:safeInt(game.sanity,0,10),doom:safeInt(game.doom),ap:safeInt(game.ap,0,3),position:safeInt(game.pos,0,24),enemies:safeInt(game.enemies?.length),seals:safeInt(game.seals),objectives:safeInt(game.objectiveCount),ended:Boolean(game.ended),won:Boolean(game.won)};}
function record(type,game,ok=true){if(!data.enabled||!game||!TYPES.has(type))return false;data.events.push({type,ok:!!ok,...snapshot(game)});if(data.events.length>MAX_EVENTS)data.events.splice(0,data.events.length-MAX_EVENTS);return store()}
function setEnabled(enabled){data.enabled=Boolean(enabled);return store()}
function clear(){data=empty();return store()}
function summary(){const events=data.events;const byChapter=Array.from({length:8},(_,i)=>{const v=events.filter(x=>x.chapter===i+1);return {chapter:i+1,actions:v.length,failed:v.filter(x=>!x.ok).length,turns:new Set(v.map(x=>x.turn)).size,defeats:v.filter(x=>x.ended&&!x.won&&x.ok).length,wins:v.filter(x=>x.won&&x.ok).length}});return {enabled:data.enabled,count:events.length,max:MAX_EVENTS,byChapter,actions:Object.entries(events.reduce((o,e)=>(o[e.type]=(o[e.type]||0)+1,o),{})).sort((a,b)=>b[1]-a[1])};}
function exportJson(){return JSON.stringify({format:data.format,exportedAt:new Date().toISOString(),events:data.events,summary:summary()},null,2)}
root.DeadCabinTelemetry={record,summary,setEnabled,clear,exportJson,enabled:()=>data.enabled};
})(globalThis);
