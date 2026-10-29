# DEAD CABIN 404 — Reglamento oficial — edición 1.8

**Título:** La noche del umbral · **Género:** juego de mesa de terror táctico en solitario · **Jugadores:** uno · **Idioma:** español · **Duración orientativa por expediente:** 25–60 minutos, según velocidad, decisiones y dificultad. Esta duración es una estimación de diseño, no un tiempo cronometrado con jugadores.

## 1. Ambientación

Año 1984. La cabaña de Umbral Norte pertenece a un lugar que el bosque mantiene oculto. Las habitaciones no siempre se corresponden con el exterior. Un libro extraño ha desgarrado el límite entre memoria, muerte y materia. Eres un superviviente y debes cerrar las grietas que permiten que la casa te devore.

El juego es original; no usa personajes, diálogos, ilustraciones ni nombres protegidos de Evil Dead. No necesita descargar imágenes ni recursos desde servidores externos.

## 2. Preparación

1. Abre `index.html` (carpeta completa) o `JUGAR-SIN-INSTALAR.html` (archivo único).
2. En **Campaña**, elige un expediente desbloqueado; o en **Infinito**, inicia una partida independiente.
3. Elige personaje y dificultad. Los ocho expedientes se desbloquean en orden; el modo infinito siempre está disponible.
4. Comienzas en la casilla **23, Entrada**, con **3 puntos de acción** y las otras 24 estancias cubiertas.
5. El mapa es una cuadrícula fija de **5 × 5**. Los sellos, las pistas, los encuentros y las cartas se distribuyen con una semilla aleatoria; cada partida puede ser diferente.

### Personajes

| Superviviente | Vida inicial | Cordura inicial | Cartuchos | Botiquines | Talismanes | Bengalas | Habilidad (1 PA, una vez por turno) |
|---|---:|---:|---:|---:|---:|---:|---|
| Alex Morrow — Explorador | 12 | 9 | 5 | 1 | 1 | 1 | **Reconocer:** muestra las cuatro losetas adyacentes que sigan ocultas, sin entrar en ellas. |
| Mara Soler — Sanitaria | 12 | 9 | 3 | 2 | 1 | 1 | **Primeros auxilios:** restaura 2 de vida sin gastar botiquín (solo si te falta vida). |
| Noa Vilar — Ocultista | 10 | 10 | 4 | 1 | 2 | 1 | **Exorcismo:** restaura 1 cordura y reduce 1 oscuridad (solo si puede aportar algún beneficio). |

**Límites generales:** vida máxima de 12 y cordura máxima de 10, aunque el ocultista empieza con 10 de vida. No se recupera vida ni cordura por encima de sus topes. La habilidad no se puede usar dos veces en el mismo turno.

### Dificultad

- **Historia:** +2 cartuchos, +1 botiquín, +1 talismán y +1 bengala iniciales; en turnos pares la oscuridad base no aumenta; los enemigos necesitan 1 punto más en su tirada para impactar; los límites son 4 puntos mayores que en Normal.
- **Supervivencia:** valores de referencia de los capítulos; oscuridad +1 por turno, ataques según ficha.
- **Pesadilla:** −1 cordura inicial, +2 oscuridad inicial, oscuridad base +2 por turno; los enemigos impactan con 1 punto menos en el dado (nunca necesitan menos de 2); límite de oscuridad reducido en 3.

## 3. Fases de juego

### Fase A — Superviviente

Dispones de **3 PA**. Puedes usarlos en cualquier orden. En la mayoría de acciones fallidas (sin recursos, sin objetivo o fuera de alcance) **no se consume PA**. No estás obligado a gastar todos los PA. Usa el botón **Finalizar turno** para iniciar la siguiente fase.

| Acción | Coste y efecto | Requisitos |
|---|---|---|
| Mover | 1 PA; mueve a una loseta arriba, abajo, izquierda o derecha; revela la loseta al pisarla. | No hay movimiento diagonal. |
| Buscar | 1 PA; tira en tabla de botín y marca la habitación como ya registrada. | No se ha buscado antes en ella y no hay enemigo en la sala actual. |
| Investigar | 1 PA; completa una pista de misión, concede recompensa correspondiente. | El símbolo ◇ aparece en la estancia y no hay enemigo presente. |
| Hacha | 1 PA, d6; impacto **4+**; 1 daño, o 2 con crítico (6). | Enemigo en la sala o en una sala adyacente. |
| Escopeta | 1 PA, 1 cartucho, d6; impacto **3+**; 2 daño, o 3 con crítico (6). | Objetivo en tu habitación o a 1–2 losetas en la misma fila o columna; las salas intermedias deben estar reveladas. |
| Sellar grieta | 1 PA; −1 cordura, −3 oscuridad, +55 puntos. | Estar sobre símbolo ✥ activo y sin enemigos en esa habitación. |
| Descansar | 1 PA; +1 cordura. | No estar a cordura máxima; en el capítulo 6 puede fallar con un d6 de 1–3 y provocar +1 oscuridad. |
| Botiquín | 1 PA y 1 botiquín; +4 vida. | No estar a vida máxima. |
| Talismán | 1 PA y 1 talismán; +2 cordura y −2 oscuridad. | Existe algún beneficio posible. |
| Bengala | 1 PA y 1 bengala; revela las cuatro habitaciones adyacentes, aturde por una noche a los enemigos a distancia 0–1 y −1 oscuridad. | Tener al menos 1 bengala. |
| Barricada | 1 PA y 1 chatarra; instala protección de un uso en la sala actual. | Sin enemigos en la sala y sin una barricada previa. |
| Habilidad | 1 PA; efecto distinto según el superviviente. | Una vez por turno y requisitos de la habilidad. |
| Escapar | 0 PA; victoria del expediente o extracción del modo infinito. | Volver a Entrada y cumplir todos los objetivos. |

