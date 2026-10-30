## 2.10.1 — Pruebas de estrategia y comparativa de campañas
- Comparación reproducible de dos políticas, con las mismas semillas.
- Nueva prueba de integridad de políticas y documento de límites de la simulación.
- Sin cambios en reglas ni en formato de guardado.

## v2.10 — recursos y combate en Pesadilla
- Los talismanes reducen hasta cuatro puntos de oscuridad en Pesadilla de campaña, frente a dos en otras dificultades.
- Cada segunda eliminación de una criatura en Pesadilla de campaña reduce hasta tres puntos de oscuridad, incentivando combatir en vez de únicamente resistir.
- Sin nuevos campos persistentes ni cambios en `VERSION=4`.
- Revisión de equilibrio de las mismas 108 campañas automatizadas: Pesadilla pasa de 115 a 131 episodios alcanzados; las campañas completadas siguen en 2/36.

## v2.9 — calibración conservadora de Pesadilla (candidata)

- Diagnóstico de causa: 30/36 derrotas de Pesadilla procedían de la oscuridad; 16/36 campañas caían en el capítulo 1.
- En modo campaña y dificultad Pesadilla el avance **base** de oscuridad pasa de 2 por turno a 1 en turnos pares, sin cambiar cartas, peligros, eventos ni ataques.
- Misma campaña reproducible: 0/36 → 2/36 campañas completadas en Pesadilla, 81 → 115 episodios visitados. Historia y Normal se mantienen. No equivale a una validación con personas.
- Guardados v4 y lanzadores compatibles.

## v2.8.0 — Equilibrio final y pruebas de campaña

- La acción Defender protege también de +1 oscuridad en el pulso ritual del Corazón, reforzando el contrajuego de la fase II.
- En Pesadilla, la invocación del Corazón entrega un único talismán de emergencia; la dificultad sigue siendo exigente.
- Batería de regresión para defensa ritual, invocación, guardados y simulación de campaña encadenada.
- Caché PWA actualizada a v2.8.0.

## 2.7.0 — Auditoría y ritmo del regreso

- Revisión reproducible de 1.152 partidas sintéticas y contraste con la v2.6.
- Los capítulos 5, 7 y 8 amortiguan una unidad de avance base de oscuridad cada tres turnos una vez completados los objetivos, durante el regreso a la Entrada. No se alteran cartas, combates ni fases de jefes.
- Previsión táctica contextual y cuatro pruebas específicas.
- Guardados v4 conservados.

## 2.5.0 — Consecuencias de los ocho expedientes

- La primera decisión narrativa de cada capítulo puede activar una resonancia táctica única.
- Ocho efectos de un solo uso alteran tormentas, acechadores, jefes, mutaciones, silencio, rituales o pérdida de cordura.
- La alternativa prudente preserva el efecto normal sin otorgar la resonancia.
- La interfaz anticipa el efecto antes de escoger y muestra los ecos activos en el parte táctico.
- Formato v4 preservado; las resonancias usan `blessings`, campo ya existente.
- Nuevas pruebas de cobertura, reconstrucción del HTML independiente y caché de PWA v2.5.

## 2.4.0 · Expedientes diferenciados

- Avisos tácticos dinámicos, específicos de los ocho capítulos, con ventana de riesgo y contramedida.
- Primer expediente: recompensa de cordura al recuperar la página.
- Capítulo 6: la investigación por radio descubre cartuchos adicionales.
- Capítulo 7: alivio de oscuridad al conseguir dos sellos.
- Compatible con partidas v4, sin nuevos campos de guardado.
- Test específico de pronósticos y recompensas; CSS responsive y PWA actualizadas.

