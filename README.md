## v2.10.1 — Comparación reproducible de estrategias

Se incorpora `npm run audit:strategy` para contrastar una política táctica conservadora con la anterior en las mismas 108 campañas. Pesadilla mejora de 2/36 a 3/36 en este banco de pruebas, mientras el total de campañas completas permanece 29/108. Ver `QA-ESTRATEGIA-v2.10.1.md`. No implica certificación de equilibrio ni sustituye partidas humanas.

## Candidata v2.10 — Contrajuego de recursos y combates

En Pesadilla de campaña, los talismanes reducen hasta 4 puntos de oscuridad (en otras dificultades siguen reduciendo 2), y cada segunda criatura derrotada reduce hasta 3 puntos adicionales. El cambio ofrece alternativas tácticas a limitarse a sobrevivir turnos, sin alterar el formato de guardado v4. Las campañas heurísticas terminadas permanecen en 2/36 Pesadilla, pero los episodios alcanzados suben de 115 a 131 en las mismas 36 campañas. No equivale a validación humana.

## Candidata v2.9 — Calibración de la oscuridad en Pesadilla

En campaña Pesadilla, el avance base de oscuridad se reduce en uno los turnos pares. El resto de mecánicas y los guardados v4 no cambian. Las 108 campañas heurísticas pasan de 27 a 29 victorias, pero **Pesadilla continúa muy difícil (2/36)**. Consultar `AUDITORIA-PESADILLA-v2.9.md`.

## Candidata v2.8 — Equilibrio final y campaña encadenada

Ajustes de contrajuego para el Corazón y prueba reproducible de ocho capítulos encadenados. No es una certificación de partidas humanas; ver `QA.md` y `scripts/audit-chain.js`.

## Estado candidato 2.7 — Revisión de ritmo de campaña

Revisadas 1.152 simulaciones de los ocho capítulos. En 5, 7 y 8 se reduce puntualmente el avance base de oscuridad durante el regreso a la salida tras cumplir objetivos, sin alterar eventos ni combates. Consulta `AUDITORIA-CAMPANA-v2.7.md`.

> **v2.5 candidata:** Cada expediente presenta una resonancia propia al elegir la primera opción de su primer encuentro especial. El efecto aparece antes de elegir y se muestra mientras sigue activo en el informe táctico. La segunda opción conserva sus recompensas habituales.

## Novedades v2.4 (candidata local)

Cada uno de los ocho capítulos presenta un pronóstico táctico dinámico, indicando amenazas, ritmo de peligro y contramedidas. Las investigaciones de los capítulos 1 y 6 y el ritual del capítulo 7 cuentan con recompensas propias. Se conserva el formato de guardado v4.

# DEAD CABIN 404 — Premium Táctica 2.3

**Juego de mesa táctico de terror para un jugador, original y totalmente local.** Ocho capítulos, tres supervivientes, tres dificultades, 25 salas, 24 cartas de acontecimiento, 7 variantes de enemigo, modo infinito, encuentros narrativos y progreso guardado.

## Qué cambia en 2.3 — Estabilidad y experiencia real

- **Importación protegida:** validación profunda de los datos del guardado (incluidos eventos, enemigos, resultados del dado y registro de sucesos), restauración provisional en memoria y guardado solo si se puede representar sin errores. Rechaza archivos corruptos sin sustituir una partida válida. Se conserva el **formato v4**; no es necesario empezar de cero.
- **Cartas sinceras:** el efecto comunicado corresponde a la variación de recursos realmente aplicada: por ejemplo, si la cordura está al máximo indica «Sin efecto» y si el tablero está lleno no anuncia criaturas que no aparecen.
- **Panel móvil táctico cerca del tablero:** muestra salud, cordura, oscuridad, PA y el estado de la casilla. Incluye Sellar, Investigar, Escapar, Curar, Talismán, Habilidad, Bengala y acceso a todas las acciones. Todos los botones habilitan/deshabilitan con el motor.
- **Ajustes prudentes de balance:** acechadores del capítulo 3 cada cinco turnos (antes cuatro); el capítulo 8 concede un margen moderado de oscuridad y reduce los aumentos ambientales adicionales. No altera jefes ni objetivos narrativos.
- **Pruebas:** 60 pruebas Node (incluidos 100 guardados mutados), navegador Chromium 320/390, importación corrupta/legítima, lanzadores y 1.152 simulaciones heurísticas. Estas últimas pasaron de 735 a 761 victorias frente a la base auditada, sin acciones inválidas. No equivalen a sesiones de usuarios humanos.

