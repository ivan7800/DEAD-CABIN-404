/* Director de tensión v3.0: presentación determinista, sin mutar el motor ni los guardados. */
(function(root){'use strict';
 const LEVELS=Object.freeze({calm:0,uneasy:1,danger:2,critical:3});
 function assess(state,api){
  if(!state||typeof state!=='object')return {level:'calm',title:'LA CASA ESCUCHA',detail:'La noche todavía no ha revelado sus intenciones.'};
  if(state.ended)return {level:'calm',title:state.won?'EL UMBRAL SE ABRE':'SILENCIO DEFINITIVO',detail:state.won?'Has escapado. Por ahora.':'La casa ha reclamado otra historia.'};
  const limit=api&&typeof api.doomLimit==='function'?api.doomLimit(state):26;
  const doom=Number(state.doom)||0,ratio=doom/Math.max(1,limit);
  const hp=Number(state.hp)||0,sanity=Number(state.sanity)||0;
  const enemies=Array.isArray(state.enemies)?state.enemies.filter(e=>e&&e.pos===state.pos).length:0;
  const threat=api&&typeof api.bossThreat==='function'?api.bossThreat(state):null;
  if(threat&&threat.ritual)return {level:'critical',title:'RITUAL INMINENTE',detail:'El enemigo prepara su siguiente ataque. Defenderse puede ser decisivo.'};
  if(ratio>=.86)return {level:'critical',title:'EL UMBRAL SE CIERRA',detail:'La oscuridad está al límite. Prioriza los objetivos o busca protección.'};
  if(hp<=3)return {level:'critical',title:'PULSO MUY DÉBIL',detail:'Tu vida corre peligro inmediato. Considera curarte o retirarte.'};
  if(enemies>0)return {level:'danger',title:'PRESENCIA HOSTIL',detail:`${enemies} ${enemies===1?'criatura ocupa':'criaturas ocupan'} esta habitación. Prepara tu siguiente acción.`};
  if(ratio>=.65)return {level:'danger',title:'LA NOCHE APREMIA',detail:'Cada turno pesa más. Revisa la ruta hasta el objetivo.'};
  if(sanity<=3)return {level:'danger',title:'LA MENTE CEDE',detail:'La cordura está baja. Evita exponerte innecesariamente.'};
  if(state.pendingChoice)return {level:'uneasy',title:'UNA DECISIÓN TE ESPERA',detail:'Elige con cuidado: la historia recordará esta decisión.'};
  if(ratio>=.35)return {level:'uneasy',title:'ALGO SE MUEVE',detail:'La oscuridad crece y la casa parece acercarse.'};
  return {level:'calm',title:'LA CASA ESCUCHA',detail:'Escucha los indicios y prepara tu siguiente movimiento.'};
 }
 function render(state,api,node){if(!node)return;const result=assess(state,api);node.dataset.tension=result.level;const title=node.querySelector('[data-tension-title]'),detail=node.querySelector('[data-tension-detail]');if(title)title.textContent=result.title;if(detail)detail.textContent=result.detail;node.setAttribute('aria-label',result.title+'. '+result.detail);return result}
 root.DeadCabinTension=Object.freeze({assess,render,LEVELS});
})(typeof globalThis!=='undefined'?globalThis:this);