## 2.3.0 — Seguridad de partidas, controles móviles y balance (29-10-2026)
- Validación profunda de estados v4: registros de sucesos, enemigos, eventos, dados y límites de recursos.
- Restauración transaccional: primero se valida y renderiza provisionalmente, después se persiste; errores no sustituyen la partida sana.
- Carta de evento: indicador de efecto realmente aplicado y turno en que se reveló, con compatibilidad para cartas guardadas anteriores.
- Panel táctico bajo el tablero (móvil/tableta): vida, cordura, oscuridad, PA, estado contextual, Sellar, Investigar, Escapar, Curar, Talismán, Habilidad, Bengala y Todas.
- Ajuste del capítulo 3 (aparición periódica adicional cada 5 turnos) y del capítulo 8 (margen de oscuridad y menor presión ambiental) sin tocar otros capítulos.
- Tests: 60 Node, 100 estados manipulados rechazados, Chromium 320/390px, importación real corrupta/válida, 1.152 simulaciones (761 victorias frente a 735 en v2.2).
- Conserva partidas antiguas, logros, los ocho capítulos y lanzadores. Sin nuevos mecanismos de monetización, red o cuentas.
- PWA cache v2-3-0. **Pendiente:** partidas humanas de principio a fin y pruebas en iPhone físico, Windows y Linux físicos.

## 2.2.0 — Consolidación táctica y QA ampliado (29-10-2026)
- Guardián: barrido adyacente con tirada cada tercer turno; segunda fase más móvil y peligrosa.
- Corazón: pulso radial cada tercer turno; radio 1 en fase I, radio 2 en fase II; defendiéndose se mitiga el daño mental.
- Ambos jefes quedan expuestos el siguiente turno tras ejecutar un ritual: los impactos del superviviente infligen +1 daño.
- Nuevo panel visible con barras de vida, fase, aviso ritual, contador y debilidad temporal, sin cambiar el formato de guardado (v4).
- Misión del capítulo 5: salas de purificación genuinamente malditas y no reveladas al jugador; compatibilidad con v2.1.
- Menos apariciones espontáneas (13 % en vez de 17 %); invocación adicional de acechadores cada cuatro turnos en el capítulo 3; sin refuerzo periódico genérico durante un encuentro con jefe.
- Exportar e importar partidas JSON con validación y confirmación; no se borra la partida activa si el archivo es inválido.
- Cache PWA v2-2-0, navegación network-first con reserva offline, catálogo de cartas disponible en caché.
- 55 pruebas de Node, Chromium a 1440/390/320 px, importación/exportación, lanzadores y empaquetado independiente.
- Balance exploratorio reproducible: 192 casos de estrategia heurística sin alteración artificial del estado. No sustituye a partidas humanas.

## 2.1.0 — Rediseño de cartas e interfaz (29-10-2026)
- 24 ilustraciones vectoriales originales de cartas, con composiciones específicas para cada evento.
- Efectos del motor mostrados en lenguaje claro y separados del texto de ambientación.
- Categorías y marcos con paleta distinta para amenazas, perturbaciones, auxilios y suministros.
- Carta principal ampliada, nueva proporción de arte, texto más legible y pie flexible.
- Acciones agrupadas en combate/exploración/rituales, Defender con alerta contextual.
- Navegación agrupada, inventario en tarjetas y barra rápida móvil con acciones sincronizadas.
- Objetivos de misión priorizados frente a la crónica en pantallas estrechas.
- Motor, balance, esquema de partidas guardadas v4 y reglas intactos.
- PWA cache v2-1-0, nueva suite de pruebas y catálogo de 24 cartas para revisión visual.

## 2.0.0-candidate — Primera edición táctica
- Acción DEFENDER, 1 PA, guardia no acumulable.
- Golpe ritual del Guardián y el Corazón cada tercer turno con aviso de peligro.
- Tutorial guiado y partida de entrenamiento.
- Mejoras de contraste, UI y entrada por teclado.
- Compatibilidad de guardados v4 y caché PWA versionada.
- 42 tests Node y smoke Chromium escritorio/móvil emulado.
- Pendiente: prueba humana y validación de equilibrio, Safari físico y gráficos de nueva generación.

# Registro de versiones