## Mejoras heredadas de 2.2

- **Jefes con dos fases diferentes:** el Guardián hace barridos a salas contiguas; el Corazón emite un pulso radial de cordura y oscuridad. En fase II son más peligrosos. El panel de estado muestra salud, fase, próximo ritual y ventana de vulnerabilidad (+1 daño al acertar tras cada ritual).
- **Misión 5 corregida:** los dos objetivos de purificación son habitaciones malditas desde el inicio, aunque no se revelan antes de explorarlas. Las partidas 2.1 cargadas siguen siendo compatibles y se corrigen al entrar a la sala pendiente.
- **Equilibrio:** la probabilidad de una aparición espontánea al explorar baja de 17 % a 13 %; los cazadores extra del capítulo 3 se convocan cada cuatro turnos (además de las apariciones normales) y durante un combate contra jefe no aparece el refuerzo periódico genérico. El mazo de 24 cartas no cambia.
- **Seguridad del guardado:** Exportar/Importar JSON de progreso local con comprobación de estado, límite de 1 MB y confirmación antes de sustituir la partida activa. El formato interno de partida sigue siendo **v4**.
- **PWA:** navegación con prioridad a red y fallback offline; la galería de cartas se almacena en caché.
- **QA:** 55 pruebas Node, Chromium de escritorio y móvil (320/390px), exportación/importación real, 192 simulaciones heurísticas con acciones reales del motor, lanzadores y HTML único comprobados. No equivale a ocho sesiones humanas.

## Mejoras heredadas de 2.1

- **24 acontecimientos rediseñados** con 24 ilustraciones SVG propias. Una carta tiene categoría, nombre, texto narrativo y **efecto mecánico explícito**, calculado desde el catálogo real del motor (sin alterar reglas o datos guardados).
- **Nueva composición de carta** con ilustración amplia, estructura flexible, pie legible y marcos diferenciados para amenaza, perturbación, alivio y suministros.
- **Acciones agrupadas por combate, exploración y ritual**, con Defender destacado cuando se aproxima el ataque ritual de un jefe.
- **Inventario rediseñado** en tarjetas con iconografía, cantidades y explicaciones legibles.
- **Cabecera reorganizada**: modos de juego, asistencia y preferencias agrupados.
- **Móvil**: objetivos por delante de la crónica y una barra de 4 acciones rápidas (atacar con hacha, buscar, defender, finalizar turno). Los controles completos siguen disponibles al desplazarse.
- Conserva las 8 misiones, la IA, el combate, los 24 efectos reales, los guardados del motor **v4**, el entrenamiento y los lanzadores Windows/Linux.

## Jugar

1. **Sin instalar:** abre `JUGAR-SIN-INSTALAR.html` en un navegador. Es un único archivo con CSS, SVG y JS incluidos. El guardado en `file://` puede variar según el navegador.
2. **Windows:** ejecuta `INICIAR-WINDOWS.bat`, con Python 3 instalado.
3. **Linux Mint / Linux:** ejecuta `chmod +x INICIAR-LINUX.sh && ./INICIAR-LINUX.sh`, con Python 3 instalado.
4. **Servidor:** `python3 scripts/serve-local.py` sirve solo en `127.0.0.1` sobre un puerto libre. El sitio modular también puede publicarse en GitHub Pages mediante HTTPS.

El audio está desactivado inicialmente. No hay publicidad, analítica, cuentas, APIs externas, imágenes descargadas ni dependencias npm de ejecución.

## Modo de juego

