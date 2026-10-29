/* DEAD CABIN 404 · Controlador de interfaz: motor → DOM (sin dependencias). */
(function(){'use strict';
const E=globalThis.DeadCabinEngine,A=globalThis.DeadCabinArt,S=globalThis.DeadCabinAudio;
if(!E||!A||!S){document.body.textContent='Error: faltan módulos del juego. Comprueba que has extraído el ZIP completo.';return}
const $=id=>document.getElementById(id), SAVE='dead-cabin-404-v4', OLD_SAVE='dead-cabin-404-v3', PROGRESS='dead-cabin-404-campaign-v3', LEGACY='dead-cabin-404-v1', RECORDS='dead-cabin-404-records-v4';
let game,attackMode=null,unlocked=1,previousRevealed=[],previousCard='',lastModalFocus=null,toastTimer=null, records={games:0,wins:0,bestScore:0,bestTurn:0,achievements:[]};
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function format(n){return String(n).padStart(2,'0')}
function getStorage(key){try{return localStorage.getItem(key)}catch{return null}}
function setStorage(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
function showToast(message){const t=$('toast');t.textContent=message;t.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('hidden'),2600)}
function persist(){return setStorage(SAVE,JSON.stringify(game))}
function loadSaved(){
 try{const data=JSON.parse(getStorage(SAVE));if(E.validate(data)){game=data;return 'v4'}}catch{}
 try{const data=JSON.parse(getStorage(OLD_SAVE));const moved=E.upgradeV3(data);if(moved){game=moved;persist();return 'v3'}}catch{}
 try{const data=JSON.parse(getStorage(LEGACY));const moved=E.migrateLegacy(data);if(moved){game=moved;persist();return 'legacy'}}catch{}return null}
function saveRecords(){setStorage(RECORDS,JSON.stringify(records))}
function registerEnd(){if(game.recorded)return;game.recorded=true;records.games++;if(game.won)records.wins++;
 records.bestScore=Math.max(records.bestScore,game.score);if(game.mode==='endless')records.bestTurn=Math.max(records.bestTurn,game.turn);
 records.achievements=[...new Set([...records.achievements,...E.achievementsFor(game)])];saveRecords();persist()}

function showModal({kicker='ARCHIVO 404',title,content,actions=[],lock=false}){
 lastModalFocus=document.activeElement;$('modalKicker').textContent=kicker;$('modalTitle').textContent=title;$('modalContent').innerHTML=content;$('modalActions').replaceChildren();
 $('modal').dataset.locked=lock?'true':'false';$('modalClose').hidden=lock;
 for(const config of actions){let b=document.createElement('button');b.type='button';b.textContent=config.label;if(config.primary)b.classList.add('primary');
 b.addEventListener('click',()=>{closeModal(true);if(config.run)config.run()});$('modalActions').append(b)}
 $('modal').classList.remove('hidden');document.body.classList.add('modal-open');(lock?$('modalActions').querySelector('button'):$('modalClose'))?.focus()}
function closeModal(force=false){if($('modal').dataset.locked==='true'&&!force)return;
 $('modal').dataset.locked='false';$('modalClose').hidden=false;$('modal').classList.add('hidden');document.body.classList.remove('modal-open');if(lastModalFocus&&lastModalFocus.isConnected)lastModalFocus.focus()}

function chapterIntro(){const c=E.currentChapter(game),isEndless=game.mode==='endless',o=E.currentObjective(game);
 showModal({kicker:isEndless?'SUPERVIVENCIA INFINITA':`EXPEDIENTE ${format(game.chapter)} / 08`,title:isEndless?'Noche sin amanecer':c.name,
 content:`<p class="modal-callout">${escapeHtml(isEndless?'La cabaña no termina. Resiste tantas noches como puedas; a partir del turno 12 podrás regresar a la Entrada y evacuar con tu puntuación.':c.description)}</p>
 <p><b>${escapeHtml(E.SURVIVORS[game.survivor].name)}</b> · ${escapeHtml(E.SURVIVORS[game.survivor].role)} · Dificultad ${escapeHtml(E.DIFFICULTIES[game.difficulty].name)}.</p>
 ${isEndless?'<p>Cierra grietas para frenar la oscuridad. No hay un turno final obligatorio.</p>':`<p><b>Objetivo de misión:</b> ${c.seals} grietas y <b>${escapeHtml(o.description)}</b>. Después, regresa a la Entrada.</p>`}
 <p>Tienes 3 PA por turno. En algunas habitaciones encontrarás encuentros que obligan a elegir una de dos consecuencias.</p>`,
 actions:[{label:'ENTRAR EN LA CABAÑA',primary:true,run:()=>showToast('La casa ya sabe que estás aquí.')},{label:'Ver reglamento',run:showRules}]})}

function showRules(){showModal({kicker:'MANUAL COMPLETO · EDICIÓN 1.0',title:'Reglamento de la noche',content:`
 <p>Juego de mesa táctico original para una persona, sin servidor. El motor usa un dado d6 reproducible y baraja de 24 cartas sin reposición hasta agotar el mazo.</p>
 <h3>1 · Misiones</h3><p>Revela el tablero de 5×5 entrando en losetas vecinas. Debes cerrar todas las grietas y resolver la <b>misión exclusiva</b> del capítulo (encontrar reliquias, reparar pararrayos, matar acechadores, purificar salas, recuperar señales de radio o vencer al jefe). Después regresa a la casilla 23 y pulsa Escapar. Cada capítulo tiene su propio límite de oscuridad.</p>
 <h3>2 · Tres puntos de acción</h3><ul><li><b>Mover:</b> pulsa habitación ortogonal adyacente, 1 PA; revela la sala.</li><li><b>Buscar:</b> 1 PA; una vez por habitación y sin enemigos dentro. Da cartuchos, botiquín, talismán, bengala, chatarra o cordura.</li><li><b>Investigar:</b> 1 PA en una sala con símbolo ◇, sin enemigos; completa objetivos especiales.</li><li><b>Hacha:</b> 1 PA; alcance 0–1, impacta con 4+ en un d6, hace 1 daño (+1 con 6).</li><li><b>Escopeta:</b> 1 PA +1 cartucho; alcance 0–2 en línea despejada y explorada, impacta con 3+, hace 2 daño (+1 con 6).</li><li><b>Sellar:</b> 1 PA sobre grieta ✥ sin enemigos; −1 cordura, −3 oscuridad.</li><li><b>Descansar:</b> 1 PA, +1 cordura. En capítulo 6 puede fallar.</li><li><b>Habilidad:</b> 1 PA, una vez por turno: explorar desde lejos, primeros auxilios o exorcismo.</li><li><b>Botiquín:</b> 1 PA, consume 1, +4 salud; <b>Talismán:</b> 1 PA, consume 1, +2 cordura y −2 oscuridad.</li><li><b>Bengala:</b> 1 PA, revela las cuatro salas contiguas, aturde enemigos cercanos y −1 oscuridad.</li><li><b>Barricada:</b> 1 PA +1 chatarra, frena al primer enemigo que entra en la sala.</li></ul>
 <h3>3 · Combate y monstruos</h3><p>Hay poseídos, acechadores (2 movimientos), abominaciones (2 de daño), espectros (atraviesan espacios revelados y atacan cordura), parásitos (aumentan oscuridad) y dos jefes. Un arma reforzada gasta automáticamente 3 chatarras al golpear para causar +1 daño. Todos los ataques con dado están anotados en la crónica.</p>
 <h3>4 · Fase del mal</h3><p>Pulsa Fin de turno, aunque te queden PA. La oscuridad aumenta según la dificultad, se roba una carta, avanzan los efectos especiales, aparecen monstruos y cada enemigo actúa. Entonces recuperas 3 PA. En «Historia» la oscuridad sube más despacio; «Pesadilla» añade presión y precisión enemiga.</p>
 <h3>5 · Encuentros y campaña</h3><p>Cuatro habitaciones esconden decisiones narrativas con efectos reales. Hay ocho capítulos con misiones diferentes, tres supervivientes y tres dificultades. Cada victoria de campaña desbloquea el siguiente capítulo, con logros persistentes.</p>
 <h3>6 · Supervivencia infinita</h3><p>Las grietas reaparecen cuando sellas las cuatro iniciales; la dificultad crece. A partir del turno 12 puedes escapar por la Entrada y registrar tu puntuación, o seguir jugando hasta caer. La puntuación depende de exploración, objetivos, enemigos y supervivencia.</p>
 <h3>7 · Derrota, controles y guardado</h3><p>Pierdes al llegar a 0 salud, 0 cordura o al límite de oscuridad. WASD/flechas mueven; E finaliza; 1 busca; 2 descansa; 3 sella; 4 usa botiquín; Esc cancela selección. Los controles táctiles también funcionan. El guardado es local, automático tras cada acción; solo hay una partida activa por navegador y origen.</p>`,actions:[{label:'VOLVER AL JUEGO',primary:true}]})}

function showSetup(n=1,mode='campaign'){
 const isEndless=mode==='endless',prev=game||E.createGame(1),chapter=E.CHAPTERS[n-1];
 const survivorChoices=Object.entries(E.SURVIVORS).map(([id,x])=>`<option value="${id}" ${prev.survivor===id?'selected':''}>${escapeHtml(x.name)} — ${escapeHtml(x.role)}</option>`).join('');
 const difficultyChoices=Object.entries(E.DIFFICULTIES).map(([id,x])=>`<option value="${id}" ${prev.difficulty===id?'selected':''}>${escapeHtml(x.name)} — ${escapeHtml(x.description)}</option>`).join('');
 showModal({kicker:isEndless?'MODO LIBRE':'CONFIGURAR EXPEDICIÓN',title:isEndless?'Noche infinita':chapter.name,
 content:`<p>Selecciona superviviente y dificultad. <b>Se sustituirá la partida activa</b>, pero conservarás capítulos, récords y logros.</p><div class="setup-field"><label for="survivorSelect">SUPERVIVIENTE</label><select id="survivorSelect">${survivorChoices}</select></div><div class="setup-field"><label for="difficultySelect">DIFICULTAD</label><select id="difficultySelect">${difficultyChoices}</select></div><p class="modal-callout">${escapeHtml(isEndless?'Sin final forzoso: puedes escapar desde el turno 12.':chapter.description)}</p>`,
 actions:[{label:'COMENZAR PARTIDA',primary:true,run:()=>{let survivor=$('survivorSelect').value,difficulty=$('difficultySelect').value;startNew(n,{survivor,difficulty,mode})}},{label:'CANCELAR'}]})}
function showCampaign(){let html='<p>Ocho expedientes conectados, cada uno con objetivo secundario propio. Las victorias desbloquean nuevos capítulos.</p><div class="chapter-list">';
 for(const c of E.CHAPTERS){const locked=c.id>unlocked;html+=`<button type="button" class="chapter-card${c.id===game.chapter&&game.mode==='campaign'?' current':''}" data-chapter="${c.id}" ${locked?'disabled':''}><small>CAPÍTULO ${format(c.id)} ${locked?'· BLOQUEADO':c.id===game.chapter&&game.mode==='campaign'?'· ACTUAL':'· DISPONIBLE'}</small><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(E.SIDE_OBJECTIVES[c.id].name)}</small></button>`}
 html+='</div><p class="modal-callout">Elige un capítulo para configurar una nueva partida. Los capítulos y los logros permanecen guardados localmente.</p>';
 showModal({kicker:'EL LIBRO DE LOS OCHO UMBRALES',title:'Seleccionar capítulo',content:html,actions:[{label:'VOLVER AL JUEGO',primary:true}]});
 $('modalContent').querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.chapter);if(n<=unlocked)showSetup(n)}))}
