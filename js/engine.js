/* DEAD CABIN 404 · Motor determinista y comprobable · v1.0
   Sin acceso al DOM: la interfaz solo llama a dispatch(estado, acción). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DeadCabinEngine=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SIZE=5, ENTRANCE=22, MAX_HP=12, MAX_SANITY=10, VERSION=4;
const CHAPTERS=[
 {id:1,name:'El libro que respira',subtitle:'La llegada',description:'Encuentra las grietas y vuelve a la entrada. El bosque no permite marcharse.',seals:3,limit:26,pressure:'normal',epilogue:'Una voz te llama por tu nombre desde el interior del libro.'},
 {id:2,name:'La tormenta negra',subtitle:'Lluvia sobre el tejado',description:'Una tormenta antinatural oscurece la casa. Cada tres turnos, el cielo se cierra.',seals:3,limit:28,pressure:'storm',epilogue:'La lluvia escribe una advertencia en el barro: NO BAJES.'},
 {id:3,name:'Los que arañan',subtitle:'El bosque se acerca',description:'Los acechadores han aprendido a seguir tus pasos. Cuidado con las habitaciones abiertas.',seals:3,limit:29,pressure:'hunters',epilogue:'Bajo las uñas de los muertos descubres tierra recién removida.'},
 {id:4,name:'El guardián del sótano',subtitle:'Primer enfrentamiento',description:'Sellar las grietas despertará al Guardián. Derrótalo antes de huir.',seals:3,limit:31,pressure:'boss',epilogue:'El guardián cae. Su sombra señala un pasillo que no existía.'},
 {id:5,name:'La casa imposible',subtitle:'Habitaciones enfermas',description:'La geometría está contaminada. Una habitación revelada se corrompe periódicamente.',seals:3,limit:31,pressure:'shifting',epilogue:'La arquitectura tiembla, como si algo enorme respirase bajo las tablas.'},
 {id:6,name:'El eco del silencio',subtitle:'Sin refugio',description:'El silencio roba tus fuerzas: descansar cuesta más riesgo y no siempre ayuda.',seals:3,limit:32,pressure:'silence',epilogue:'Cuando todo calla, por primera vez consigues oír el corazón de la casa.'},
 {id:7,name:'Cuatro nombres',subtitle:'El círculo incompleto',description:'El ritual exige cuatro cierres. Las voces intentarán convencerte de abandonar.',seals:4,limit:34,pressure:'ritual',epilogue:'Al cerrar el último símbolo, una puerta roja se abre en el aire.'},
 {id:8,name:'El corazón de la cabaña',subtitle:'La última noche',description:'Rompe los sellos, derrota al Corazón y alcanza la salida antes del amanecer.',seals:4,limit:38,pressure:'final',epilogue:'El alba llega por fin. Bajo las cenizas queda una sola página en blanco.'}
];
const ROOM_NAMES=['Desván vacío','Habitación tapiada','Archivo húmedo','Dormitorio rojo','Vivero muerto','Lavadero','Pasillo norte','Biblioteca','Comedor','Oratorio','Cocina','Sala de espejos','Salón central','Baño agrietado','Almacén','Cuarto de radio','Corredor oscuro','Sótano sellado','Dormitorio infantil','Despensa','Cobertizo interior','Galería','Entrada','Sala de calderas','Cripta doméstica'];
const ROOM_TYPES=['attic','bedroom','library','bedroom','garden','bath','hall','library','dining','altar','kitchen','mirror','lounge','bath','storage','radio','hall','cellar','bedroom','storage','shed','hall','entrance','cellar','altar'];
const ENEMY_TYPES={
 possessed:{label:'Poseído',symbol:'☠',hp:2,steps:1,damage:1,hit:4,description:'Avanza una sala y causa 1 herida.'},
 stalker:{label:'Acechador',symbol:'✣',hp:2,steps:2,damage:1,hit:4,description:'Puede avanzar dos salas por turno.'},
 brute:{label:'Abominación',symbol:'♱',hp:4,steps:1,damage:2,hit:4,description:'Resiste cuatro heridas y golpea con fuerza.'},
 boss:{label:'El Guardián',symbol:'◆',hp:8,steps:1,damage:2,hit:3,description:'Jefe de ocho vidas: carga más deprisa al 50 % de salud y ejecuta un barrido de alcance 1 cada tercer turno. Después del ritual queda expuesto.'},
 wraith:{label:'Espectro',symbol:'◈',hp:3,steps:1,damage:0,hit:4,mind:2,description:'Atraviesa cualquier pared y roba cordura.'},
 leech:{label:'Parásito',symbol:'✺',hp:1,steps:1,damage:1,hit:5,doom:2,description:'Parásito: ataque débil, pero acelera la oscuridad.'},
 heart:{label:'Corazón de la casa',symbol:'♥',hp:9,steps:1,damage:1,hit:4,mind:1,description:'Jefe de nueve vidas: cada tercer turno emite una onda de cordura y oscuridad; su radio aumenta al 50 % de salud. Queda expuesto tras el pulso.'}
};
const CARDS=[
 {id:'steps',name:'Pasos sobre el techo',flavor:'Algo arrastra muebles donde no existe un piso superior.',type:'spawn',value:1,art:'claw'},
 {id:'cold',name:'Frío imposible',flavor:'Tu aliento forma una palabra que no recuerdas.',type:'sanity',value:-1,art:'eye'},
 {id:'whisper',name:'La voz del pozo',flavor:'Te promete una salida a cambio de un recuerdo.',type:'sanity',value:-2,art:'mouth'},
 {id:'lantern',name:'Luz entre las tablas',flavor:'Un destello revela por dónde escapar.',type:'hope',value:2,art:'lantern'},
 {id:'medicine',name:'Maletín olvidado',flavor:'Un botiquín cubierto de polvo aún conserva suministros.',type:'medkit',value:1,art:'cross'},
 {id:'shells',name:'Cartuchos húmedos',flavor:'El metal está frío, pero la pólvora parece seca.',type:'ammo',value:2,art:'shell'},
 {id:'roots',name:'Raíces en las paredes',flavor:'La casa se alimenta del bosque. El bosque se alimenta de ti.',type:'doom',value:2,art:'roots'},
 {id:'nails',name:'Uñas contra el cristal',flavor:'La ventana se empaña desde el otro lado.',type:'spawn',value:1,art:'claw'},
 {id:'prayer',name:'Una oración incompleta',flavor:'Las palabras te sostienen durante un segundo.',type:'sanity',value:1,art:'sigil'},
 {id:'pulse',name:'El pulso de la casa',flavor:'Las vigas laten bajo tus pies.',type:'doom',value:1,art:'heart'},
 {id:'mirror',name:'Tu reflejo sonríe',flavor:'No has movido los labios.',type:'sanity',value:-1,art:'eye'},
 {id:'ward',name:'Sal y ceniza',flavor:'Un círculo improvisado mantiene a raya el murmullo.',type:'ward',value:1,art:'sigil'},
 {id:'blood',name:'Sangre bajo la puerta',flavor:'Un hilo oscuro llega hasta tus botas.',type:'damage',value:1,art:'blood'},
 {id:'silence',name:'Silencio repentino',flavor:'Por primera vez en horas, las voces desaparecen.',type:'hope',value:1,art:'moon'},
 {id:'hunger',name:'Hambre en el sótano',flavor:'La trampilla vibra al ritmo de una respiración.',type:'spawn',value:1,art:'mouth'},
 {id:'candle',name:'La última vela',flavor:'Una llama diminuta desafía a la noche.',type:'doom',value:-1,art:'lantern'},
 {id:'harvest',name:'La cosecha del bosque',flavor:'Los muertos se levantan entre las raíces.',type:'spawn',value:2,art:'roots'},
 {id:'fever',name:'Fiebre de ceniza',flavor:'Durante un instante no reconoces tus propias manos.',type:'damage',value:1,art:'hand'},
 {id:'broken',name:'El reloj sin agujas',flavor:'Las horas se han enroscado sobre sí mismas.',type:'doom',value:1,art:'moon'},
 {id:'archive',name:'El cajón sellado',flavor:'Alguien dejó provisiones a quien viniera después.',type:'flare',value:1,art:'lantern'},
 {id:'breath',name:'Aliento en la nuca',flavor:'No puedes saber qué respiraba detrás de ti.',type:'spawn',value:1,art:'eye'},
 {id:'bone',name:'Un hueso bajo el suelo',flavor:'El hueso lleva una fecha de mañana.',type:'scrap',value:1,art:'hand'},
 {id:'doubt',name:'Memoria ajena',flavor:'Recuerdas haber vivido aquí durante años.',type:'sanity',value:-1,art:'mouth'},
 {id:'embers',name:'Últimas ascuas',flavor:'Las brasas revelan un mapa incompleto.',type:'hope',value:1,art:'lantern'}
];
const SURVIVORS={
 scout:{name:'Alex Morrow',role:'Explorador',ability:'RECONOCER',description:'Revela las habitaciones adyacentes (1 PA, una vez por turno).',hp:12,sanity:9,ammo:5,medkits:1,wards:1,flares:1},
 medic:{name:'Mara Soler',role:'Sanitaria',ability:'PRIMEROS AUXILIOS',description:'Recupera 2 de salud sin gastar botiquín (1 PA, una vez por turno).',hp:12,sanity:9,ammo:3,medkits:2,wards:1,flares:1},
 occultist:{name:'Noa Vilar',role:'Ocultista',ability:'EXORCISMO',description:'Reduce oscuridad en 1 y recupera 1 cordura (1 PA, una vez por turno).',hp:10,sanity:10,ammo:4,medkits:1,wards:2,flares:1}
};
const DIFFICULTIES={story:{name:'Historia',description:'Más recursos, oscuridad más lenta.',doomBonus:-4,hitShift:1},normal:{name:'Supervivencia',description:'La experiencia de referencia.',doomBonus:0,hitShift:0},nightmare:{name:'Pesadilla',description:'Oscuridad acelerada y enemigos más precisos.',doomBonus:-3,hitShift:-1}};
const SIDE_OBJECTIVES={1:{name:'Las páginas perdidas',description:'Recupera una página del libro.',target:1,type:'relic'},2:{name:'Aguantar la tormenta',description:'Repara dos pararrayos rituales.',target:2,type:'repair'},3:{name:'Cazar a los cazadores',description:'Elimina tres acechadores.',target:3,type:'hunt'},4:{name:'El guardián',description:'Derrota al Guardián cuando despierte.',target:1,type:'boss'},5:{name:'Geometría impura',description:'Purifica dos estancias malditas.',target:2,type:'purify'},6:{name:'Mensajes del exterior',description:'Recupera tres fragmentos de radio.',target:3,type:'radio'},7:{name:'Los testigos',description:'Recoge dos reliquias del ritual.',target:2,type:'relic'},8:{name:'El corazón de madera',description:'Destruye el Corazón de la cabaña.',target:1,type:'boss'}};
const ENCOUNTERS=[
 {id:'telephone',name:'El teléfono desconectado',text:'El auricular suena sin cables. Una voz afirma conocer el camino hacia tu infancia.',options:[{label:'ESCUCHAR LA VOZ',effect:'insight',description:'Revelar rutas; perder cordura.'},{label:'ARRANCAR EL CABLE',effect:'supply',description:'Rescatar suministros.'}]},
 {id:'mirror',name:'El espejo velado',text:'Tu reflejo está herido, aunque todavía no te ha ocurrido nada.',options:[{label:'INTERCAMBIAR MIRADAS',effect:'heal',description:'Curar heridas; atraer al mal.'},{label:'ROMPER EL CRISTAL',effect:'ward',description:'Encontrar protección; hacer ruido.'}]},
 {id:'child',name:'La canción del pasillo',text:'Detrás de una puerta, alguien canta una melodía que tu familia conocía.',options:[{label:'SEGUIR LA CANCIÓN',effect:'secret',description:'Recordar algo útil a cambio de oscuridad.'},{label:'GUARDAR SILENCIO',effect:'sanity',description:'Proteger tu mente.'}]},
 {id:'trapdoor',name:'La trampilla tibia',text:'La madera late como si debajo hubiera un corazón diminuto.',options:[{label:'ABRIR LA TRAMPILLA',effect:'stash',description:'Buscar un botiquín; exponerte a un enemigo.'},{label:'SELLARLA CON CENIZA',effect:'cleanse',description:'Retrasar el avance del mal.'}]},
 {id:'visitor',name:'Alguien pide entrar',text:'Una figura empapada golpea la puerta. Tiene tu misma voz.',options:[{label:'DEJARLE UN MENSAJE',effect:'insight',description:'Descubrir una sala a coste de cordura.'},{label:'NO ABRIR',effect:'barricade',description:'Fortificar esta habitación.'}]},
 {id:'book',name:'Margen escrito a mano',text:'Una nota entre páginas dice: «No todo lo que parece vivo puede morir».',options:[{label:'COPIAR EL SIGILO',effect:'ward',description:'Obtener un talismán.'},{label:'QUEMAR LA PÁGINA',effect:'cleanse',description:'Retirar oscuridad; perder un recuerdo.'}]},
 {id:'stairs',name:'Escalones hacia abajo',text:'Una escalera desciende en espiral a una profundidad imposible.',options:[{label:'BAJAR TRES PELDAÑOS',effect:'stash',description:'Recoger botín; atraer una presencia.'},{label:'RETROCEDER',effect:'sanity',description:'Recuperar claridad.'}]},
 {id:'ashes',name:'El círculo de ceniza',text:'Un anillo gris rodea un nombre casi borrado. Lo has visto escrito en tu piel.',options:[{label:'COMPLETAR EL CÍRCULO',effect:'cleanse',description:'Reducir el peligro.'},{label:'RECOGER LAS ASCUAS',effect:'supply',description:'Obtener materiales.'}]}
];
const STORY_BEATS={
 1:[
 {name:'La primera página',text:'En el borde de la grieta hay una fotografía tuya, fechada cuarenta años antes de tu nacimiento.',options:[{label:'GUARDAR LA FOTOGRAFÍA',effect:'secret',description:'Preservas una pista, pero el tiempo se retuerce.'},{label:'ARRANCARLA DEL SUELO',effect:'cleanse',description:'Rompes parte del hechizo.'}]},
 {name:'La firma imposible',text:'La página que has recuperado termina con una firma: la tuya. La tinta todavía está húmeda.',options:[{label:'LEER EN VOZ ALTA',effect:'insight',description:'Una visión te guía y te hiere.'},{label:'CERRAR EL LIBRO',effect:'sanity',description:'Contienes el pánico.'}]}],
 2:[
 {name:'Las nubes sin cielo',text:'Tras el primer cierre, descubres que la lluvia cae desde el interior del tejado, no desde fuera.',options:[{label:'SEGUIR LAS GOTERAS',effect:'stash',description:'Encuentras recursos y atraes una presencia.'},{label:'APAGAR LOS FUSIBLES',effect:'cleanse',description:'La tormenta cede por unos instantes.'}]},
 {name:'El relámpago inmóvil',text:'Al reparar los pararrayos, un relámpago permanece congelado frente a la ventana.',options:[{label:'TOCAR EL CRISTAL',effect:'insight',description:'Vislumbras el siguiente camino.'},{label:'PROTEGER EL CABLE',effect:'ward',description:'Conservas una protección, pero cae la noche.'}]}],
 3:[
 {name:'El rastro humano',text:'Debajo de las garras del primer sello alguien ha escrito tres nombres que todavía respiran.',options:[{label:'MEMORIZAR LOS NOMBRES',effect:'sanity',description:'Te aferras al recuerdo.'},{label:'BORRARLOS CON CENIZA',effect:'cleanse',description:'La casa pierde fuerza.'}]},
 {name:'Los que quedan afuera',text:'Cuando el último cazador cae, la radio anuncia que todos los habitantes del pueblo te están buscando.',options:[{label:'ENCENDER LA RADIO',effect:'secret',description:'Un mensaje útil llega cargado de oscuridad.'},{label:'APAGAR LA SEÑAL',effect:'supply',description:'Recuperas material y munición.'}]}],
 4:[
 {name:'La llave del guardián',text:'La primera grieta tiene forma de cerradura. En ella gira una llave hecha de hueso.',options:[{label:'RECOGER LA LLAVE',effect:'ward',description:'Adquieres defensa; algo despierta.'},{label:'DEJARLA GIRAR',effect:'sanity',description:'Resistes la tentación.'}]},
 {name:'El hombre de la máscara',text:'Bajo el rostro del guardián hay una fotografía de los antiguos dueños de la cabaña.',options:[{label:'GUARDAR LA IMAGEN',effect:'supply',description:'Rescatas provisiones olvidadas.'},{label:'ARROJARLA AL FUEGO',effect:'cleanse',description:'Apagas parte de la oscuridad.'}]}],
 5:[
 {name:'La quinta esquina',text:'Los planos de la casa muestran una habitación con cinco esquinas. Estás pisando la que falta.',options:[{label:'MEDIR LA HABITACIÓN',effect:'insight',description:'Descubres una estancia, sacrificando claridad.'},{label:'TAPAR LOS PLANOS',effect:'sanity',description:'Recuperas equilibrio.'}]},
 {name:'Arquitectura de carne',text:'Después de purificar la segunda habitación, un pasillo recupera su forma, pero dentro late algo que era humano.',options:[{label:'ESTABILIZAR LOS MUROS',effect:'cleanse',description:'Alejas al mal.'},{label:'BUSCAR BAJO EL SUELO',effect:'stash',description:'Rescatas equipo y despiertas una presencia.'}]}],
 6:[
 {name:'La frecuencia vacía',text:'En la primera grieta escuchas la voz de alguien que transmite desde el año siguiente.',options:[{label:'RESPONDER A LA VOZ',effect:'secret',description:'Descubres algo, a un precio.'},{label:'CORTAR LA FRECUENCIA',effect:'ward',description:'Preparas un talismán.'}]},
 {name:'Última transmisión',text:'Los tres fragmentos forman un mensaje: «No salgas por donde has entrado».',options:[{label:'CREER EL MENSAJE',effect:'insight',description:'La casa revela un pasaje.'},{label:'SEGUIR TU PROPIO CAMINO',effect:'sanity',description:'Recuperas la voluntad.'}]}],
 7:[
 {name:'Uno de los cuatro',text:'El primer símbolo se cierra y alguien pronuncia tu nombre desde una boca invisible.',options:[{label:'RESPONDER',effect:'secret',description:'Una verdad exige sacrificio.'},{label:'GUARDAR SILENCIO',effect:'cleanse',description:'El ritual se debilita.'}]},
 {name:'El testigo ausente',text:'Las reliquias pertenecen a personas que desaparecieron antes de construir la casa.',options:[{label:'ESCUCHAR A LOS TESTIGOS',effect:'insight',description:'Aprendes la ubicación de una salida.'},{label:'PROTEGER SUS NOMBRES',effect:'ward',description:'Rescatas una protección.'}]}],
 8:[
 {name:'Las vetas del corazón',text:'Bajo la primera grieta hay un trozo de madera caliente que palpita al ritmo de tu pulso.',options:[{label:'LLEVARLO CONTIGO',effect:'stash',description:'Consigues provisiones; el corazón te siente.'},{label:'DESTRUIRLO',effect:'cleanse',description:'La casa retrocede.'}]},
 {name:'La voz detrás de todas las voces',text:'El Corazón muere y la cabaña te ofrece ocupar su lugar para que nadie más vuelva a entrar.',options:[{label:'RECHAZAR EL TRATO',effect:'sanity',description:'Recuerdas quién eres.'},{label:'ESCUCHAR SU CONFESIÓN',effect:'insight',description:'Conoces un secreto que duele.'}]}]
};
// Eight playable finales: triggered at the EXIT, after all ordinary objectives.
// Existing v4 storyBeats records whether a finale has already been resolved.
const CHAPTER_FINALES={
 1:{name:'La última página',text:'La salida se abre, pero el libro pronuncia tu nombre. La hoja final exige una respuesta.',options:[{label:'CONSERVAR LA PÁGINA',effect:'finale_archive',description:'Recuperas una pista para la próxima expedición.'},{label:'QUEMAR LA PÁGINA',effect:'finale_burn',description:'Apagas un peligro inmediato a costa de un recuerdo.'}]},
 2:{name:'El tejado sin cielo',text:'Un relámpago inmóvil divide el umbral. El bosque ofrece un refugio imposible.',options:[{label:'CRUZAR BAJO LA LLUVIA',effect:'finale_storm',description:'Sales herido, pero conservas provisiones para mañana.'},{label:'APAGAR EL RAYO',effect:'finale_burn',description:'Pierdes un recuerdo para reducir la oscuridad.'}]},
 3:{name:'La cacería invertida',text:'Los arañazos de las paredes escriben una dirección: la de tu próximo refugio.',options:[{label:'SEGUIR LAS HUELLAS',effect:'finale_hunt',description:'Sacrificas calma por munición para el siguiente episodio.'},{label:'CERRAR LAS PUERTAS',effect:'finale_calm',description:'Recobras la compostura; no llevas ninguna pista contigo.'}]},
 4:{name:'La máscara vacía',text:'La máscara del Guardián cae al suelo. Detrás no había un rostro, sino una ventana.',options:[{label:'MIRAR A TRAVÉS',effect:'finale_mask',description:'Aprendes a protegerte en la próxima expedición.'},{label:'ROMPER EL CRISTAL',effect:'finale_burn',description:'Alejas el último eco a costa de cordura.'}]},
 5:{name:'La puerta de cinco esquinas',text:'La salida se curva alrededor de ti. Dos corredores llevan al mismo lugar, pero no al mismo tiempo.',options:[{label:'MEMORIZAR EL PLANO',effect:'finale_map',description:'Obtienes ventaja en la siguiente noche.'},{label:'NEGAR LA CASA',effect:'finale_calm',description:'Deshaces la ilusión y recuperas la calma.'}]},
 6:{name:'La emisión final',text:'La radio emite tu propia voz, grabada mañana, rogándote que no apagues el aparato.',options:[{label:'GUARDAR LA FRECUENCIA',effect:'finale_radio',description:'Conservas una protección para el capítulo siguiente.'},{label:'DEJARLA EN SILENCIO',effect:'finale_calm',description:'Recuperas la cordura ahora.'}]},
 7:{name:'El cuarto nombre',text:'La última voz no es humana. Ofrece pronunciar el nombre que faltará en el ritual definitivo.',options:[{label:'MEMORIZAR EL NOMBRE',effect:'finale_name',description:'Llegas mejor preparado al último capítulo.'},{label:'OLVIDAR EL NOMBRE',effect:'finale_burn',description:'Alejas la oscuridad al coste de una memoria.'}]},
 8:{name:'La página en blanco',text:'El Corazón está muerto. La casa se derrumba, pero en el umbral queda una página vacía que aún respira.',options:[{label:'ESCRIBIR «FIN»',effect:'finale_end',description:'Aceptas lo vivido y cierras la historia.'},{label:'DEJAR LA PÁGINA EN BLANCO',effect:'finale_open',description:'Sales con una inquietante última pregunta.'}]}
};
const FINAL_ENCOUNTERS=Object.entries(CHAPTER_FINALES).map(([chapter,scene])=>({id:`finale-${chapter}`,chapter:Number(chapter),...scene}));
const ALL_ENCOUNTERS=[...ENCOUNTERS,...FINAL_ENCOUNTERS,...Object.entries(STORY_BEATS).flatMap(([chapter,beats])=>beats.map((b,i)=>({id:`c${chapter}-${i}`,chapter:Number(chapter),...b})))];
const ACHIEVEMENTS=[{id:'first',label:'Primera luz',desc:'Completa un capítulo.'},{id:'mid',label:'La mitad del libro',desc:'Completa el capítulo 4.'},{id:'end',label:'La última página',desc:'Completa el capítulo 8.'},{id:'hard',label:'Sin misericordia',desc:'Gana un capítulo en Pesadilla.'},{id:'long',label:'Hasta el amanecer',desc:'Alcanza el turno 15 en Supervivencia infinita.'},{id:'clean',label:'Pulso firme',desc:'Gana con 8 o más puntos de vida.'},{id:'stories',label:'Elige tu pesadilla',desc:'Resuelve cuatro encuentros en una partida.'}];
function neighbors(i){return [i-5,i+5,i%5?i-1:-1,i%5<4?i+1:-1].filter(x=>x>=0&&x<25)}
function dist(a,b){return Math.abs(Math.floor(a/5)-Math.floor(b/5))+Math.abs(a%5-b%5)}
function rand(s){let x=s.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;s.rng=x||0x6D2B79F5;return (s.rng>>>0)/4294967296}
function roll(s,n=6){return 1+Math.floor(rand(s)*n)}
function pick(s,a){return a[Math.floor(rand(s)*a.length)]}
function shuffle(s,list){let a=list.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(rand(s)*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function addLog(s,text,kind='narration'){s.log.unshift({turn:s.turn,text,kind});s.log.length=Math.min(s.log.length,90)}
function currentChapter(s){return CHAPTERS[s.chapter-1]||CHAPTERS[0]}
function currentObjective(s){return SIDE_OBJECTIVES[s.chapter]}
function chapterForecast(s){
 if(s.mode==='endless')return {label:'NOCHE SIN FIN',message:s.turn<12?'Resiste hasta el turno 12 para poder evacuar.':'Ya puedes evacuar desde la Entrada o seguir arriesgándote.',danger:s.doom>=doomLimit(s)-5};
 const remaining=currentObjective(s).target-s.objectiveCount;
 switch(s.chapter){
 case 1:return {label:'EL LIBRO ESCUCHA',message:remaining>0?'Busca la página perdida antes de regresar a la Entrada.':'Página recuperada. Cierra las grietas restantes y vuelve a casa.',danger:false};
 case 2:return {label:'EL TEMPORAL',message:remaining>0?`Quedan ${remaining} pararrayos. La tormenta sumará oscuridad cada 3 turnos.`:'Pararrayos reparados: los próximos embates no añadirán oscuridad.',danger:remaining>0&&s.turn%3===0};
 case 3:return {label:'LOS CAZADORES',message:remaining>0?`Quedan ${remaining} acechadores por eliminar. Se refuerzan cada 5 turnos.`:'Has cazado a los tres acechadores requeridos. No bajes la guardia.',danger:s.turn%5===0};
 case 4:return {label:'EL GUARDIÁN',message:s.bossKilled?'El Guardián ha caído. Regresa a la Entrada.':s.bossSummoned?'Espera a que termine su barrido ritual para aprovechar su vulnerabilidad.':'Cerrar la última grieta despertará al Guardián.',danger:s.bossSummoned&&!s.bossKilled&&s.turn%3===0};
 case 5:return {label:'GEOMETRÍA ENFERMA',message:remaining>0?`Purifica ${remaining} salas marcadas. Cada 3 turnos puede enfermar otra habitación.`:objectivesComplete(s)?'Ritual cerrado. Durante el regreso, cada tres turnos amortiguas 1 oscuridad base.':'Purificación concluida. Cierra las grietas restantes.',danger:s.turn%3===0};
 case 6:return {label:'EL ECO',message:remaining>0?`Recupera ${remaining} señales de radio. Descansar puede fallar: valora usar un talismán.`:'Mensajes recibidos. Cada cuatro turnos el silencio seguirá robando cordura.',danger:s.turn%4===0};
 case 7:return {label:'CUATRO NOMBRES',message:objectivesComplete(s)?'Los nombres están sellados: regresa a la Entrada; cada tres turnos reduces 1 oscuridad base.':`Sellos ${s.seals}/4. La pérdida ritual de cordura llega cada 4 turnos.` ,danger:s.turn%4===0};
 case 8:return {label:'LA ÚLTIMA NOCHE',message:s.bossKilled?'El Corazón está destruido. Regresa a la Entrada: cada tres turnos amortiguas 1 oscuridad base.':s.bossSummoned?'El pulso del Corazón se amplía en fase II. Busca la ventana de exposición.':`Sellos ${s.seals}/4: destrúyelos antes de afrontar al Corazón.`,danger:s.turn%3===0||s.turn%4===0};
 default:return {label:'EXPEDIENTE',message:currentChapter(s).description,danger:false};
 }
}

function bossThreat(s){
 const e=s.enemies.find(x=>x.type==='boss'||x.type==='heart');if(!e)return null;
 const stats=ENEMY_TYPES[e.type],frenzy=e.hp<=Math.ceil(stats.hp/2),ritual=s.turn%3===0;
 const range=e.type==='heart'?(frenzy?2:1):1;
 const label=e.type==='heart'?'PULSO DEL CORAZÓN':'BARRIDO DEL GUARDIÁN';
 const detail=e.type==='heart'?`Onda a ${range} ${range===1?'sala':'salas'}: pierde ${frenzy?2:1} de cordura y +1 oscuridad. Defender reduce la pérdida mental y evita +1 oscuridad del pulso.`:'Impacta en salas contiguas. El Guardián puede moverse '+(frenzy?'2':'1')+' salas. Defender reduce el daño.';
 return {id:e.id,type:e.type,name:stats.label,hp:e.hp,maxHp:stats.hp,phase:frenzy?2:1,phaseLabel:frenzy?'FASE II · FRENESÍ':'FASE I · ACECHO',ritual,turnsUntil:(3-s.turn%3)%3,range,label,detail,exposed:e.exposedUntil===s.turn};
}
function doomLimit(s){const finale=s.mode==='campaign'&&s.chapter===8?(s.difficulty==='nightmare'?6:3):0;return s.mode==='endless'?30:Math.max(12,currentChapter(s).limit+DIFFICULTIES[s.difficulty].doomBonus+finale)}
function createGame(chapter=1,seed,options={}){
 if(!Number.isInteger(chapter)||chapter<1||chapter>8)chapter=1;
 const survivor=SURVIVORS[options.survivor]?options.survivor:'scout';
 const difficulty=DIFFICULTIES[options.difficulty]?options.difficulty:'normal';
 const mode=options.mode==='endless'?'endless':'campaign';const hero=SURVIVORS[survivor],spec=CHAPTERS[chapter-1];
 const s={version:VERSION,chapter,rng:(seed>>>0)||((Date.now()^0xA17CB404)>>>0)||1,
  mode,difficulty,survivor,turn:1,ap:3,pos:ENTRANCE,hp:hero.hp,sanity:hero.sanity,ammo:hero.ammo,medkits:hero.medkits,wards:hero.wards,flares:hero.flares,scrap:0,doom:0,seals:0,totalSeals:0,
  sealSpots:[],sealed:[],revealed:[ENTRANCE],searched:[],enemies:[],nextId:1,deck:[],discard:[],lastEvent:null,lastRoll:null,lastAction:'',log:[],cursed:[],barricades:[],
  bossSummoned:false,bossKilled:false,ended:false,won:false,progressGranted:false,scenarioNote:'',abilityTurn:0,score:0,kills:0,killedStalkers:0,
  objectiveSpots:[],objectiveDone:[],objectiveCount:0,encounterSpots:[],encounterSeen:[],encounterChoices:[],pendingChoice:null,storyBeats:[],blessings:[],turnsSurvived:0,guard:0,legacy:null};
 const pool=Array.from({length:25},(_,i)=>i).filter(i=>i!==ENTRANCE&&dist(i,ENTRANCE)>=3);
 s.sealSpots=mode==='endless'?shuffle(s,pool).slice(0,4):shuffle(s,pool).slice(0,spec.seals);
 const other=shuffle(s,pool.filter(i=>!s.sealSpots.includes(i)));
 const o=currentObjective(s);
 if(mode==='campaign'&&['relic','repair','radio','purify'].includes(o.type)){s.objectiveSpots=other.slice(0,o.target)}
 // En el capítulo 5, las salas que hay que purificar están realmente malditas desde el inicio.
 if(mode==='campaign'&&o.type==='purify')s.cursed=s.objectiveSpots.slice();
 // El hallazgo narrativo es opcional, no bloquea permanentemente acciones salvo mientras se elige.
 s.encounterSpots=shuffle(s,other.filter(i=>!s.objectiveSpots.includes(i))).slice(0,4);
 s.encounterPool=shuffle(s,ENCOUNTERS.map(e=>e.id));
 refillDeck(s);
 // A single legacy travels to the NEXT chapter only, never to endless mode or replayed chapters.
 if(mode==='campaign'&&chapter>1&&options.legacy&&options.legacy.from===chapter-1){
  const gifts={archive:['ward',1],storm:['medkit',1],hunt:['ammo',2],mask:['ward',1],map:['flare',1],radio:['ward',1],name:['medkit',1]};
  const gift=gifts[options.legacy.kind];if(gift){const keys={ward:'wards',medkit:'medkits',ammo:'ammo',flare:'flares'};s[keys[gift[0]]]+=gift[1];addLog(s,`HERENCIA DEL CAPÍTULO ${chapter-1}: ${gift[1]} ${gift[0]} adicional.`,'story')}
 }
 if(difficulty==='story'){s.ammo+=2;s.medkits++;s.wards++;s.flares++}
 if(difficulty==='nightmare'){s.sanity=Math.max(1,s.sanity-1);s.doom=2}
 addLog(s,mode==='endless'?'MODO INFINITO: sobrevive cuanto puedas. A partir del turno 12 puedes huir con tu puntuación.':`CAPÍTULO ${chapter}: ${spec.name}. ${spec.description}`,'story');
 addLog(s,`${hero.name}, ${hero.role}. Tres acciones por turno. Dificultad: ${DIFFICULTIES[difficulty].name}.`,'help');return s
}
function refillDeck(s){s.deck=shuffle(s,CARDS.map(c=>c.id));s.discard=[]}
function canUse(s){return !s.ended&&!s.pendingChoice&&s.ap>0}
function spend(s){if(!canUse(s))return false;s.ap--;return true}
function damage(s,n,source){s.hp=Math.max(0,s.hp-n);addLog(s,`${source}: −${n} salud.`,'danger')}
function hurtMind(s,n,source){s.sanity=Math.max(0,s.sanity-n);addLog(s,`${source}: −${n} cordura.`,'danger')}
function finish(s,won,msg){if(s.ended)return;s.ended=true;s.won=won;s.ap=0;s.pendingChoice=null;addLog(s,msg,won?'victory':'danger');s.lastAction=msg;s.score+=Math.max(0,Math.floor((s.hp+s.sanity)*4+(s.mode==='endless'?s.turn*6:150-s.doom*2)))}
function check(s){if(s.ended)return;if(s.hp<=0)finish(s,false,'DERROTA · Tus heridas te vencen.');else if(s.sanity<=0)finish(s,false,'DERROTA · El bosque se instala en tu mente.');else if(s.doom>=doomLimit(s))finish(s,false,'DERROTA · La oscuridad devora el último refugio.')}
function spawn(s,type,preferred){if(s.enemies.length>=10){
  if(type!=='boss'&&type!=='heart')return false;
  const victim=s.enemies.findIndex(e=>e.type!=='boss'&&e.type!=='heart');
  if(victim<0)return false;
  s.enemies.splice(victim,1);addLog(s,'La presencia del jefe consume a una criatura menor.','danger');
 }const valid=s.revealed.filter(i=>i!==s.pos&&dist(i,s.pos)>=2),less=s.revealed.filter(i=>i!==s.pos);
 const spot=(Number.isInteger(preferred)&&s.revealed.includes(preferred)&&preferred!==s.pos)?preferred:(valid.length?pick(s,valid):less.length?pick(s,less):s.pos);
 const e={id:s.nextId++,type,pos:spot,hp:ENEMY_TYPES[type].hp};s.enemies.push(e);addLog(s,`${ENEMY_TYPES[type].label} aparece en ${ROOM_NAMES[spot]}.`,'danger');return true}
function triggerEncounter(s,i){if(!s.encounterSpots.includes(i)||s.encounterSeen.includes(i)||s.ended)return;
 s.encounterSeen.push(i);const id=s.encounterPool.shift()||pick(s,ENCOUNTERS.map(e=>e.id));s.pendingChoice=id;
 const scene=ALL_ENCOUNTERS.find(e=>e.id===id);addLog(s,`ENCUENTRO · ${scene.name}: ${scene.text}`,'story')}
function storyBeat(s,when){if(s.mode!=='campaign'||s.ended||s.pendingChoice||s.storyBeats.includes(when))return;
 const id=`c${s.chapter}-${when==='seal'?0:1}`;const scene=ALL_ENCOUNTERS.find(x=>x.id===id);if(!scene)return;
 s.storyBeats.push(when);s.pendingChoice=id;addLog(s,`CRÓNICA DE CAPÍTULO · ${scene.name}: ${scene.text}`,'story')}
function discover(s,i){if(s.revealed.includes(i))return;s.revealed.push(i);s.score+=5;addLog(s,`Exploras ${ROOM_NAMES[i]}.`,'story');
 if(s.sealSpots.includes(i)){addLog(s,'Una grieta roja palpita bajo los tablones. Puedes sellarla aquí.','danger');hurtMind(s,1,'Visión de la grieta')}
 else if(rand(s)<.13){spawn(s,s.chapter>=5&&rand(s)<.2?'wraith':rand(s)<.22?'stalker':'possessed',i)}
 if(s.objectiveSpots.includes(i)&&!s.objectiveDone.includes(i))addLog(s,`HALLAZGO · ${currentObjective(s).name}. Usa «Investigar» aquí.`,'story');
 if(s.cursed.includes(i))hurtMind(s,1,'La habitación deformada');check(s);if(!s.ended)triggerEncounter(s,i)}
function move(s,to){if(!canUse(s)||!Number.isInteger(to)||!neighbors(s.pos).includes(to))return false;spend(s);const known=s.revealed.includes(to);s.pos=to;
 if(s.mode==='campaign'&&s.chapter===5&&s.objectiveSpots.includes(to)&&!s.objectiveDone.includes(to)&&!s.cursed.includes(to))s.cursed.push(to);
 discover(s,to);if(!s.ended)triggerEncounter(s,to);
 if(known&&s.cursed.includes(to))hurtMind(s,1,'Las paredes deformadas');if(s.enemies.some(e=>e.pos===to))addLog(s,'Has entrado en una habitación infestada.','danger');s.lastAction='Movimiento a '+ROOM_NAMES[to];check(s);return true}
function search(s){if(!canUse(s)||s.searched.includes(s.pos)||s.enemies.some(e=>e.pos===s.pos))return false;spend(s);s.searched.push(s.pos);let r=rand(s);
 if(r<.21){s.ammo+=2;addLog(s,'Entre los escombros: +2 cartuchos.','loot')}else if(r<.40){s.medkits++;addLog(s,'Encuentras un botiquín.','loot')}else if(r<.56){s.wards++;addLog(s,'Encuentras sal consagrada (+1 talismán).','loot')}else if(r<.72){s.flares++;addLog(s,'Encuentras una bengala.','loot')}else if(r<.87){s.scrap++;addLog(s,'Recoges piezas de hierro (+1 chatarra).','loot')}else{s.sanity=Math.min(MAX_SANITY,s.sanity+2);addLog(s,'Un retrato familiar te reconforta: +2 cordura.','loot')}
 s.score+=8;s.lastAction='Registro completado';check(s);return true}
function objectiveAction(s){if(!canUse(s)||s.mode==='endless'||!s.objectiveSpots.includes(s.pos)||s.objectiveDone.includes(s.pos)||s.enemies.some(e=>e.pos===s.pos))return false;
 spend(s);s.objectiveDone.push(s.pos);s.objectiveCount++;const o=currentObjective(s);s.score+=35;
 if(o.type==='purify'){s.cursed=s.cursed.filter(x=>x!==s.pos);s.sanity=Math.min(MAX_SANITY,s.sanity+1)}
 if(o.type==='repair'){s.doom=Math.max(0,s.doom-3)}
 if(o.type==='relic'){s.wards++;s.scrap++}
 if(o.type==='radio'){s.flares++;s.doom=Math.max(0,s.doom-1)}
 if(s.chapter===1&&s.objectiveCount===1){s.sanity=Math.min(MAX_SANITY,s.sanity+1);addLog(s,'La página revela una salida posible: recuperas 1 cordura.','loot')}
 if(s.chapter===6){s.ammo++;addLog(s,'La radio apunta hacia un escondite: +1 cartucho.','loot')}
 addLog(s,`${o.name}: ${s.objectiveCount}/${o.target}. ${ROOM_NAMES[s.pos]}.`,'story');s.lastAction='Objetivo secundario';if(s.objectiveCount>=o.target)storyBeat(s,'objective');return true}
function hasShot(s,target){if(dist(s.pos,target)>2)return false;if(s.pos!==target&&Math.floor(s.pos/5)!==Math.floor(target/5)&&s.pos%5!==target%5)return false;
 let step=target===s.pos?0:Math.floor(s.pos/5)===Math.floor(target/5)?(target>s.pos?1:-1):(target>s.pos?5:-5);
 if(step)for(let i=s.pos+step;i!==target;i+=step)if(!s.revealed.includes(i))return false;return true}
function attack(s,id,weapon='axe'){if(!canUse(s)||!['axe','shotgun'].includes(weapon))return false;const e=s.enemies.find(e=>e.id===id);if(!e)return false;
 const inRange=weapon==='axe'?dist(s.pos,e.pos)<=1:hasShot(s,e.pos);if(!inRange||(weapon==='shotgun'&&!s.ammo))return false;
 spend(s);if(weapon==='shotgun')s.ammo--;const d=roll(s),crit=d===6,hit=d>=(weapon==='axe'?4:3);let dealt=hit?(weapon==='shotgun'?2:1)+(crit?1:0):0;
 if(hit&&(e.type==='boss'||e.type==='heart')&&e.exposedUntil===s.turn){dealt++;addLog(s,'VENTANA DE ATAQUE: el ritual dejó al jefe expuesto. +1 daño.','combat')}
 if(hit&&e.type==='boss'&&useEcho(s,'echo-guardian','Reconoces la debilidad del Guardián: +1 daño.'))dealt++;
 if(hit&&s.scrap>=3){dealt++;s.scrap-=3;addLog(s,'Arma reforzada: gastas 3 piezas, +1 daño.','combat')}
 e.hp-=dealt;s.lastRoll={value:d,hit,crit,weapon,damage:dealt};addLog(s,`${weapon==='axe'?'Hachazo':'Disparo'} contra ${ENEMY_TYPES[e.type].label}: dado ${d} · ${hit?`${dealt} daño${crit?' (crítico)':''}`:'fallo'}.`,hit?'combat':'danger');
 if(e.hp<=0){s.enemies=s.enemies.filter(x=>x.id!==id);s.kills++;s.score+=e.type==='boss'||e.type==='heart'?150:25;addLog(s,`${ENEMY_TYPES[e.type].label} eliminado.`,'loot');
  // Pesadilla recompensa dominar combates en lugar de esperar pasivamente.
  // No se crea estado adicional: se aprovecha el contador persistente de bajas.
  if(s.mode==='campaign'&&s.difficulty==='nightmare'&&s.kills%2===0){const before=s.doom;s.doom=Math.max(0,s.doom-3);if(s.doom<before)addLog(s,`RACHA DE SUPERVIVENCIA · Dos amenazas eliminadas: −${before-s.doom} oscuridad.`,'loot')}
  if(e.type==='stalker'){s.killedStalkers++;if(s.chapter===3){s.objectiveCount=Math.min(3,s.killedStalkers);if(s.objectiveCount>=3)storyBeat(s,'objective')}}
  if(e.type==='boss'||e.type==='heart'){s.bossKilled=true;s.objectiveCount=1;storyBeat(s,'objective');s.doom=Math.max(0,s.doom-3);addLog(s,`El ${e.type==='heart'?'Corazón':'Guardián'} cae. La oscuridad retrocede.`, 'story')}}
 s.lastAction='Resolución de combate';check(s);return true}
function heal(s){if(!canUse(s)||!s.medkits||s.hp===MAX_HP)return false;spend(s);s.medkits--;s.hp=Math.min(MAX_HP,s.hp+4);addLog(s,'Botiquín: +4 salud.','loot');s.lastAction='Botiquín';return true}
function ward(s){if(!canUse(s)||!s.wards||(s.sanity===MAX_SANITY&&s.doom===0))return false;spend(s);s.wards--;s.sanity=Math.min(MAX_SANITY,s.sanity+2);s.doom=Math.max(0,s.doom-(s.mode==='campaign'&&s.difficulty==='nightmare'?4:2));addLog(s,`Talismán: +2 cordura, −${s.mode==='campaign'&&s.difficulty==='nightmare'?4:2} oscuridad (hasta el mínimo 0).`,'loot');s.lastAction='Talismán';return true}
function flare(s){if(!canUse(s)||!s.flares)return false;spend(s);s.flares--;s.doom=Math.max(0,s.doom-1);
 for(const i of neighbors(s.pos)){if(!s.revealed.includes(i)){s.revealed.push(i);s.score+=3;addLog(s,`La bengala ilumina ${ROOM_NAMES[i]}.`,'loot')}}
 for(const e of s.enemies)if(dist(e.pos,s.pos)<=1)e.stunnedUntil=s.turn;
 addLog(s,'Bengala: −1 oscuridad; enemigos cercanos aturdidos esta noche.','loot');s.lastAction='Bengala';return true}
function barricade(s){if(!canUse(s)||s.barricades.includes(s.pos)||s.enemies.some(e=>e.pos===s.pos)||s.scrap<1)return false;
 spend(s);s.scrap--;s.barricades.push(s.pos);addLog(s,'Tablas clavadas: esta habitación detendrá al primer enemigo que entre.','loot');s.lastAction='Barricada';return true}
function ability(s){if(!canUse(s)||s.abilityTurn===s.turn)return false;const id=s.survivor;
 if(id==='medic'&&s.hp>=MAX_HP)return false;if(id==='occultist'&&s.sanity===MAX_SANITY&&s.doom===0)return false;
 spend(s);s.abilityTurn=s.turn;
 if(id==='scout'){for(const i of neighbors(s.pos)){if(!s.revealed.includes(i)){s.revealed.push(i);s.score+=3;addLog(s,`Reconoces ${ROOM_NAMES[i]} desde la puerta.`,'loot')}}}
 if(id==='medic'){s.hp=Math.min(MAX_HP,s.hp+2);addLog(s,'Primeros auxilios: +2 salud.','loot')}
 if(id==='occultist'){s.sanity=Math.min(MAX_SANITY,s.sanity+1);s.doom=Math.max(0,s.doom-1);addLog(s,'Exorcismo: +1 cordura, −1 oscuridad.','loot')}
 s.lastAction=SURVIVORS[id].ability;return true}
function guard(s){if(!canUse(s)||s.guard===1)return false;
 spend(s);s.guard=1;addLog(s,'DEFENSA: te preparas para el siguiente ataque. Evitas 1 herida y 1 pérdida de cordura durante esta fase del mal.','combat');s.lastAction='Defensa preparada';return true}
function rest(s){if(!canUse(s)||s.sanity===MAX_SANITY)return false;spend(s);
 if(currentChapter(s).pressure==='silence'&&s.mode!=='endless'&&roll(s)<=3){s.doom++;addLog(s,'El silencio te responde. Descanso fallido y +1 oscuridad.','danger')}
 else{s.sanity=Math.min(MAX_SANITY,s.sanity+1);addLog(s,'Respiras despacio: +1 cordura.','loot')}
 s.lastAction='Descanso';check(s);return true}
function seal(s){if(!canUse(s)||!s.sealSpots.includes(s.pos)||s.sealed.includes(s.pos)||s.enemies.some(e=>e.pos===s.pos))return false;
 spend(s);s.sealed.push(s.pos);s.seals++;s.totalSeals++;s.sanity=Math.max(0,s.sanity-1);s.doom=Math.max(0,s.doom-3);s.score+=55;addLog(s,`Sello cerrado (${s.seals}/${s.sealSpots.length}). −1 cordura, −3 oscuridad.`,'story');s.lastAction='Ritual de cierre';
 if(s.mode==='campaign'&&s.chapter===7&&s.seals===2){s.doom=Math.max(0,s.doom-2);addLog(s,'Dos nombres resuenan al unísono: −2 oscuridad adicionales.','story')}
 if(s.mode==='endless'&&s.seals===s.sealSpots.length){const places=shuffle(s,Array.from({length:25},(_,i)=>i).filter(i=>i!==ENTRANCE)).slice(0,4);s.sealSpots=places;s.sealed=[];s.seals=0;addLog(s,'Has cerrado un círculo de cuatro grietas. Nacen cuatro grietas nuevas.','danger')}
 if(s.mode==='campaign'&&s.seals===currentChapter(s).seals&&['boss','final'].includes(currentChapter(s).pressure)&&!s.bossSummoned){const spots=s.revealed.filter(i=>i!==s.pos&&dist(i,s.pos)>=2);
  if(spawn(s,s.chapter===8?'heart':'boss',spots.length?pick(s,spots):undefined)){
   s.bossSummoned=true;
   if(s.chapter===8&&s.difficulty==='nightmare'){
    s.wards++;addLog(s,'LA ÚLTIMA RESERVA · Hallas un talismán antes de enfrentar al Corazón (+1 talismán).','loot')
   }
   addLog(s,'Un cuerpo inmenso emerge de las vigas. Destrúyelo antes de escapar.','danger')}}
 check(s);if(!s.ended&&s.seals===1)storyBeat(s,'seal');return true}
function objectivesComplete(s){return s.mode==='endless'?s.turn>=12:s.seals===currentChapter(s).seals&&s.objectiveCount>=currentObjective(s).target&&(currentObjective(s).type!=='boss'||s.bossKilled)}
function escape(s){if(s.ended||s.pendingChoice||s.pos!==ENTRANCE||!objectivesComplete(s))return false;
 if(s.mode==='endless')finish(s,true,`EXTRACCIÓN · Escapaste en el turno ${s.turn} con ${s.score} puntos.`);
 else {if(!s.storyBeats.includes('finale')){s.pendingChoice=`finale-${s.chapter}`;addLog(s,`CLÍMAX · ${CHAPTER_FINALES[s.chapter].name}: ${CHAPTER_FINALES[s.chapter].text}`,'story');s.lastAction='El umbral exige una última decisión';return true}
 const epilogue=s.encounterChoices.length>=3&&s.sanity>=5?'Las voces dejan de perseguirte. Una página del libro se ha quedado en blanco.':currentChapter(s).epilogue;finish(s,true,`VICTORIA · Capítulo ${s.chapter} completado. ${epilogue}`)}return true}
// Chapter-specific consequences use the existing v4 blessings array (save compatible).
const CHAPTER_ECHOES={
1:{id:'echo-page',name:'Página memorizada',effect:'La próxima carta que quite cordura perderá 1 de potencia.'},
2:{id:'echo-storm',name:'Refugio contra la tormenta',effect:'El próximo temporal no añadirá oscuridad.'},
3:{id:'echo-hunt',name:'Rastro borrado',effect:'La próxima oleada de acechadores se evita.'},
4:{id:'echo-guardian',name:'Armadura agrietada',effect:'Tu primer ataque acertado al Guardián causa +1 daño.'},
5:{id:'echo-geometry',name:'Plano imposible',effect:'La próxima mutación de una estancia queda anulada.'},
6:{id:'echo-silence',name:'Frecuencia anclada',effect:'El próximo eco del silencio no reduce la cordura.'},
7:{id:'echo-ritual',name:'Nombre protegido',effect:'El próximo cuarto nombre no reduce la cordura.'},
8:{id:'echo-heart',name:'Latido anticipado',effect:'El próximo pulso del Corazón se reduce en 1 cordura.'}};
function useEcho(s,id,message){if(!s.blessings.includes(id))return false;s.blessings=s.blessings.filter(x=>x!==id);addLog(s,`ECO DE TU DECISIÓN · ${message}`,'story');return true}
function choose(s,option){if(s.ended||!s.pendingChoice||!Number.isInteger(option)||option<0||option>1)return false;
 const scene=ALL_ENCOUNTERS.find(e=>e.id===s.pendingChoice);if(!scene)return false;const choice=scene.options[option];s.encounterChoices.push(`${scene.id}:${option}`);s.pendingChoice=null;s.score+=20;
 if(scene.id===`finale-${s.chapter}`){
  // No action points, and no defeat imposed AFTER objectives have already been completed.
  const legacyKinds={finale_archive:'archive',finale_storm:'storm',finale_hunt:'hunt',finale_mask:'mask',finale_map:'map',finale_radio:'radio',finale_name:'name'};
  s.legacy=legacyKinds[choice.effect]?{from:s.chapter,kind:legacyKinds[choice.effect]}:null;
  if(choice.effect==='finale_hunt')s.sanity=Math.max(1,s.sanity-1);
  if(choice.effect==='finale_storm')s.hp=Math.max(1,s.hp-1);
  if(choice.effect==='finale_burn'){s.sanity=Math.max(1,s.sanity-1);s.doom=Math.max(0,s.doom-2)}
  if(choice.effect==='finale_calm')s.sanity=Math.min(MAX_SANITY,s.sanity+2);
  if(choice.effect==='finale_end')s.score+=100;
  if(choice.effect==='finale_open')s.score+=50;
  s.storyBeats.push('finale');addLog(s,`DESENLACE · ${scene.name}: ${choice.label}. ${choice.description}`,'story');
  s.lastAction='El umbral vuelve a abrirse. Pulsa ESCAPAR para terminar el capítulo.';return true;
 }
 switch(choice.effect){case 'insight':{hurtMind(s,1,'Revelación');let options=neighbors(s.pos).filter(i=>!s.revealed.includes(i));if(options.length){s.revealed.push(pick(s,options));s.score+=3}break}
 case 'supply':s.ammo+=2;s.scrap++;break;case 'heal':s.hp=Math.min(MAX_HP,s.hp+3);s.doom++;break;
 case 'ward':s.wards++;s.doom++;break;case 'secret':s.flares++;s.doom+=2;break;
 case 'sanity':s.sanity=Math.min(MAX_SANITY,s.sanity+2);break;
 case 'stash':s.medkits++;spawn(s,s.chapter>3?'wraith':'possessed');break;
 case 'cleanse':s.doom=Math.max(0,s.doom-2);hurtMind(s,1,'Cenizas rituales');break;
 case 'barricade':if(!s.barricades.includes(s.pos))s.barricades.push(s.pos);break}
 if(s.mode==='campaign'&&scene.id===`c${s.chapter}-0`&&option===0){const echo=CHAPTER_ECHOES[s.chapter];if(echo&&!s.blessings.includes(echo.id)){s.blessings.push(echo.id);addLog(s,`RESONANCIA · ${echo.name}: ${echo.effect}`,'loot')}}
 addLog(s,`DECISIÓN · ${scene.name}: ${choice.label}. ${choice.description}`,'story');s.lastAction=`Decisión: ${choice.label}`;check(s);return true}
function applyCard(s){
 if(!s.deck.length)refillDeck(s);
 const id=s.deck.pop(),c=CARDS.find(x=>x.id===id);s.discard.push(id);
 const before={hp:s.hp,sanity:s.sanity,doom:s.doom,ammo:s.ammo,medkits:s.medkits,wards:s.wards,flares:s.flares,scrap:s.scrap,enemies:s.enemies.length};
 addLog(s,`CARTA · ${c.name}. ${c.flavor}`,'card');
 switch(c.type){case 'sanity':{let delta=c.value;if(delta<0&&useEcho(s,'echo-page','La página amortigua una perturbación mental.'))delta=Math.min(0,delta+1);s.sanity=Math.min(MAX_SANITY,Math.max(0,s.sanity+delta));break}
 case 'damage':damage(s,c.value,'Evento');break;case 'hope':s.sanity=Math.min(MAX_SANITY,s.sanity+c.value);break;
 case 'ammo':s.ammo+=c.value;break;case 'medkit':s.medkits+=c.value;break;case 'ward':s.wards+=c.value;break;case 'flare':s.flares+=c.value;break;case 'scrap':s.scrap+=c.value;break;
 case 'doom':s.doom=Math.max(0,s.doom+c.value);break;
 case 'spawn':for(let i=0;i<c.value;i++)spawn(s,s.chapter>=6&&rand(s)<.15?'wraith':s.chapter>=4&&rand(s)<.16?'brute':s.chapter>=3&&rand(s)<.4?'stalker':'possessed');break}
 const key={sanity:'sanity',hope:'sanity',damage:'hp',doom:'doom',ammo:'ammo',medkit:'medkits',ward:'wards',flare:'flares',scrap:'scrap',spawn:'enemies'}[c.type];
 const delta=(c.type==='spawn'?s.enemies.length:s[key])-before[key],name={sanity:'cordura',hope:'cordura',damage:'salud',doom:'oscuridad',ammo:'cartuchos',medkit:'botiquines',ward:'talismanes',flare:'bengalas',scrap:'chatarra',spawn:'criaturas'}[c.type];
 const applied=delta===0?(c.type==='spawn'?'Sin aparición: el tablero está lleno.':'Sin efecto: el recurso ya está en su límite.'):c.type==='spawn'?`${delta} ${delta===1?'criatura aparece':'criaturas aparecen'} en la cabaña.`:`${delta>0?'+':''}${delta} ${name} aplicado${Math.abs(delta)===1?'':'s'}.`;
 s.lastEvent={id:c.id,name:c.name,flavor:c.flavor,type:c.type,art:c.art,turn:s.turn,applied};
 addLog(s,`EFECTO REAL · ${applied}`,'card');
}
function nextMove(s,e){const opts=neighbors(e.pos).filter(i=>s.revealed.includes(i));if(!opts.length)return;
 opts.sort((a,b)=>dist(a,s.pos)-dist(b,s.pos)||a-b);if(dist(opts[0],s.pos)<dist(e.pos,s.pos))e.pos=opts[0]}
function enemyPhase(s){for(const e of s.enemies){if(s.ended)break;if(e.stunnedUntil===s.turn)continue;
 const stats=ENEMY_TYPES[e.type];let steps=(e.type==='boss'||e.type==='heart')&&e.hp<=Math.ceil(stats.hp/2)?2:stats.steps;
 for(let i=0;i<steps&&e.pos!==s.pos;i++){
  if(e.type==='wraith'){const old=e.pos;const options=s.revealed.filter(x=>dist(x,s.pos)<dist(old,s.pos));if(options.length){options.sort((a,b)=>dist(a,s.pos)-dist(b,s.pos));e.pos=options[0]}}else nextMove(s,e);
  if(s.barricades.includes(e.pos)){s.barricades=s.barricades.filter(x=>x!==e.pos);addLog(s,`La barricada de ${ROOM_NAMES[e.pos]} ha detenido a ${stats.label}.`,'combat');e.blocked=true;break}}
 if(e.blocked){e.blocked=false;continue}
 // Los rituales se anuncian por turno, no dependen de azar y dejan una respuesta táctica.
 if((e.type==='boss'||e.type==='heart')&&s.turn%3===0){
  const frenzy=e.hp<=Math.ceil(stats.hp/2),d=dist(e.pos,s.pos);
  if(e.type==='heart'&&d<=(frenzy?2:1)){
   let mind=frenzy?2:1;let ritualDoom=1;
   if(useEcho(s,'echo-heart','Anticipas el latido del Corazón.'))mind=Math.max(0,mind-1);
   // La defensa preparada tiene una respuesta táctica explícita al pulso en el final.
   if(s.guard===1){mind=Math.max(0,mind-1);ritualDoom=0;s.guard=0;addLog(s,'DEFENSA RITUAL: resistes el pulso y evitas +1 oscuridad.','combat')}
   s.doom+=ritualDoom;
   if(mind)hurtMind(s,mind,'Pulso del Corazón');
   addLog(s,`PULSO RITUAL · Radio ${frenzy?2:1}: +${ritualDoom} oscuridad. El Corazón queda expuesto hasta el próximo turno.`,'danger');
   e.exposedUntil=s.turn+1;check(s);continue;
  }
  if(e.type==='boss'&&d===1){
   const r=roll(s),hit=r>=Math.max(2,4+DIFFICULTIES[s.difficulty].hitShift);
   addLog(s,`BARRIDO DEL GUARDIÁN · dado ${r}${hit?' · impacto a distancia':' · falló'}.`,'danger');
   if(hit){let harm=frenzy?2:1;if(s.guard===1){harm=Math.max(0,harm-1);s.guard=0;addLog(s,'DEFENSA: resistes el barrido.','combat')}
    if(harm)damage(s,harm,'Barrido del Guardián')}
   e.exposedUntil=s.turn+1;check(s);continue;
  }
  if(d===0)e.exposedUntil=s.turn+1;
 }
 if(e.pos===s.pos){const r=roll(s),hit=r>=Math.max(2,stats.hit+DIFFICULTIES[s.difficulty].hitShift);
  addLog(s,`${stats.label} ataca: dado ${r}${hit?' · impacto':' · falló'}.`,hit?'danger':'combat');
  if(hit){const ritual=(e.type==='boss'||e.type==='heart')&&s.turn%3===0;
  let harm=stats.damage+(ritual?1:0),mind=stats.mind||0;
  if(ritual)addLog(s,`${stats.label} descarga un golpe ritual intensificado.`, 'danger');
  if(s.guard===1){harm=Math.max(0,harm-1);mind=Math.max(0,mind-1);s.guard=0;addLog(s,'DEFENSA: bloqueas parte del impacto.', 'combat')}
  if(harm)damage(s,harm,stats.label);if(mind)hurtMind(s,mind,stats.label);if(stats.doom)s.doom+=stats.doom}check(s)}}}
function exitBreather(s){return s.mode==='campaign'&&[5,7,8].includes(s.chapter)&&objectivesComplete(s)&&s.pos!==ENTRANCE&&s.turn%3===0}
function endTurn(s){if(s.ended||s.pendingChoice)return false;
 const incoming=s.difficulty==='nightmare'?(s.mode==='campaign'&&s.turn%2===0?1:2):s.difficulty==='story'&&s.turn%2===0?0:1;
 const breather=exitBreather(s);s.doom+=breather?Math.max(0,incoming-1):incoming;
 if(breather)addLog(s,'ÚLTIMO REGRESO · Al cerrar el ritual, la casa vacila: −1 oscuridad de avance este turno. No detiene ataques ni eventos.','story');
 addLog(s,'La casa respira. La oscuridad avanza.','phase');applyCard(s);
 if(s.turn%3===0&&!s.enemies.some(e=>e.type==='boss'||e.type==='heart'))spawn(s,s.mode==='endless'&&s.turn>=12?'wraith':s.chapter>=3?'stalker':'possessed');
 if(s.mode==='campaign'){
 const p=currentChapter(s).pressure;
 if(p==='storm'&&s.turn%3===0){const shelter=useEcho(s,'echo-storm','La tormenta se desvía de tu refugio.');s.doom+=shelter||s.objectiveCount>=2?0:2;addLog(s,'El temporal desata su furia. Repara los pararrayos para protegerte.','danger')}
 if(p==='hunters'&&s.turn%5===0&&!useEcho(s,'echo-hunt','Los acechadores pierden el rastro.'))spawn(s,'stalker');
 if(p==='shifting'&&s.turn%3===0&&!useEcho(s,'echo-geometry','El plano contiene la mutación.')){const options=s.revealed.filter(x=>x!==ENTRANCE);if(options.length){const i=pick(s,options);if(!s.cursed.includes(i))s.cursed.push(i);addLog(s,`La habitación ${ROOM_NAMES[i]} se retuerce y queda maldita.`,'danger');if(s.pos===i)hurtMind(s,1,'Habitación maldita')}}
 if(p==='silence'&&s.turn%4===0&&!useEcho(s,'echo-silence','La frecuencia preservada cancela el silencio.'))hurtMind(s,1,'El eco del silencio');
 if(p==='ritual'&&s.turn%4===0&&!useEcho(s,'echo-ritual','El nombre protegido contiene el ritual.'))hurtMind(s,1,'El cuarto nombre');
 if(p==='final'&&s.turn%4===0){s.doom++;addLog(s,'El corazón late. +1 oscuridad.','danger')}
 }else if(s.turn%5===0){spawn(s,s.turn>=16?'brute':'leech');s.doom=Math.max(0,s.doom-2)}
 check(s);if(!s.ended)enemyPhase(s);
 if(!s.ended){s.guard=0;s.turn++;s.turnsSurvived++;s.ap=3;s.lastAction='Fase del mal completada';s.score+=10;addLog(s,`Comienza el turno ${s.turn}.`,'phase')}return true}
function dispatch(s,action){if(!s||s.ended||!action||typeof action.type!=='string')return false;
 if(s.pendingChoice&&action.type!=='CHOOSE')return false;
 switch(action.type){case 'MOVE':return move(s,action.to);case 'SEARCH':return search(s);case 'INVESTIGATE':return objectiveAction(s);
 case 'ATTACK':return attack(s,action.id,action.weapon);case 'HEAL':return heal(s);case 'WARD':return ward(s);case 'FLARE':return flare(s);
 case 'GUARD':return guard(s);case 'BARRICADE':return barricade(s);case 'ABILITY':return ability(s);case 'REST':return rest(s);case 'SEAL':return seal(s);
 case 'ESCAPE':return escape(s);case 'END_TURN':return endTurn(s);case 'CHOOSE':return choose(s,action.option);default:return false}}
// Schema defensivo para guardados v4. La validación debe ser total antes de renderizar/importar.
function validate(s){
 const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const num=(x,min=0,max=10000000)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
 const txt=(x,max=1000)=>typeof x==='string'&&x.length<=max;
 const bool=x=>typeof x==='boolean';
 const spots=['sealSpots','sealed','revealed','searched','cursed','barricades','objectiveSpots','objectiveDone','encounterSpots','encounterSeen'];
 const loc=a=>Array.isArray(a)&&a.length<=25&&a.every(v=>num(v,0,24))&&new Set(a).size===a.length;
 if(!plain(s)||s.version!==VERSION||!num(s.chapter,1,8)||!num(s.pos,0,24)||!num(s.rng,-2147483648,4294967295)||!num(s.turn,1,10000000)||!num(s.ap,0,3)||!Object.hasOwn(SURVIVORS,s.survivor)||!Object.hasOwn(DIFFICULTIES,s.difficulty)||!['campaign','endless'].includes(s.mode))return false;
 for(const k of ['hp','sanity','ammo','medkits','wards','flares','scrap','doom','seals','totalSeals','nextId','score','kills','killedStalkers','objectiveCount','abilityTurn'])if(!num(s[k]))return false;
 if(s.hp>MAX_HP||s.sanity>MAX_SANITY||s.nextId<1||s.abilityTurn>s.turn||!num(s.turnsSurvived)||!(s.guard===undefined||num(s.guard,0,1)))return false;
 if(s.legacy!==undefined&&s.legacy!==null&&(!plain(s.legacy)||!num(s.legacy.from,1,8)||!['archive','storm','hunt','mask','map','radio','name'].includes(s.legacy.kind)||s.legacy.from!==s.chapter))return false;
 for(const k of ['bossSummoned','bossKilled','ended','won'])if(!bool(s[k]))return false;
 if(s.recorded!==undefined&&!bool(s.recorded))return false;
 if(!txt(s.lastAction,2000)||!txt(s.scenarioNote,2000))return false;
 if(spots.some(k=>!loc(s[k])))return false;
 if(s.mode==='campaign'&&s.sealSpots.length!==currentChapter(s).seals||s.sealed.length!==s.seals||s.seals>s.sealSpots.length||!s.revealed.includes(s.pos))return false;
 if(s.sealed.some(i=>!s.sealSpots.includes(i))||s.searched.some(i=>!s.revealed.includes(i))||s.objectiveDone.some(i=>!s.objectiveSpots.includes(i)))return false;
 if(!Array.isArray(s.enemies)||s.enemies.length>10||s.enemies.some(e=>!plain(e)||!num(e.id,1)||!Object.hasOwn(ENEMY_TYPES,e.type)||!num(e.pos,0,24)||!s.revealed.includes(e.pos)||!num(e.hp,1,ENEMY_TYPES[e.type]?.hp)||e.stunnedUntil!==undefined&&!num(e.stunnedUntil,0)||e.exposedUntil!==undefined&&!num(e.exposedUntil,0)||e.blocked!==undefined&&!bool(e.blocked)))return false;
 if(new Set(s.enemies.map(e=>e.id)).size!==s.enemies.length)return false;
 const cardIds=new Set(CARDS.map(c=>c.id));
 if(!Array.isArray(s.deck)||!Array.isArray(s.discard)||s.deck.length>24||s.discard.length>24||s.deck.some(id=>!cardIds.has(id))||s.discard.some(id=>!cardIds.has(id)))return false;
 if(!Array.isArray(s.log)||s.log.length>90||s.log.some(e=>!plain(e)||!num(e.turn,1,10000000)||!txt(e.text,2000)||!txt(e.kind,30)))return false;
 if(!Array.isArray(s.encounterChoices)||s.encounterChoices.length>300||s.encounterChoices.some(x=>!txt(x,100))||!Array.isArray(s.encounterPool)||s.encounterPool.length>30||s.encounterPool.some(x=>!txt(x,100))||!Array.isArray(s.storyBeats)||s.storyBeats.length>20||s.storyBeats.some(x=>!txt(x,100))||!Array.isArray(s.blessings)||s.blessings.length>30||s.blessings.some(x=>!txt(x,100)))return false;
 if(s.lastEvent!==null&&(!plain(s.lastEvent)||!cardIds.has(s.lastEvent.id)||!txt(s.lastEvent.name,200)||!txt(s.lastEvent.flavor,1000)||!txt(s.lastEvent.type,50)||!txt(s.lastEvent.art,50)||s.lastEvent.applied!==undefined&&!txt(s.lastEvent.applied,300)||s.lastEvent.turn!==undefined&&!num(s.lastEvent.turn,1,10000000)))return false;
 if(s.lastRoll!==null&&(!plain(s.lastRoll)||!num(s.lastRoll.value,1,6)||!bool(s.lastRoll.hit)||!bool(s.lastRoll.crit)||!['axe','shotgun'].includes(s.lastRoll.weapon)||!num(s.lastRoll.damage,0,100)))return false;
 if(s.pendingChoice!==null&&!ALL_ENCOUNTERS.some(x=>x.id===s.pendingChoice))return false;
 if(s.objectiveCount>currentObjective(s).target||s.killedStalkers>s.kills)return false;
 return true;
}
function upgradeV3(old){if(!old||old.version!==3)return null;const s=createGame(old.chapter,old.rng,{survivor:'scout',difficulty:'normal'});
 // Mantener recursos, progreso y tablero, añadir objetivos v1.0 repartidos en salas nuevas.
 for(const key of ['turn','ap','pos','hp','sanity','ammo','medkits','wards','doom','seals','totalSeals','nextId','bossSummoned','bossKilled','ended','won','lastEvent','lastRoll','lastAction'])if(old[key]!==undefined)s[key]=old[key];
 for(const key of ['sealSpots','sealed','revealed','searched','enemies','deck','discard','log','cursed'])if(Array.isArray(old[key]))s[key]=JSON.parse(JSON.stringify(old[key]));
 const pool=shuffle(s,Array.from({length:25},(_,i)=>i).filter(i=>i!==ENTRANCE&&!s.sealSpots.includes(i)));
 s.objectiveSpots=['relic','repair','radio','purify'].includes(currentObjective(s).type)?pool.slice(0,currentObjective(s).target):[];
 s.encounterSpots=pool.filter(i=>!s.objectiveSpots.includes(i)).slice(0,4);s.encounterPool=shuffle(s,ENCOUNTERS.map(e=>e.id));
 // Si la partida v0.3 ya terminó, conservar victoria. Si estaban completados los sellos, el nuevo objetivo se considera resuelto.
 s.totalSeals=s.seals;if(s.seals===currentChapter(s).seals&&s.seals>0)s.objectiveCount=currentObjective(s).target;
 addLog(s,'Partida 0.3 convertida a 1.0. Los objetivos de capítulo adicionales están activos.','help');return validate(s)?s:null}
function migrateLegacy(g){if(!g||g.version!==1||!Number.isInteger(g.pos)||g.pos<0||g.pos>=25||!Array.isArray(g.sealSpots)||g.sealSpots.length!==3||!Array.isArray(g.revealed))return null;
 let s=createGame(1,0x040404);s.turn=Math.max(1,Math.min(999,Number(g.turn)||1));s.pos=g.pos;s.hp=Math.max(0,Math.min(12,Math.floor(Number(g.hp)||0)));s.sanity=Math.max(0,Math.min(10,Math.floor(Number(g.sanity)||0)));s.ammo=Math.max(0,Math.floor(Number(g.ammo)||0));s.ap=Math.max(0,Math.min(3,Math.floor(Number(g.ap)||0)));s.doom=Math.max(0,Math.floor(Number(g.dark)||0));
 s.sealSpots=g.sealSpots.filter(i=>Number.isInteger(i)&&i>=0&&i<25);s.sealed=Array.isArray(g.sealed)?g.sealed.filter(i=>s.sealSpots.includes(i)):[];s.seals=s.sealed.length;s.totalSeals=s.seals;
 s.revealed=[...new Set(g.revealed.filter(i=>Number.isInteger(i)&&i>=0&&i<25).concat([s.pos]))];s.searched=Array.isArray(g.searched)?g.searched.filter(i=>s.revealed.includes(i)):[];
 s.enemies=(Array.isArray(g.enemies)?g.enemies:[]).filter(e=>Number.isInteger(e.pos)&&s.revealed.includes(e.pos)).slice(0,9).map(e=>({id:s.nextId++,type:'possessed',pos:e.pos,hp:Math.max(1,Math.min(2,Math.floor(Number(e.hp)||2)))}));s.ended=Boolean(g.ended);s.won=Boolean(g.won);
 s.objectiveCount=s.seals===3?1:0;s.log=[];addLog(s,'Partida v0.2 importada: posición y recursos conservados.','help');return validate(s)?s:null}
function achievementsFor(s){const found=[];if(s.won&&s.mode==='campaign')found.push('first');if(s.won&&s.chapter===4)found.push('mid');if(s.won&&s.chapter===8)found.push('end');if(s.won&&s.difficulty==='nightmare')found.push('hard');if(s.mode==='endless'&&s.turn>=15)found.push('long');if(s.won&&s.hp>=8)found.push('clean');if(s.encounterChoices.length>=4)found.push('stories');return found}
return {exitBreather,CHAPTER_FINALES,CHAPTER_ECHOES,chapterForecast,VERSION,CHAPTERS,STORY_BEATS,ALL_ENCOUNTERS,ROOM_NAMES,ROOM_TYPES,ENEMY_TYPES,CARDS,SURVIVORS,DIFFICULTIES,ENCOUNTERS,ACHIEVEMENTS,SIDE_OBJECTIVES,ENTRANCE,MAX_HP,MAX_SANITY,SIZE,neighbors,dist,createGame,dispatch,validate,upgradeV3,migrateLegacy,currentChapter,currentObjective,bossThreat,doomLimit,objectivesComplete,hasShot,achievementsFor};
});