## 1.8.0 — Expedientes ilustrados y calidad de vida (29-10-2026)
- Ocho láminas de capítulo SVG originales, con escenas distintas de tormenta, sótano, cabaña, ritual y corazón cósmico.
- Galería ilustrada en el selector de ocho capítulos, introducciones y pantalla de resultado.
- Efectos visuales de combate, fallos, rituales y peligro no bloqueantes, con interruptor ON/OFF persistente y respeto a movimiento reducido.
- Corrección de bloqueo crítico: el Guardián y el Corazón pueden entrar aunque haya diez enemigos, sustituyendo a un enemigo menor.
- Lanzadores Windows `.bat` y Linux `.sh`, con servidor Python 3 local sin exposición a la red ni dependencia del puerto 8000.
- PWA actualizada a caché `v1-8-0`; HTML autónomo regenerado y tests de recursos.
- QA: 38 tests Node, Chromium escritorio + móvil 390/320, prueba de servidor HTTP real y apertura del HTML autocontenido mediante inyección local.
- El motor sigue en formato de guardados v4 para compatibilidad con partidas existentes.
- Limitaciones: arte escalable SVG, no fotografía/3D, y pendientes pruebas humanas completas e iOS físico.

## 1.0.0 — Edición definitiva

- Motor actualizado a estado versionado 4 con migración de partidas 0.3 y 0.1–0.2.
- Tres personajes seleccionables y tres dificultades modificando recursos, presión e impactos.
- Ocho misiones de campaña que exigen objetivos propios además de cerrar las grietas.
- Nuevos enemigos Espectro, Parásito y jefe Corazón, más variedad de IA y frenesí.
- Ocho encuentros genéricos y dieciséis escenas exclusivas (dos por capítulo), con elecciones de efectos reales.
- Nuevas acciones: Investigar, Habilidad única, Bengala, Barricada y refuerzo con chatarra.
- Mazo ampliado de 18 a 24 acontecimientos; tableros, iconos y retratos vectoriales distintos.
- Supervivencia infinita de grietas renovables con extracción opcional a partir del turno 12.
- Puntuación, siete logros y récords, con guardado local automático.
- PWA con manifiesto, icono y caché offline, además de HTML realmente autocontenido.
- Suite de 28 pruebas Node, simulación de 100 partidas, humo UI Chromium y comprobaciones a 390 y 320px.
- Manual oficial, README, licencia MIT y workflow de test previo a GitHub Pages.

## 0.3 — La cabaña despierta

- Motor de combate y dados, campaña inicial de ocho capítulos, tablero SVG, 18 cartas, audio opcional y guardado.

## 0.2 — Tablero renovado

- Madera y pergaminos, mejora visual y baraja ampliada.

## 0.1 — Primera versión jugable

- Exploración, turnos, grietas, enemigos básicos, oscuridad, salud, cordura y guardado.

## 1.7.0 — La cabaña cobra vida (29-10-2026)
- 25 salas con envejecimiento original y detalles propios, sin nuevas dependencias.
- 8 miniaturas vectoriales 2.5D (superviviente y 7 tipos de enemigo) sustituyen fichas tipográficas.
- Vista de sala ampliada, con criatura local y avisos de amenaza.
- Banda sonora procedural: viento, graves, crujidos, impactos, efectos espectrales y tensión dinámica. Sonido desactivado por defecto.
- Compatibilidad con configuración de movimiento reducido, táctil y guardados existentes.
- PWA versionada (v1-7-0) y generador HTML sin instalación actualizado.
- QA: 28 pruebas de motor + smoke real Chromium escritorio y móvil 390/320 (auditoría no exhaustiva).
- El arte es SVG con volumen aparente; **no** es 3D ni fotorrealismo prerenderizado.


## v2.6 — Ocho desenlaces con elecciones
- Ocho escenas jugables de salida, una por capítulo, con dos desenlaces cada una.
- El cierre se activa mediante ESCAPAR tras completar el objetivo y llegar a Entrada; una segunda pulsación cierra la expedición.
- Siete desenlaces pueden otorgar recursos concretos en el siguiente capítulo, sin alterar el formato de guardado v4.
- Cierre específico del capítulo 8, con opción de escribir o dejar en blanco la última página.