function showRecords(){const a=E.ACHIEVEMENTS.map(x=>`<div class="achievement ${records.achievements.includes(x.id)?'earned':''}"><span>${records.achievements.includes(x.id)?'✧':'◇'}</span><div><strong>${escapeHtml(x.label)}</strong><small>${escapeHtml(x.desc)}</small></div></div>`).join('');
 showModal({kicker:'ARCHIVO DEL SUPERVIVIENTE',title:'Estadísticas y logros',content:`<div class="records-grid"><div><strong>${records.games}</strong><span>PARTIDAS</span></div><div><strong>${records.wins}</strong><span>VICTORIAS</span></div><div><strong>${records.bestScore}</strong><span>MEJOR PUNTUACIÓN</span></div><div><strong>${records.bestTurn}</strong><span>RÉCORD INFINITO</span></div></div><h3>Insignias</h3><div class="achievements">${a}</div><p class="modal-callout">Las estadísticas se almacenan solo en este navegador. No existe clasificación en línea.</p>`,actions:[{label:'CONTINUAR',primary:true}]})}
function startNew(n,options){const cfg=options||{survivor:game.survivor,difficulty:game.difficulty,mode:game.mode};game=E.createGame(n,undefined,cfg);attackMode=null;previousRevealed=[];previousCard='';persist();render();chapterIntro()}

