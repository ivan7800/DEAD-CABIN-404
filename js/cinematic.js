/* Decorative cinematic effects. No gameplay state, no save changes. */
(()=>{'use strict';
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const layer=document.createElement('div');layer.className='cinematic-particles';layer.setAttribute('aria-hidden','true');
for(let i=0;i<13;i++){const p=document.createElement('i');p.className='cinematic-particle';p.style.left=((i*73+17)%97)+'%';p.style.setProperty('--ember-duration',(8+i%7*2)+'s');p.style.setProperty('--ember-delay',(-i*1.7)+'s');layer.appendChild(p)}
document.body.appendChild(layer);
const history=document.getElementById('history');if(!history)return;
let last='';
const observer=new MutationObserver(()=>{const entry=history.querySelector('.entry:last-child');if(!entry)return;const key=entry.textContent;if(key===last)return;last=key;const type=entry.classList.contains('danger')?'hit':entry.classList.contains('victory')?'seal':null;if(!type)return;const flash=document.createElement('div');flash.className='cinematic-impact '+type;flash.setAttribute('aria-hidden','true');document.body.appendChild(flash);flash.addEventListener('animationend',()=>flash.remove(),{once:true});setTimeout(()=>flash.remove(),650)});
observer.observe(history,{childList:true,subtree:true});
})();