Tienes 3 PA por turno. Muévete por el mapa de 5 × 5, investiga, cierra las grietas y cumple el objetivo particular de cada capítulo para regresar a la Entrada. La fase del mal roba una carta, aumenta la presión y resuelve enemigos. Las cartas ahora explican su efecto, además de su relato.

La sección **Tutorial** incluye un entrenamiento guiado; el **Reglamento** y `MANUAL.md` documentan acciones, enemigos, capítulos y dificultades. El botón **Defender** consume 1 PA y mitiga el siguiente ataque enemigo; el Guardián y el Corazón tienen rituales distintos cada tercera noche y quedan expuestos después de ejecutarlos.

## Arquitectura

| Archivo/carpeta | Función |
|---|---|
| `index.html` | Semántica UI, navegación, mapa, paneles y PWA |
| `js/engine.js` | Motor determinista con estado, RNG, reglas, validación y migración |
| `js/app.js` | Controlador de UI, teclado, táctil, guardado y progreso |
| `js/card-ui.js` | Clasificación, efectos mecánicos y 24 ilustraciones de carta SVG **sin modificar el motor** |
| `js/art.js`, `js/premium-art.js`, `js/chapter-art.js` | Arte original de salas, miniaturas y ocho capítulos |
| `js/audio.js`, `js/feedback.js`, `js/cinematic.js` | Audio y FX opcionales |
| `css/edition21.css`, `css/edition22.css` | Rediseño de cartas/interfaz y panel de fase/telemetría de jefes |
| `css/style.css` y capas `premium`, `cinematic`, `illustration`, `edition18`, `edition20` | Estilos heredados y gráficos |
| `sw.js`, `manifest.webmanifest`, `assets/` | PWA offline e iconos |
| `scripts/balance-sim.js` | Ejecuta una campaña heurística de 192 casos: no mide satisfacción humana |
| `scripts/build-single.js` | Genera `JUGAR-SIN-INSTALAR.html` y exportación independiente |
| `scripts/serve-local.py`, `INICIAR-*.bat/sh` | Lanzadores locales |
| `tests/` | Suite Node, pruebas Chromium, prueba del lanzador y galería artística |

## Pruebas reproducibles

```bash
npm test
npm run build:single
python3 tests/test_launcher.py
python3 tests/browser_smoke.py
python3 tests/render_card_gallery.py
python3 tests/test_gallery.py
node scripts/balance-sim.js
```

Las pruebas de navegador requieren Playwright Python y Chromium. El paquete no los instala ni los necesita para jugar. Abre `CARTAS-24.html` para inspeccionar y filtrar todas las cartas; `tests/cards-24-gallery.png` es una captura de QA que puedes regenerar.

## Limitaciones verificadas

- No hemos realizado todavía ocho partidas humanas completas ni pruebas de equilibrio con público.
- El test automático con Playwright carga e inyecta módulos en Chromium en este entorno; por sí solo **no certifica** Safari ni la instalación real en todos los dispositivos.
- La versión 2.2 mejora cartas, usabilidad y tácticas de jefes, pero **no convierte** los SVG en arte hiperrealista o modelos 3D.
- La barra rápida móvil comparte el estado de las acciones normales; no añade nuevas mecánicas.

Proyecto original. **Licencia MIT** en `LICENSE`. Para cambios por versión, véase `CHANGELOG.md`. Para evidencia y pruebas pendientes, véase `QA.md`.

## Novedades v2.6 — Desenlaces de los ocho capítulos

Después de cerrar todas las grietas, completar el objetivo y regresar a **Entrada**, pulsa **ESCAPAR** para abrir el desenlace único de tu capítulo. Elige una de las dos salidas narrativas y pulsa **ESCAPAR** de nuevo para completar la expedición. La decisión final no consume puntos de acción.

Las siete primeras expediciones pueden legar una pequeña ventaja material a la siguiente (un talismán, munición, un botiquín o una bengala); se transfiere únicamente mediante el botón **SIGUIENTE CAPÍTULO**. Se conserva el guardado v4: una partida guardada en una versión anterior sigue siendo válida. La escena final del capítulo 8 permite cerrar el libro o dejar la última página en blanco.