function statusMessage(){if(game.ended)return game.won?'Sobreviviste a la noche.':'La cabaña te reclama.';
 if(game.pendingChoice)return 'Un encuentro exige una decisión. Elige una de las dos opciones para continuar.';
 if(attackMode)return`Modo ${attackMode==='axe'?'hacha':'escopeta'}: selecciona una loseta roja con enemigo o pulsa el mismo botón para cancelar.`;
 if(game.ap===0)return'Sin puntos de acción. Termina tu turno.';
 const foes=game.enemies.filter(e=>e.pos===game.pos);if(foes.length)return`PELIGRO: ${foes.length} enemigo(s) en la misma habitación. No puedes buscar, investigar o sellar.`;
 if(game.objectiveSpots.includes(game.pos)&&!game.objectiveDone.includes(game.pos))return'Hay una pista ◇ en esta sala: pulsa INVESTIGAR.';
 if(game.sealSpots.includes(game.pos)&&!game.sealed.includes(game.pos))return'Una grieta palpita bajo tus pies. Puedes sellarla ahora.';
 return 'Toca una habitación ortogonal contigua para explorar o desplazarte (1 PA).'}

function tileMarkup(i){const known=game.revealed.includes(i),adj=E.neighbors(game.pos).includes(i),here=i===game.pos,foes=known?game.enemies.filter(e=>e.pos===i):[];const rift=known&&game.sealSpots.includes(i),closed=game.sealed.includes(i),attackable=!!attackMode&&foes.length>0&&(attackMode==='axe'?E.dist(game.pos,i)<=1:E.hasShot(game,i))&&(attackMode!=='shotgun'||game.ammo>0),canMove=adj&&game.ap>0&&!game.ended&&!attackMode;const label=known?E.ROOM_NAMES[i]:'Desconocida';const clue=known&&game.objectiveSpots.includes(i)&&!game.objectiveDone.includes(i);const classes=['tile',known?'revealed':'unseen',here?'here':'',canMove?'reachable':'',attackable?'attackable':'',rift&&!closed?'seal-room':'',game.cursed.includes(i)?'cursed':'',game.barricades.includes(i)?'barricaded':'',known&&!previousRevealed.includes(i)?'just-revealed':''].filter(Boolean).join(' ');let tokens=[];if(here)tokens.push(`<span class="token hero" aria-hidden="true">${A.miniature('hero')}</span>`);for(const enemy of foes.slice(0,2)){tokens.push(`<span class="token enemy${enemy.type==='boss'?' boss':''}" aria-hidden="true">${A.miniature(enemy.type)}</span>`)}let title=`${label}, casilla ${format(i+1)}${here?', superviviente':''}${foes.length?`, ${foes.map(x=>E.ENEMY_TYPES[x.type].label).join(', ')}`:''}${rift?closed?', grieta sellada':', grieta activa':''}`;return `<button class="${classes}" data-pos="${i}" type="button" ${!canMove&&!attackable?'disabled':''} aria-label="${escapeHtml(title)}" title="${escapeHtml(title)}">${A.roomArt(i,known)}<span class="coord">${format(i+1)}</span>${known?`<span class="room-label">${escapeHtml(label)}</span>`:'<span class="unknown-mark" aria-hidden="true">?</span>'}${rift?`<span class="rift-symbol${closed?' closed':''}" aria-hidden="true">${closed?'✧':'✥'}</span>`:''}${clue?'<span class="clue-symbol" aria-hidden="true">◇</span>':''}${game.barricades.includes(i)?'<span class="barricade-symbol" aria-hidden="true">▤</span>':''}<span class="token-row">${tokens.join('')}${foes.length>2?`<small>+${foes.length-2}</small>`:''}</span></button>`}
function renderBoard(){let b=$('board');b.innerHTML=Array.from({length:25},(_,i)=>tileMarkup(i)).join('');previousRevealed=game.revealed.slice()}
function renderRoomScene(){const i=game.pos,here=game.enemies.filter(e=>e.pos===i),cursed=game.cursed.includes(i),rift=game.sealSpots.includes(i)&&!game.sealed.includes(i);
 const scene=$('roomSceneArt');if(!scene)return;scene.innerHTML=A.roomArt(i,true)+(here.length?`<div class="scene-creature">${A.miniature(here[0].type)}</div>`:'');
 $('roomSceneName').textContent=E.ROOM_NAMES[i].toUpperCase();$('roomSceneTag').textContent=`SALA ${format(i+1)} / 25`;
 $('roomSceneDetails').textContent=here.length?`${here.length} criatura${here.length>1?'s':''} en la sala. Elige tus acciones con cuidado.`:rift?'Una grieta inquietante distorsiona esta habitación.':cursed?'La estancia maldita debilita tu cordura.':'Escucha el suelo y observa cada rincón antes de avanzar.';
 scene.classList.toggle('threat',here.length>0);scene.classList.toggle('haunted',cursed||rift)}

