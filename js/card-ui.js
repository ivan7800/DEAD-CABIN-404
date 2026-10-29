/* DEAD CABIN 404 v2.1: presentation-only card registry.
   Mechanics are read from the canonical engine cards, never duplicated in save state. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DeadCabinCardUI=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ICONS={threat:'☠',occult:'◉',hope:'✧',supply:'✚',dormant:'✥'};
const TYPES={spawn:'INVOCACIÓN',sanity:'CORDURA',hope:'ALIVIO',damage:'HERIDA',doom:'OSCURIDAD',ammo:'MUNICIÓN',medkit:'MEDICINA',ward:'TALISMÁN',flare:'BENGALA',scrap:'CHATARRA'};
const plural=(num,singular,pluralForm)=>`${num} ${num===1?singular:pluralForm}`;
function describe(card){
 if(!card||!card.id)return {family:'dormant',icon:ICONS.dormant,label:'EN ESPERA',effect:'Al finalizar el turno, el mazo revelará una consecuencia.',name:'La casa espera',flavor:'La casa contiene la respiración.'};
 const c=card, v=Number(c.value)||0,sign=v>0?'+':'',effects={
  spawn:`Aparece ${plural(Math.max(0,v),'criatura enemiga','criaturas enemigas')} si hay espacio en la cabaña.`,
  sanity:`${sign}${v} de cordura.`,
  hope:`+${Math.max(0,v)} de cordura.`,
  damage:`−${Math.max(0,v)} de salud.`,
  doom:`${sign}${v} de oscuridad.`,
  ammo:`+${Math.max(0,v)} ${v===1?'cartucho':'cartuchos'}.`,
  medkit:`+${Math.max(0,v)} ${v===1?'botiquín':'botiquines'}.`,
  ward:`+${Math.max(0,v)} ${v===1?'talismán':'talismanes'}.`,
  flare:`+${Math.max(0,v)} ${v===1?'bengala':'bengalas'}.`,
  scrap:`+${Math.max(0,v)} de chatarra.`
 };
 let family='supply';
 if(c.type==='spawn'||c.type==='damage')family='threat';
 else if((c.type==='sanity'||c.type==='doom')&&v>0)family=c.type==='sanity'?'hope':'occult';
 else if((c.type==='sanity'||c.type==='doom')&&v<0)family=c.type==='sanity'?'occult':'hope';
 else if(c.type==='hope')family='hope';
 return {family,icon:ICONS[family],label:TYPES[c.type]||'ACONTECIMIENTO',effect:effects[c.type]||'El efecto se resuelve al robar la carta.',name:c.name||'Carta desconocida',flavor:c.flavor||''};
}
const stroke='#e5cba0';
const motif={
 steps:'<path d="M38 94l38-27 27 23 27-26 35 21 28-24 48 30" stroke="#cb644d" stroke-width="11" stroke-linecap="round" stroke-dasharray="12 17" fill="none"/><path d="M38 94l38-27 27 23 27-26 35 21 28-24 48 30" stroke="#f0ba87" stroke-width="2" stroke-dasharray="7 22" fill="none"/>',
 cold:'<g stroke="#d3f0e9" stroke-width="3" fill="none"><path d="M160 28v125M94 90h132M112 42l96 97M208 43l-96 95"/><path d="m150 45 10 10 10-10m-20 94 10-10 10 10m-66-59 10 10-10 10m111-20-10 10 10 10"/></g><circle cx="160" cy="90" r="21" fill="#9bd7d1" opacity=".18"/>',
 whisper:'<ellipse cx="160" cy="112" rx="82" ry="31" fill="#090e13" stroke="#9c8b78" stroke-width="12"/><ellipse cx="160" cy="111" rx="58" ry="19" fill="#203d47"/><path d="M102 90q40-55 66-26t60 2" stroke="#d7d7c3" opacity=".6" stroke-width="3" fill="none"/><circle cx="160" cy="107" r="9" fill="#a34a43"/>',
 lantern:'<circle cx="160" cy="88" r="70" fill="#f6b665" opacity=".14"/><path d="M128 60h64v91h-64z" fill="#3c2b24" stroke="#d8bb87" stroke-width="7"/><path d="M144 57q16-37 32 0m-33 18v70m34-70v70" fill="none" stroke="#cfab79" stroke-width="5"/><path d="M160 133q-28-25 0-54 27 28 0 54" fill="#ffcd78"/>',
 medicine:'<rect x="85" y="59" width="150" height="93" rx="12" fill="#4e332c" stroke="#cfaa80" stroke-width="7"/><rect x="139" y="41" width="42" height="24" rx="8" fill="none" stroke="#c8b29b" stroke-width="7"/><path d="M160 78v53M134 104h52" stroke="#efdac3" stroke-width="13"/>',
 shells:'<g transform="rotate(-17 160 95)"><rect x="98" y="43" width="30" height="99" rx="8" fill="#906247" stroke="#d8af74" stroke-width="5"/><rect x="145" y="43" width="30" height="99" rx="8" fill="#ab7650" stroke="#d8af74" stroke-width="5"/><rect x="192" y="43" width="30" height="99" rx="8" fill="#86533b" stroke="#d8af74" stroke-width="5"/><path d="M99 120h29m17 0h29m18 0h29" stroke="#e5cf9a" stroke-width="11"/></g>',
 roots:'<path d="M164 185V47M164 99Q82 100 67 35M164 118Q245 107 264 27M164 142Q80 171 27 128M164 151Q256 170 296 115" fill="none" stroke="#503525" stroke-width="25"/><path d="M164 185V47M164 99Q82 100 67 35M164 118Q245 107 264 27M164 142Q80 171 27 128M164 151Q256 170 296 115" fill="none" stroke="#bd8662" stroke-width="4"/>',
 nails:'<rect x="80" y="28" width="160" height="144" fill="#3f4240" stroke="#aab0a4" stroke-width="8"/><path d="M120 42v118m39-112v117m39-118v120" stroke="#d9ccc0" stroke-width="5"/><path d="m97 105 26-35m16 61 41-52m1 72 28-38" stroke="#b54b43" stroke-width="7"/>',
 prayer:'<circle cx="160" cy="91" r="61" fill="none" stroke="#d7bb8c" stroke-width="4"/><circle cx="160" cy="91" r="49" fill="none" stroke="#d7bb8c" stroke-width="1.5"/><path d="M160 34l51 103H109L160 34zm-51 18 102 85m0-85-102 85" fill="none" stroke="#e4cf9d" stroke-width="4"/><circle cx="160" cy="91" r="10" fill="#b65e57"/>',
 pulse:'<path d="M160 145Q53 85 108 48q33-18 52 19 28-43 65-13 35 42-65 91" fill="#7d3133" stroke="#d69d84" stroke-width="6"/><path d="M32 105h74l19-35 20 72 27-48 12 11h103" stroke="#ffd1bc" stroke-width="5" fill="none"/>',
 mirror:'<rect x="102" y="23" width="116" height="144" rx="30" fill="#213a40" stroke="#bc916c" stroke-width="10"/><ellipse cx="161" cy="92" rx="32" ry="45" fill="#77877b"/><path d="M134 89h17m23 0h17" stroke="#121c20" stroke-width="6"/><path d="M139 115q24 20 44-4" stroke="#7b2936" stroke-width="6" fill="none"/><path d="m119 152 77-108m-37 112 39-57" stroke="#c8e6dc" opacity=".6" stroke-width="4"/>',
 ward:'<circle cx="160" cy="94" r="68" fill="none" stroke="#eee3c4" stroke-width="11" stroke-dasharray="6 6"/><path d="m160 44 23 86-70-52h94l-70 52z" fill="none" stroke="#debd85" stroke-width="4"/><circle cx="160" cy="94" r="10" fill="#e3bf78"/>',
 blood:'<path d="M70 25h180v40q-29 8-29 35v35q-16 17-31 0V57q-21-11-31 6v87q-14 20-28-1V56q-20 0-23 31v25q-17 18-30 0V25Z" fill="#882f35" stroke="#cb7065" stroke-width="5"/><path d="M158 144v27m59-20v17" stroke="#d96358" stroke-width="6"/>',
 silence:'<path d="M181 30q-53 17-52 61 0 53 67 62-63 26-94-26-36-72 79-97" fill="#e9d6b7"/><path d="m221 55 8 9 12-14m-24 55 12-10 13 13" stroke="#b3d2c9" stroke-width="4" fill="none"/><circle cx="242" cy="31" r="4" fill="#e9d6b7"/>',
 hunger:'<path d="M57 88q102-84 205 0-94 101-205 0Z" fill="#1c1013" stroke="#cc9c88" stroke-width="8"/><path d="m66 90 20 27 16-32 20 26 18-29 18 27 18-28 19 27 16-26 19 29 20-26" fill="#d9c8b3" stroke="#e8ddd2" stroke-width="3"/>',
 candle:'<path d="M138 74h46v83h-46z" fill="#d9c8ab" stroke="#756c5f" stroke-width="5"/><path d="M160 77Q126 53 160 19q37 37 0 58" fill="#ffca78"/><path d="M160 68q-16-17 0-37 18 18 0 37" fill="#f28d47"/><circle cx="161" cy="66" r="63" fill="#e8a65d" opacity=".07"/>',
 harvest:'<g stroke="#25382c" stroke-width="12"><path d="M64 167 83 22m149 145 26-152m-94 160V35"/></g><g fill="#6a3d35" stroke="#bd7161" stroke-width="3"><circle cx="81" cy="65" r="19"/><circle cx="165" cy="80" r="22"/><circle cx="251" cy="49" r="17"/></g><path d="M38 166h247" stroke="#b48a65" stroke-width="4"/>',
 fever:'<path d="M108 146q-27-45 2-94 24-35 64-22 49 19 40 79l-20 37Z" fill="#a47e6a" stroke="#4b302c" stroke-width="7"/><path d="M126 84h20m28-2h20" stroke="#4e2326" stroke-width="6"/><path d="M131 118q33-15 51 0" fill="none" stroke="#842a38" stroke-width="5"/><path d="M170 27q15 45 38 39" stroke="#c85e58" stroke-width="7" fill="none"/>',
 broken:'<circle cx="160" cy="94" r="68" fill="#4a3d37" stroke="#d4b884" stroke-width="10"/><circle cx="160" cy="94" r="5" fill="#eed9ad"/><path d="M160 94 184 64M160 94l-19 35m-46-35h11m112 0h11m-69-57v10m0 102v-10" stroke="#f3dbaf" stroke-width="5"/><path d="m175 27-20 47 18 21-16 58" stroke="#151b1b" stroke-width="9"/>',
 archive:'<rect x="83" y="49" width="154" height="107" fill="#644636" stroke="#b08e63" stroke-width="7"/><path d="M82 86h155m-148 36h141" stroke="#c4a274" stroke-width="5"/><rect x="139" y="95" width="43" height="16" rx="2" fill="#dbbb88"/><path d="M146 101h29" stroke="#5e4b36" stroke-width="3"/><path d="m95 52 120-22" stroke="#e5c49a" stroke-width="5"/>',
 breath:'<path d="M82 61q27-32 51 0 21 28 48 0 27-28 54 4M76 102q27-28 51 1 21 25 48 0 27-31 59 0M90 140q26-22 48 0 22 20 47-1 25-22 49 0" stroke="#bbdedc" stroke-width="6" opacity=".7" fill="none"/><circle cx="161" cy="95" r="12" fill="#d0b7a0" opacity=".4"/>',
 bone:'<g transform="rotate(-18 160 94)"><path d="M106 79Q72 41 64 67q-11 21 18 39-15 24 9 37 19 9 41-24h64q25 33 44 13 13-17-11-32 29-23 8-41-18-17-40 20Z" fill="#d7c7a4" stroke="#988c79" stroke-width="6"/></g>',
 doubt:'<path d="M122 154q-57-23-33-94 16-48 64-34 39 16 38 78-4 35-35 50" fill="#918079" stroke="#473b3b" stroke-width="7"/><path d="M183 157q67-28 45-97-22-48-65-28-31 24-29 77 9 36 49 48" fill="#687e79" opacity=".8" stroke="#354344" stroke-width="7"/><path d="M117 88h24m43 0h24" stroke="#362a29" stroke-width="6"/>',
 embers:'<g fill="#c95e46"><circle cx="116" cy="128" r="18"/><circle cx="171" cy="107" r="22"/><circle cx="218" cy="141" r="13"/></g><g stroke="#efbd79" stroke-width="4" fill="none"><path d="m111 114 10-68m58 50 26-55m4 104 47-78"/><path d="M97 163h145" stroke-width="8"/></g>'
};
/* The 24 unique silhouettes use a shared cinematic lighting system. */
const accents={threat:['#571e26','#d96b62'],occult:['#33243c','#ab84bb'],hope:['#354c44','#d1c38c'],supply:['#3c433a','#e0b785'],dormant:['#38413d','#c4af89']};
function illustration(id,family='dormant'){
 const shape=Object.hasOwn(motif,id)?motif[id]:motif.silence,[shadow,highlight]=accents[family]||accents.dormant;
 const suffix='-'+String(id).replace(/[^a-z0-9]/gi,'');
 return `<svg class="event-illustration" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración del acontecimiento"><defs><radialGradient id="eventInk${suffix}" cx="48%" cy="42%" r="77%"><stop stop-color="#55504a"/><stop offset=".52" stop-color="${shadow}"/><stop offset="1" stop-color="#101818"/></radialGradient><linearGradient id="eventLight${suffix}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${highlight}" stop-opacity=".32"/><stop offset=".54" stop-color="#ddd5b5" stop-opacity="0"/><stop offset="1" stop-color="#090b10" stop-opacity=".65"/></linearGradient><filter id="eventRough${suffix}"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="9" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer></filter></defs><rect width="320" height="180" fill="url(#eventInk${suffix})"/><path d="M0 150 32 91 61 122 102 79 132 127 177 68 221 105 268 60 320 116V180H0Z" fill="#10191a" opacity=".52"/><circle cx="250" cy="35" r="27" fill="${highlight}" opacity=".2"/><g filter="url(#eventRough${suffix})"><rect width="320" height="180" fill="#ddd1ba"/></g><g>${shape}</g><rect width="320" height="180" fill="url(#eventLight${suffix})"/><rect x="5" y="5" width="310" height="170" fill="none" stroke="${highlight}" stroke-opacity=".52" stroke-width="1"/><path d="M13 16h36m-36 0v34m294-34h-36m36 0v34M13 164h36m-36 0v-34m294 34h-36m36 0v-34" stroke="${highlight}" stroke-width="2" fill="none"/></svg>`;
}
return {describe,illustration,TYPES,ICONS};
});