**Refuerzo improvisado:** al impactar con un arma, si llevas al menos **3 chatarras**, se gastan automáticamente para añadir +1 al daño de ese ataque. No existe botón separado de mejora.

### Fase B — La casa

Cuando finalizas el turno:

1. Aumenta la oscuridad base conforme a la dificultad (Historia alterna 1 y 0; Normal +1; Pesadilla +2).
2. Roba **una carta** del mazo. Puede alterar salud, cordura, oscuridad, recursos o aparición de enemigos.
3. En cada tercer turno (`3, 6, 9, ...`) aparece un enemigo adicional. Determinados capítulos convocan más monstruos.
4. Se activan las reglas exclusivas del expediente, que pueden provocar más oscuridad, corrupción o ataques a la mente.
5. Cada enemigo vivo mueve hacia el superviviente, ataca si comparte habitación, y lanza un dado de seis caras. Si tiene éxito, causa daño según su tipo.
6. Comprueba las condiciones de derrota y, si sigues vivo, avanza el contador de turnos y recupera 3 PA.

**Mazo:** 24 cartas diferentes; una carta no vuelve a aparecer hasta agotar el mazo y barajarlo de nuevo. Algunos eventos son positivos, otros peligrosos.

**Apariciones:** los monstruos suelen aparecer en salas ya reveladas, fuera de tu ubicación si es posible. Hasta diez enemigos pueden permanecer simultáneamente en el tablero; si la casa intenta superar ese máximo, el nuevo monstruo no aparece.

## 4. Enemigos

| Tipo | Vida | Movimiento | Impacta d6 | Efecto al acertar |
|---|---:|---:|---:|---|
| Poseído | 2 | 1 habitación | 4+ | 1 vida |
| Acechador | 2 | 2 habitaciones | 4+ | 1 vida |
| Abominación | 4 | 1 habitación | 4+ | 2 vidas |
| Espectro | 3 | Se desplaza por salas reveladas ignorando paredes | 4+ | 2 cordura |
| Parásito | 1 | 1 habitación | 5+ | 1 vida y +2 oscuridad |
| Guardián (capítulo 4) | 8 | 1; 2 cuando pierde la mitad | 3+ | 2 vidas |
| Corazón de la casa (capítulo 8) | 9 | 1; 2 cuando pierde la mitad | 4+ | 1 vida y 1 cordura |

En Historia todos necesitan un punto más para acertar; en Pesadilla uno menos, mínimo 2. Los enemigos avanzan por habitaciones ya descubiertas, salvo el Espectro, que puede reposicionarse hacia el jugador atravesando salas reveladas no contiguas. Si una barricada está en su camino, la destruyen y pierden ese ataque y el resto de su movimiento de esta fase. Los monstruos aturdidos por bengala no actúan en la siguiente fase enemiga del mismo turno.

## 5. Pistas narrativas y decisiones

Además de las **dos escenas únicas que articulan cada capítulo** (desencadenadas con el primer cierre y al completar la misión especial), hay **cuatro habitaciones con encuentros ocultos** por partida. Al entrar por primera vez en una de ellas aparece un diálogo de dos opciones. La elección es obligatoria para continuar y afecta recursos y/o peligro. No cuesta PA extra, pero puede hacer avanzar la oscuridad o despertar un enemigo. Puedes observar efectos en la crónica y el inventario. Los encuentros no se repiten durante la misma partida.

Incluye ocho encuentros diferentes: teléfono desconectado, espejo velado, canción del pasillo, trampilla tibia, visitante, margen escrito, escalones imposibles y círculo de ceniza. La partida suele mostrar cuatro distintos, escogidos aleatoriamente, más los dos episodios exclusivos del capítulo si alcanzas sus desencadenantes. El número de encuentros resueltos puede afectar al epílogo y desbloquear una insignia.

## 6. Los ocho expedientes

Todos empiezan en Entrada, requieren cerrar grietas y completar la misión específica. Los objetivos especiales se identifican con **◇** en las losetas exploradas y se resuelven usando **Investigar**, salvo las misiones de eliminar enemigos o derrotar jefes.