function renderVitals(){const c=E.currentChapter(game),limit=E.doomLimit(game),hero=E.SURVIVORS[game.survivor];
 $('chapterNumber').textContent=game.mode==='endless'?'∞ / ∞':`${format(game.chapter)} / 08`;
 $('chapterTitle').textContent=game.mode==='endless'?'La noche interminable':c.name;$('chapterSubtitle').textContent=game.mode==='endless'?'SOBREVIVE · PUNTÚA · ESCAPA':c.subtitle;
 $('turnDisplay').textContent=`TURNO ${format(game.turn)}`;$('hpText').textContent=`${format(game.hp)} / 12`;$('sanityText').textContent=`${format(game.sanity)} / 10`;$('doomText').textContent=`${format(game.doom)} / ${limit}`;
 $('hpBar').style.width=`${Math.max(0,game.hp/12*100)}%`;$('sanityBar').style.width=`${Math.max(0,game.sanity/10*100)}%`;$('doomBar').style.width=`${Math.min(100,game.doom/limit*100)}%`;
 if(S.setTension)S.setTension(game.doom/Math.max(1,limit));
 $('apText').textContent=`${game.ap} / 3`;$('actionPoints').innerHTML=Array.from({length:3},(_,i)=>`<i class="ap-pip ${i<game.ap?'active':''}"></i>`).join('');
 $('medkitCount').textContent=`× ${game.medkits}`;$('wardCount').textContent=`× ${game.wards}`;$('ammoCount').textContent=`× ${game.ammo}`;$('flareCount').textContent=`× ${game.flares}`;$('scrapCount').textContent=String(game.scrap);
 $('deckCount').textContent=`${game.deck.length} CARTAS`;$('characterPortrait').innerHTML=A.portraitArt(game.survivor);$('characterName').textContent=hero.name.toUpperCase();$('characterRole').textContent=hero.role.toUpperCase();$('characterTag').textContent=`${hero.role.toUpperCase()} · ${E.DIFFICULTIES[game.difficulty].name.toUpperCase()}`;
 $('abilityName').textContent=hero.ability;$('abilityHelp').textContent=hero.description;$('scoreValue').textContent=game.score.toLocaleString('es-ES')}

