/* DEAD CABIN 404 · RC2 — lectura ambiental determinista. No altera el estado del motor. */
(function(root){'use strict';
const CHAPTERS=[
 {name:'LA MADERA RECUERDA',hint:'Bajo el barniz hay uñas que arañaron hacia fuera.',color:'amber'},
 {name:'LAS PAREDES RESPIRAN',hint:'La casa exhala cuando dejas de moverte.',color:'moss'},
 {name:'EL ECO INVERTIDO',hint:'Tus pasos vuelven antes de que los des.',color:'cyan'},
 {name:'LOS HUÉSPEDES INVISIBLES',hint:'Hay un lugar ocupado en cada mesa vacía.',color:'violet'},
 {name:'LA CARNE DE LA CASA',hint:'Las vetas de la madera laten bajo tus manos.',color:'crimson'},
 {name:'LA LUZ ENFERMA',hint:'Las sombras se proyectan hacia la lámpara.',color:'cyan'},
 {name:'EL NOMBRE ENTERRADO',hint:'Una voz responde desde detrás del yeso.',color:'violet'},
 {name:'EL ÚLTIMO UMBRAL',hint:'La casa conoce tu decisión antes que tú.',color:'crimson'}
];
const DETAILS=[
 'El marco cruje cuando apartas la mirada.',
 'Alguien ha contado los pasos que te quedan.',
 'El polvo dibuja la huella de una mano reciente.',
 'Hay una humedad tibia en la pared norte.',
 'El aire sabe a metal y lluvia antigua.',
 'Una tabla del suelo cede bajo un peso invisible.',
 'La luz insiste en iluminar un rincón vacío.',
 'El silencio tiene una segunda respiración.',
 'Algo golpea la madera desde dentro.',
 'Un arañazo atraviesa varias capas de pintura.',
 'La temperatura cae al pronunciar tu nombre.',
 'En el cristal aparece vaho desde el otro lado.'
];
function describe(game,engine){
 const ch=CHAPTERS[Math.min(7,Math.max(0,(Number(game.chapter)||1)-1))];
 const i=Math.min(24,Math.max(0,Number(game.pos)||0));
 const enemies=(game.enemies||[]).filter(e=>e.pos===i);
 const rift=(game.sealSpots||[]).includes(i)&&!(game.sealed||[]).includes(i);
 const cursed=(game.cursed||[]).includes(i);
 const clue=(game.objectiveSpots||[]).includes(i)&&!(game.objectiveDone||[]).includes(i);
 const boss=enemies.some(e=>e.type==='boss');
 const room=engine.ROOM_NAMES?.[i]||`Sala ${i+1}`;
 let condition='silence',headline='NADIE DEBERÍA ESTAR AQUÍ',detail=DETAILS[(i*7+(Number(game.chapter)||1)*3)%DETAILS.length];
 if(boss){condition='boss';headline='LA CASA HA ENCONTRADO SU VOZ';detail='Una presencia inmensa ocupa toda la habitación. Incluso las paredes se repliegan.'}
 else if(enemies.length){condition='enemy';headline='NO ESTÁS A SOLAS';detail=`${enemies.length} presencia${enemies.length===1?' te observa':'s te observan'} desde la penumbra.`}
 else if(rift){condition='rift';headline='LA GRIETA ESTÁ ABIERTA';detail='La geometría de la sala deja de obedecer a la luz. El ritual aún puede cerrarse.'}
 else if(cursed){condition='cursed';headline='LA SALA TE RECONOCE';detail='El lugar parece consumir los recuerdos que intentas conservar.'}
 else if(clue){condition='clue';headline='ALGO QUIERE SER ENCONTRADO';detail='Una señal discreta sobresale del ruido de la casa. Puedes investigar aquí.'}
 return {chapter:ch.name,hint:ch.hint,color:ch.color,room,condition,headline,detail,number:i+1};
}
function render(game,engine,element){if(!element)return;const d=describe(game,engine);element.dataset.mood=d.color;element.dataset.condition=d.condition;
 const set=(key,value)=>{const e=element.querySelector(`[data-ambient-${key}]`);if(e&&e.textContent!==value)e.textContent=value};
 set('chapter',d.chapter);set('headline',d.headline);set('detail',d.detail);set('whisper',d.hint);set('room',`${String(d.number).padStart(2,'0')} / ${d.room.toUpperCase()}`);
 const visual=element.querySelector('.ambient-illustration');if(visual)visual.dataset.condition=d.condition;
}
root.DeadCabinAtmosphere=Object.freeze({describe,render});
})(globalThis);
