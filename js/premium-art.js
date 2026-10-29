/* DEAD CABIN 404 · Arte artesanal 2.5D: 25 salas, miniaturas y desgaste ambiental.
   Assets originales SVG autogenerados, deterministas, sin peticiones de red. */
(function(root){'use strict';
const A=root.DeadCabinArt,E=root.DeadCabinEngine;if(!A||!E)return;
const base=A.roomArt;
function rnd(seed){let v=seed|0;return()=>{v^=v<<13;v^=v>>>17;v^=v<<5;return(v>>>0)/4294967296}}
function fleck(x,y,r,fill='#151817',opacity='.38'){return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r*.43).toFixed(2)}" fill="${fill}" opacity="${opacity}"/>`}
function cobweb(x,y){return `<g fill="none" stroke="#c4bca6" stroke-width=".5" opacity=".38"><path d="M${x} ${y}l17 0 -17 19z"/><path d="M${x+3} ${y+1}q9 5 12 13M${x+6} ${y+1}q6 5 7 8M${x+1} ${y+6}q6 0 10 6"/></g>`}
function blood(x,y){return `<g opacity=".64" fill="#65292a">${fleck(x,y,5,'#65292a','.7')}${fleck(x+4,y+3,2,'#8b3430','.8')}<circle cx="${x-5}" cy="${y+8}" r="1.1"/><circle cx="${x+8}" cy="${y-5}" r="1.5"/><circle cx="${x+5}" cy="${y+10}" r=".6"/></g>`}
function runes(x,y){return `<g fill="none" stroke="#ad7057" opacity=".73" stroke-width="1"><circle cx="${x}" cy="${y}" r="10"/><path d="M${x} ${y-10}l8 15h-16zM${x-10} ${y}h20M${x} ${y-13}v26"/></g>`}
function claw(x,y){return `<path d="M${x} ${y}q-5 8 -3 18m9-20q-4 11-2 19m8-17q-3 10-1 17" fill="none" stroke="#8d4440" stroke-linecap="round" stroke-width="1.6" opacity=".8"/>`}
function lantern(x,y){return `<g><circle cx="${x}" cy="${y}" r="15" fill="#e2b273" opacity=".08"/><circle cx="${x}" cy="${y}" r="8" fill="#f6d08a" opacity=".12"/><rect x="${x-2}" y="${y-3}" width="4" height="7" rx="1" fill="#322722" stroke="#e7c087" stroke-width=".7"/><path d="M${x} ${y-2}q-4 3 0 5q4-3 0-5" fill="#ffe8a7"/></g>`}
function crack(x,y){return `<path d="M${x} ${y}l-4 7 5 6 -7 8m11-13 6 5 -2 9" fill="none" stroke="#161a17" stroke-width="1.2" opacity=".65"/>`}
function bones(x,y){return `<g fill="#a99b80" stroke="#4b4740" stroke-width=".6" opacity=".8"><path d="M${x} ${y}l14 7m-10-8-2-2m13 4 2 2" stroke="#a99b80" stroke-width="2.1"/><circle cx="${x+3}" cy="${y+2}" r="1.8"/><circle cx="${x+13}" cy="${y+7}" r="2"/></g>`}
const details=[
 (i)=>cobweb(10,11)+fleck(72,35,8)+crack(28,67),
 ()=>claw(68,19)+cobweb(9,10)+blood(62,71),
 ()=>lantern(78,13)+crack(54,40)+fleck(24,56,6),
 ()=>blood(59,60)+claw(11,35)+lantern(81,18),
 ()=>`<path d="M18 78q26-32 56-49m-41 59q3-24 31-43" fill="none" stroke="#34513b" stroke-width="5" opacity=".8"/>`+cobweb(9,10),
 ()=>crack(31,29)+blood(70,78)+cobweb(10,11),
 ()=>fleck(48,32,6)+claw(13,57)+cobweb(72,13),
 ()=>lantern(70,32)+cobweb(10,10)+crack(30,47),
 ()=>blood(47,53)+lantern(87,16)+fleck(20,30,4),
 ()=>runes(49,52)+lantern(23,21)+lantern(77,77),
 ()=>claw(35,70)+blood(76,32)+fleck(15,53,4),
 ()=>crack(53,42)+`<path d="M30 21l24 55m12-54-22 44" stroke="#9ea9a6" stroke-width="1.2" opacity=".7"/>`,
 ()=>blood(27,71)+lantern(82,19)+cobweb(10,11),
 ()=>crack(50,39)+claw(24,58)+blood(71,34),
 ()=>cobweb(8,8)+fleck(71,28,7)+bones(36,60),
 ()=>lantern(17,20)+`<path d="M17 45q20-30 37 8t36-20" fill="none" stroke="#a99a70" stroke-width="1.4" opacity=".6"/>`,
 ()=>cobweb(68,10)+claw(22,52)+fleck(72,70,5),
 ()=>runes(49,52)+bones(17,76)+lantern(78,17),
 ()=>`<circle cx="28" cy="68" r="8" fill="#8f8170" stroke="#322c2c"/><circle cx="25" cy="66" r="1.5" fill="#181818"/><circle cx="31" cy="66" r="1.5" fill="#181818"/><path d="M28 71v4" stroke="#121212"/>`+cobweb(10,10),
 ()=>blood(29,71)+cobweb(8,9)+claw(75,50),
 ()=>`<path d="M11 79q20-36 42-19t37-29" fill="none" stroke="#4d6039" stroke-width="5" opacity=".55"/>`+crack(56,23),
 ()=>claw(72,29)+cobweb(9,9)+lantern(49,16),
 ()=>lantern(50,72)+`<path d="M33 82h35" stroke="#b1966f" stroke-width="2" opacity=".8"/>`+cobweb(8,8),
 ()=>bones(43,63)+crack(23,28)+blood(72,37),
 ()=>runes(50,50)+bones(18,78)+blood(72,27)
];
A.roomArt=function(i,known){const output=base(i,known);if(!known||i<0||i>=25)return output;
 const random=rnd((i+37)*32452843),ghost=[9,11,17,24].includes(i),light=ghost?'#9b5069':'#e3ad68',texture=[];
 for(let j=0;j<25;j++){const x=Math.round(random()*90+5),y=Math.round(random()*90+5),sz=(random()*2+.3).toFixed(1);texture.push(fleck(x,y,sz,j%7?'#0c1412':'#ae9a7b',j%7?'.20':'.17'))}
 let extras=`<defs><radialGradient id="dcGlow${i}" cx=".3" cy=".2" r=".9"><stop stop-color="${light}" stop-opacity=".15"/><stop offset=".55" stop-color="${light}" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".44"/></radialGradient><linearGradient id="dcDust${i}"><stop stop-color="#ba9c70" stop-opacity=".05"/><stop offset=".5" stop-color="#000" stop-opacity=".01"/><stop offset="1" stop-color="#000" stop-opacity=".27"/></linearGradient></defs>`;
 extras+=`<g class="room-weathering" pointer-events="none">${texture.join('')}${details[i](i)}<rect width="100" height="100" fill="url(#dcGlow${i})"/><rect width="100" height="100" fill="url(#dcDust${i})"/><path d="M6 7h88v87H6z" fill="none" stroke="#d4b989" stroke-opacity=".12" stroke-width="2"/></g>`;
 return output.replace('</svg>',extras+'</svg>')};
function figure(type){
 const color={hero:'#638279',possessed:'#947d6f',stalker:'#353f3a',brute:'#734e49',boss:'#52433f',wraith:'#9ab4ab',leech:'#924e50',heart:'#94383b'}[type]||'#638279';
 const cloak=type==='wraith',big=type==='brute'||type==='boss',beast=type==='leech'||type==='heart';
 if(beast){return type==='heart'?`<path d="M50 85Q13 57 26 35Q38 21 50 41Q65 15 79 35Q92 60 50 85Z" fill="${color}" stroke="#d3998b" stroke-width="3"/><path d="M48 47Q18 30 8 53m45 5q32-35 41-16M39 70Q14 80 8 94m60-24q21 2 26 19" stroke="#b44f53" stroke-width="6" fill="none"/>`:`<ellipse cx="50" cy="64" rx="27" ry="22" fill="${color}" stroke="#bd8272" stroke-width="3"/><circle cx="48" cy="63" r="12" fill="#260f17" stroke="#f0a6a2" stroke-width="3"/><path d="M22 56 6 36m23 42-20 14m64-38 19-19M71 77l18 16" stroke="#9e5550" stroke-width="6"/>`}
 return `<path d="M${big?13:23} 88 Q15 53 33 48L68 48Q86 61 ${big?87:78} 88Z" fill="${color}" stroke="#c0a58b" stroke-width="${big?3:2}"/><path d="M34 49 50 66 66 49" fill="none" stroke="#241e1d" stroke-width="4"/><path d="M28 72 13 83M71 72l15 11" stroke="${color}" stroke-width="${big?13:9}" stroke-linecap="round"/><ellipse cx="50" cy="32" rx="${big?18:15}" ry="20" fill="${cloak?'#637d75':type==='possessed'?'#9e8d80':'#b29b83'}" stroke="#291e21" stroke-width="2"/><path d="M32 28Q35 5 49 8Q69 4 69 28L61 19 42 20Z" fill="${cloak?'#2b393c':'#292b29'}"/><path d="M38 33h9m7 0h9" stroke="${type==='hero'?'#222':'#e8a1a0'}" stroke-width="3"/><path d="M42 49q8 5 16 0" fill="none" stroke="#4c2427" stroke-width="2"/>${cloak?'<path d="M24 79Q5 51 31 23M77 80q19-32-6-62" fill="none" stroke="#a0c5b7" stroke-width="6" opacity=".4"/>':''}${big?'<path d="M20 64 10 47m69 16 11-18" stroke="#8a6e61" stroke-width="10"/>':''}`
}
A.miniature=function(type){const kind=type==='hero'?'hero':(E.ENEMY_TYPES[type]?type:'possessed');return `<svg class="miniature-art" viewBox="0 0 100 112" aria-hidden="true" focusable="false"><defs><linearGradient id="miniMetal${kind}" x2=".8" y2="1"><stop stop-color="#f1d9a3"/><stop offset=".35" stop-color="#7e6251"/><stop offset="1" stop-color="#261e1d"/></linearGradient></defs><ellipse cx="50" cy="102" rx="43" ry="8" fill="#080a0a" opacity=".7"/><ellipse cx="50" cy="98" rx="38" ry="10" fill="url(#miniMetal${kind})" stroke="#c5ab82" stroke-width="2"/><path d="M19 95Q50 102 81 95" fill="none" stroke="#100e0e" stroke-width="3"/><g filter="none">${figure(kind)}</g><path d="M25 87q25 14 50 0" fill="none" stroke="#e8ce9c" stroke-opacity=".22" stroke-width="2"/></svg>`};
})(globalThis);