function renderActions(){const can=game.ap>0&&!game.ended&&!game.pendingChoice,foesHere=game.enemies.some(e=>e.pos===game.pos),axeTargets=game.enemies.some(e=>E.dist(game.pos,e.pos)<=1),shotTargets=game.enemies.some(e=>E.hasShot(game,e.pos));
 $('axeBtn').disabled=!can||!axeTargets;$('shotBtn').disabled=!can||game.ammo<1||!shotTargets;
 $('axeBtn').classList.toggle('selected',attackMode==='axe');$('shotBtn').classList.toggle('selected',attackMode==='shotgun');$('axeBtn').setAttribute('aria-pressed',String(attackMode==='axe'));$('shotBtn').setAttribute('aria-pressed',String(attackMode==='shotgun'));
 $('searchBtn').disabled=!can||game.searched.includes(game.pos)||foesHere;
 $('restBtn').disabled=!can||game.sanity>=10;$('sealBtn').disabled=!can||!game.sealSpots.includes(game.pos)||game.sealed.includes(game.pos)||foesHere;
 $('investigateBtn').disabled=!can||!game.objectiveSpots.includes(game.pos)||game.objectiveDone.includes(game.pos)||foesHere;
 $('abilityBtn').disabled=!can||game.abilityTurn===game.turn||(game.survivor==='medic'&&game.hp>=12)||(game.survivor==='occultist'&&game.sanity>=10&&game.doom===0);
 $('escapeBtn').disabled=game.ended||!!game.pendingChoice||game.pos!==E.ENTRANCE||!E.objectivesComplete(game);
 $('medkitBtn').disabled=!can||game.medkits===0||game.hp>=12;$('wardBtn').disabled=!can||game.wards===0||(game.sanity===10&&game.doom===0);
 $('flareBtn').disabled=!can||game.flares===0;$('barricadeBtn').disabled=!can||game.scrap===0||game.barricades.includes(game.pos)||foesHere;
 $('endBtn').disabled=game.ended||!!game.pendingChoice;$('actionHint').textContent=statusMessage();$('roomInfo').textContent=`${E.ROOM_NAMES[game.pos]} · ${statusMessage()}`;document.body.classList.toggle('mode-attack',!!attackMode)}

