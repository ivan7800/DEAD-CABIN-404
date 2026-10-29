/* DEAD CABIN 404 v1.8: respuesta visual no bloqueante y ajustes accesibles. */
(function(root){'use strict';
const KEY='dead-cabin-404-effects', reduced=()=>root.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
let custom=null, timer=null, seq=0;
try{const v=localStorage.getItem(KEY);if(v==='on'||v==='off')custom=v}catch{}
const enabled=()=>custom==='on'?!reduced():custom==='off'?false:!reduced();
function sync(){document.documentElement.dataset.effects=enabled()?'on':'off';const b=document.getElementById('fxBtn');if(b){b.setAttribute('aria-pressed',String(enabled()));b.innerHTML=`✦ <span>EFECTOS ${enabled()?'ON':'OFF'}</span>`}}
function toggle(){custom=enabled()?'off':'on';try{localStorage.setItem(KEY,custom)}catch{}sync()}
function flash(type,label){if(!enabled())return;const stage=document.getElementById('fxStage');if(!stage)return;clearTimeout(timer);stage.replaceChildren();const el=document.createElement('div');el.className='fx-banner '+type;el.textContent=label;stage.append(el);const current=++seq;timer=setTimeout(()=>{if(seq===current)stage.replaceChildren()},800)}
function play(type,before,after){if(!after)return;
 if(type==='ATTACK'&&after.lastRoll){const r=after.lastRoll;flash(r.hit?'impact':'miss',`${r.weapon==='shotgun'?'ESCOPETA':'HACHA'} · ${r.value} · ${r.hit?`−${r.damage} PV`:'FALLO'}`)}
 else if(type==='SEAL')flash('ritual','GRIETA SELLADA');
 else if(type==='END_TURN'&&before&&after.hp<before.hp)flash('impact',`HERIDO · −${before.hp-after.hp} VIDA`);
 else if(type==='END_TURN'&&before&&after.sanity<before.sanity)flash('danger',`CORDURA · −${before.sanity-after.sanity}`);
 else if(type==='FLARE')flash('ritual','LUZ EN LA OSCURIDAD');
 if(after.ended)flash(after.won?'ritual':'danger',after.won?'HAS SOBREVIVIDO':'LA CASA HA GANADO');
}
root.DeadCabinFeedback={sync,toggle,play,enabled};
})(globalThis);