| Nº | Nombre | Grietas | Oscuridad Normal | Misión exclusiva y cambio de reglas |
|---:|---|---:|---:|---|
| 1 | El libro que respira | 3 | 26 | Recupera **1 página perdida**; introducción al ritual. |
| 2 | La tormenta negra | 3 | 28 | Repara **2 pararrayos**; mientras no estén reparados, la tormenta suma +2 oscuridad cada tres turnos. |
| 3 | Los que arañan | 3 | 29 | Elimina **3 acechadores**; aparecen acechadores adicionales cada tres turnos. |
| 4 | El guardián del sótano | 3 | 31 | Al cerrar la última grieta aparece **el Guardián**. Derrótalo. |
| 5 | La casa imposible | 3 | 31 | Purifica **2 espacios marcados**; una habitación revelada queda maldita cada tres turnos. |
| 6 | El eco del silencio | 3 | 32 | Recupera **3 fragmentos de radio**; descansar puede fallar y el silencio daña la cordura cada cuatro turnos. |
| 7 | Cuatro nombres | 4 | 34 | Recoge **2 reliquias**; una voz roba 1 cordura cada cuatro turnos. |
| 8 | El corazón de la cabaña | 4 | 38 | Derrota al **Corazón** tras cerrar las grietas; suma oscuridad adicional cada tres turnos. |

Tras completar un capítulo con vida se desbloquea el siguiente. El capítulo 8 completa la historia y permite repetir con otros personajes/dificultades. Los personajes no se pierden permanentemente al morir. Cada victoria tiene un epílogo condicionado por las elecciones y la cordura final.

## 7. Modo Supervivencia infinita

Es independiente de la campaña. Aparecen **4 grietas activas**; tras cerrar las cuatro, se seleccionan otras cuatro, incluso en habitaciones conocidas. Puedes seguir sellando indefinidamente, pero también crece la dificultad por enemigos y eventos. A partir del **turno 12**, si estás en Entrada puedes pulsar **Escapar** para registrar una **extracción victoriosa**. Si no sales, la partida continúa hasta que ganes tiempo o mueras.

**Puntuación:** se obtienen puntos por exploración, búsquedas, objetivos, decisiones, bajas, cierres de grietas y turnos sobrevividos; al terminar se suman bonificaciones por recursos vitales, supervivencia y estado de la casa. No hay clasificación en línea; los récords quedan en el navegador.

## 8. Derrota, victoria y logros

**Derrota inmediata:** salud ≤0, cordura ≤0 o oscuridad en/por encima del límite del expediente. Esto se comprueba tras los efectos que pueden provocar daño. No existe muerte permanente, pero termina la partida activa.

**Victoria de campaña:** todas las grietas selladas, misión exclusiva completada, jefe eliminado cuando corresponde y vuelta a Entrada. Una victoria en Pesadilla puede conceder un logro distinto.

**Logros:** primera victoria, capítulo 4, capítulo 8, victoria en Pesadilla, turno 15 infinito, victoria con al menos 8 de vida y cuatro elecciones narrativas en una partida.

## 9. Controles y accesibilidad

- Ratón/táctil: pulsa una habitación ortogonal adyacente, botones de acción e inventario; para atacar, selecciona arma y luego loseta roja de enemigo.
- Teclado: flechas o WASD para caminar, E para terminar turno, 1 buscar, 2 descansar, 3 sellar, 4 botiquín, Esc para cerrar modal o cancelar selección.
- Contrastes de estado, etiquetas accesibles en botones, focus visible y diseños para pantalla estrecha. Las animaciones se reducen al detectar `prefers-reduced-motion`.
- El sonido ambiental y los efectos están desactivados por defecto y se activan manualmente.

## 10. Guardado, privacidad y limitaciones

La partida se guarda automáticamente tras cada acción y puede guardarse/restaurarse manualmente. Se conserva solo **una ranura de partida activa** por navegador y origen. El progreso de campaña y estadísticas también se almacenan en `localStorage`. No hay backend, cuentas, seguimiento, publicidad ni telemetría. El botón de reinicio reinicia la partida, no los logros.

Existe un importador de partidas v0.3 y v0.1–0.2 en el mismo origen, con conversión de recursos y objetivos. El archivo único funciona sin instalación; si abres el juego mediante `file://`, algunos navegadores pueden tratar el guardado como almacenamiento efímero o aislarlo por archivo. Para persistencia más fiable, usa un servidor estático o GitHub Pages.

**Nota de equilibrio:** las reglas están cubiertas por pruebas técnicas y simulaciones automáticas, pero no hay evidencia de una campaña completa probada manualmente por jugadores humanos, ni verificación física en Safari iOS. El modo Pesadilla y los capítulos finales están diseñados para ser difíciles. Antes de una publicación comercial debería hacerse una ronda de pruebas externas de balance y accesibilidad.


## Edición cinematográfica 1.8

Ocho ilustraciones SVG originales aparecen al comenzar cada capítulo y en la galería. Los impactos, fallos y sellos muestran breves avisos que no bloquean controles. El botón **EFECTOS ON/OFF** desactiva animaciones y guarda la preferencia localmente. Para el proyecto modular, usa **INICIAR-WINDOWS.bat** o **INICIAR-LINUX.sh** (requieren Python 3) y el juego abrirá en un servidor privado `127.0.0.1`. El sonido sigue siendo opcional. No cambian reglas, victorias ni guardados.