function renderDie(){let r=game.lastRoll;if(!r){$('dieDisplay').classList.add('hidden');return}$('dieDisplay').classList.remove('hidden');$('dieFace').textContent=['','⚀','⚁','⚂','⚃','⚄','⚅'][r.value]||r.value;$('dieCaption').textContent=`${r.weapon==='axe'?'Hacha':'Escopeta'} · dado ${r.value} · ${r.hit?`${r.damage} daño${r.crit?' ¡CRÍTICO!':''}`:'FALLO'}`}
function renderCard(){const c=game.lastEvent;if(!c){$('eventArt').innerHTML=A.eventArt('moon');$('eventTitle').textContent='La casa espera';$('eventDescription').textContent='Al terminar turno revelas una carta. Nunca sabes quién escucha.';$('eventCode').textContent='I · 00';return}if(previousCard!==c.id){$('eventCard').classList.remove('just-drawn');void $('eventCard').offsetWidth;$('eventCard').classList.add('just-drawn');previousCard=c.id}$('eventArt').innerHTML=A.eventArt(c.art);$('eventTitle').textContent=c.name;$('eventDescription').textContent=c.flavor;$('eventCode').textContent=`${format(game.discard.length)} · ${format(game.turn)}`}
function renderObjectives(){const c=E.currentChapter(game),o=E.currentObjective(game),closed=game.mode==='endless'?false:game.seals===c.seals;
 $('missionText').textContent=game.mode==='endless'?'Aguanta tantos turnos como puedas. Cada grieta cerrada retrasa a la oscuridad. Puedes evacuar en la Entrada a partir del turno 12.':c.description;
 const progress=game.mode==='endless'?game.totalSeals+' (activas: '+game.seals+'/'+game.sealSpots.length+')':game.seals+'/'+c.seals;
 let objectives=game.mode==='endless'?[{done:false,text:`Grietas selladas: ${progress}`},{done:game.turn>=12,text:`Sobrevivir al turno 12: ${game.turn}/12`},{done:game.turn>=12&&game.pos===E.ENTRANCE,text:'Volver a Entrada para evacuar, o seguir arriesgándote'}]:
 [{done:closed,text:`Sellar grietas: ${progress}`},{done:game.objectiveCount>=o.target,text:`${o.name}: ${game.objectiveCount} / ${o.target}`},{done:closed&&game.objectiveCount>=o.target&&game.pos===E.ENTRANCE,text:'Regresar a la Entrada (casilla 23)'},{done:game.won,text:'Escapar con vida de la cabaña'}];
 $('objectives').innerHTML=objectives.map(x=>`<div class="objective${x.done?' done':''}"><span class="objective-check">${x.done?'✓':'·'}</span><span>${escapeHtml(x.text)}</span></div>`).join('')}

function renderHistory(){$('history').innerHTML=game.log.slice(0,14).map(e=>`<div class="entry ${escapeHtml(e.kind||'narration')}"><time>TURNO ${format(e.turn)}</time><p>${escapeHtml(e.text)}</p></div>`).join('')}
function render(){if(!E.validate(game)){showToast('Error: estado de partida inválido.');return}renderBoard();renderRoomScene();renderVitals();renderActions();renderDie();renderCard();renderObjectives();renderHistory()}
function maybeEncounter(){if(!game.pendingChoice||game.ended)return;const scene=E.ALL_ENCOUNTERS.find(x=>x.id===game.pendingChoice);if(!scene)return;
 showModal({kicker:'ENCUENTRO · DECISIÓN IRREVERSIBLE',title:scene.name,lock:true,content:`<p class="modal-callout">${escapeHtml(scene.text)}</p><p>Tu elección modificará los recursos o los peligros de esta partida.</p>`,
 actions:scene.options.map((x,i)=>({label:x.label+' · '+x.description,primary:i===0,run:()=>act({type:'CHOOSE',option:i})}))})}
function afterAction(type,before){persist();render();const result=game.lastRoll;
 switch(type){case 'ATTACK':S.effect(result&&result.hit?'hit':'roll');break;case 'MOVE':S.effect(game.revealed.length>before.revealed?'explore':'move');break;
 case 'END_TURN':S.effect('event');break;case 'SEAL':S.effect('seal');break;case 'SEARCH':case 'INVESTIGATE':case 'ABILITY':case 'HEAL':case 'WARD':case 'FLARE':S.effect('loot');break;}
 if(game.ended&&!before.ended){if(game.won&&game.mode==='campaign'){unlocked=Math.max(unlocked,Math.min(8,game.chapter+1));setStorage(PROGRESS,String(unlocked));S.effect('victory')}
 else S.effect('defeat');registerEnd();showEnding()}
 else if(game.pendingChoice)maybeEncounter()}
function act(action){const before={revealed:game.revealed.length,ended:game.ended},done=E.dispatch(game,action);
 if(!done){showToast('Acción no disponible en este momento.');return false}attackMode=null;afterAction(action.type,before);return true}

function boardClick(e){const tile=e.target.closest('[data-pos]');if(!tile)return;const i=Number(tile.dataset.pos);if(attackMode){const target=game.enemies.find(x=>x.pos===i);if(target){act({type:'ATTACK',id:target.id,weapon:attackMode})}return}act({type:'MOVE',to:i})}
function setMode(mode){if(game.ended||game.pendingChoice||game.ap===0)return;attackMode=attackMode===mode?null:mode;renderBoard();renderActions();if(attackMode)showToast('Selecciona la loseta roja del enemigo para atacar.')}
function showEnding(){const win=game.won,c=E.currentChapter(game),isEndless=game.mode==='endless';
 let content=`<div class="game-over-mark ${win?'win':''}">${win?'✧':'✥'}</div><p class="modal-callout">${escapeHtml(game.lastAction)}</p>
 <p>Turnos: <b>${game.turn}</b> · Grietas: <b>${game.totalSeals}</b> · Enemigos derrotados: <b>${game.kills}</b> · Decisiones: <b>${game.encounterChoices.length}</b></p>
 <p class="final-score">PUNTUACIÓN FINAL: <b>${game.score.toLocaleString('es-ES')}</b></p>
 ${win&&!isEndless&&game.chapter<8?'<p>Se ha desbloqueado el siguiente capítulo.</p>':''}${win&&!isEndless&&game.chapter===8?'<p>Has completado los ocho expedientes. El archivo sigue abierto para nuevas dificultades y personajes.</p>':''}`;
 let actions=[];if(win&&!isEndless&&game.chapter<8)actions.push({label:'SIGUIENTE CAPÍTULO',primary:true,run:()=>startNew(game.chapter+1,{survivor:game.survivor,difficulty:game.difficulty,mode:'campaign'})});
 actions.push({label:'REINTENTAR',run:()=>startNew(game.chapter,{survivor:game.survivor,difficulty:game.difficulty,mode:game.mode})});actions.push({label:'ARCHIVO DE LOGROS',run:showRecords});actions.push({label:'CAMPAÑA',run:showCampaign});
 showModal({kicker:win?'HAS ESCAPADO · POR AHORA':'EL FINAL DE TU HISTORIA',title:win?'Sobreviviste a la noche':'La casa ha ganado',content,actions})}

function confirmNew(){showModal({kicker:'LA CABAÑA OLVIDA',title:'¿Reiniciar el capítulo?',content:'<p>Se perderá el progreso de esta partida al comenzar una nueva. Los capítulos desbloqueados no se borrarán.</p>',actions:[{label:'SÍ, REINICIAR',primary:true,run:()=>startNew(game.chapter)},{label:'CANCELAR'}]})}
function init(){let storedProgress=parseInt(getStorage(PROGRESS)||'1',10);unlocked=Number.isInteger(storedProgress)?Math.max(1,Math.min(8,storedProgress)):1;
 try{const found=JSON.parse(getStorage(RECORDS));if(found&&typeof found==='object'&&Array.isArray(found.achievements)&&Number.isInteger(found.games)&&Number.isInteger(found.wins))records={games:found.games,wins:found.wins,bestScore:found.bestScore||0,bestTurn:found.bestTurn||0,achievements:found.achievements.filter(x=>E.ACHIEVEMENTS.some(a=>a.id===x))}}catch{}
 const loaded=loadSaved();if(!loaded)game=E.createGame(1);if(game.mode==='campaign'){
 if(game.ended&&game.won)unlocked=Math.max(unlocked,Math.min(8,game.chapter+1));else unlocked=Math.max(unlocked,game.chapter)}
 setStorage(PROGRESS,String(unlocked));render();$('board').addEventListener('click',boardClick);
 $('axeBtn').onclick=()=>setMode('axe');$('shotBtn').onclick=()=>setMode('shotgun');
 [['searchBtn','SEARCH'],['restBtn','REST'],['sealBtn','SEAL'],['escapeBtn','ESCAPE'],['medkitBtn','HEAL'],['wardBtn','WARD'],['flareBtn','FLARE'],['barricadeBtn','BARRICADE'],['investigateBtn','INVESTIGATE'],['abilityBtn','ABILITY'],['endBtn','END_TURN']].forEach(([id,type])=>$(id).addEventListener('click',()=>act({type})));
 $('guideBtn').onclick=showRules;$('campaignBtn').onclick=showCampaign;$('endlessBtn').onclick=()=>showSetup(1,'endless');$('recordsBtn').onclick=showRecords;
 $('saveBtn').onclick=()=>showToast(persist()?'Partida guardada.':'No se ha podido guardar en este navegador.');
 $('loadBtn').onclick=()=>{let loaded=loadSaved();if(loaded){attackMode=null;previousRevealed=[];previousCard='';render();if(game.pendingChoice)maybeEncounter();else showToast('Partida restaurada.')}else showToast('No hay una partida guardada válida.')};
 $('newBtn').onclick=confirmNew;$('modalClose').onclick=closeModal;$('modal').addEventListener('click',ev=>{if(ev.target===$('modal'))closeModal()});
 $('soundBtn').onclick=()=>{if(S.enabled){S.stop();$('soundBtn').innerHTML='♫ <span>SONIDO OFF</span>';showToast('Sonido desactivado.')}else if(S.start()){$('soundBtn').innerHTML='♫ <span>SONIDO ON</span>';S.effect('explore');showToast('Sonido activado.')}else showToast('Este navegador no permite activar el sonido.');$('soundBtn').setAttribute('aria-pressed',String(S.enabled))};
 document.addEventListener('keydown',onKeyDown);
 if(game.pendingChoice)maybeEncounter();else if(!loaded)chapterIntro();else if(game.ended){registerEnd();showEnding()}else if(loaded==='legacy'||loaded==='v3')showToast('Partida antigua migrada a 1.0.');
 globalThis.__deadCabin={get state(){return game},get unlocked(){return unlocked},get records(){return records},act,showCampaign,showRules,showRecords,showSetup,startNew}}

function onKeyDown(e){if(e.key==='Tab'&&!$('modal').classList.contains('hidden')){const items=Array.from($('modal').querySelectorAll('button:not(:disabled):not([hidden]),select,textarea,input')).filter(x=>x.getClientRects().length>0);if(items.length){const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}return}if(e.key==='Escape'){if(!$('modal').classList.contains('hidden'))closeModal();else if(attackMode){attackMode=null;renderBoard();renderActions()}return}if(!$('modal').classList.contains('hidden')||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;let shifts={ArrowUp:-5,w:-5,W:-5,ArrowDown:5,s:5,S:5,ArrowLeft:-1,a:-1,A:-1,ArrowRight:1,d:1,D:1};if(e.key in shifts){e.preventDefault();const n=game.pos+shifts[e.key];if(E.neighbors(game.pos).includes(n))act({type:'MOVE',to:n});return}let commands={e:'END_TURN',E:'END_TURN','1':'SEARCH','2':'REST','3':'SEAL','4':'HEAL'};if(commands[e.key]){e.preventDefault();act({type:commands[e.key]})}}
init();
})();
