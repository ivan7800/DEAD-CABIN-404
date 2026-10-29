# DEAD CABIN 404 — Edición táctica 2.0 (candidate)

**Esta versión es una primera iteración de la 2.0, NO una certificación artística 9,5/10.**

## Cambios nuevos

- Acción táctica **DEFENDER**: consume 1 PA, bloquea parcialmente el primer golpe recibido durante la siguiente fase enemiga. No se puede acumular.
- **Golpes rituales de jefes**: cada tercer turno los jefes hacen +1 daño si impactan, con advertencia en el estado del juego.
- **Tutorial interactivo**: cuatro etapas explicativas y entrenamiento de dificultad Historia con objetivos guiados por mensajes.
- Interfaz de tablero con mayor contraste y estados de defensa.
- Se mantiene la versión 4 de guardados: los archivos anteriores sin `guard` son aceptados.
- PWA con caché `dead-cabin-404-v2-0-0` y HTML completamente autónomo.

## Pruebas

`npm test` — 42 pruebas Node; `python3 tests/browser_smoke.py` — Chromium escritorio y móvil emulado; `python3 tests/test_launcher.py` — comprobación HTTP local.

## Para jugar

Abre `JUGAR-SIN-INSTALAR.html` directamente o usa `INICIAR-WINDOWS.bat` / `INICIAR-LINUX.sh` (Python 3). No incluye servicios remotos ni telemetría.

## Limitaciones importantes

Es una primera iteración táctica; no incluye minijuegos de puzles nuevos, jefes con múltiples animaciones específicas ni un rediseño fotorrealista de alta resolución. Faltan sesiones humanas completas para valorar dificultad y diversión, prueba física en iOS y auditoría integral de accesibilidad.

---

# DEAD CABIN 404 — La noche del umbral

**Versión 1.8.0 · Edición Cinematográfica · Edición digital solitaria · Juego original de terror táctico · En español**

Un juego de mesa digital completo de un jugador ambientado en una cabaña imposible: tablero modular ilustrado, habitaciones ocultas, 24 cartas de acontecimientos, 7 tipos de enemigo, dados d6, gestión de recursos, 8 expedientes de campaña, encuentros de dos decisiones, modo supervivencia y logros.

## Jugar inmediatamente

- **Solo un archivo:** abre `JUGAR-SIN-INSTALAR.html`. Incluye interfaz, motor de juego, cartas, ilustraciones y audio en un HTML. No necesitas instalar nada. También se entrega como `DEAD-CABIN-404-v1.8-JUGAR.html` fuera del ZIP.
- **Proyecto modular:** descomprime el ZIP completo y abre `index.html` (conservando las carpetas `css`, `js`, `assets`). Si tu navegador restringe el guardado desde `file://`, usa el servidor opcional.
- **Windows:** doble clic en `INICIAR-WINDOWS.bat`; requiere Python 3, no necesita permisos de administrador.
- **Linux:** `chmod +x INICIAR-LINUX.sh && ./INICIAR-LINUX.sh`; requiere Python 3.
- **Servidor local alternativo:** `python3 scripts/serve-local.py` abre el navegador y asigna automáticamente un puerto libre en `127.0.0.1`. Puedes cerrar con `Ctrl+C`.
- **Instalación PWA y sin conexión:** mediante HTTPS o localhost el sitio registra un *service worker* con recursos locales y puede funcionar sin conexión tras la primera carga. El archivo único no necesita PWA.

## Contenido del juego y novedades visuales de la edición 1.8

- **3 supervivientes** con equipamiento inicial y habilidad individual: Alex (reconocer), Mara (primeros auxilios), Noa (exorcismo).
- **3 dificultades**: Historia, Supervivencia y Pesadilla.
- **8 expedientes** con condiciones propias: reliquias, clima, cacería de acechadores, jefes, habitaciones malditas, radio, rituales y Corazón final.
- **25 habitaciones** con ilustraciones SVG originales generadas localmente, niebla de guerra, fichas, grietas, barricadas y pistas.
- **24 acontecimientos diferentes** barajados sin repetir hasta vaciar el mazo, y **24 escenas** narrativas de dos opciones (cuatro ocultas por partida).
- **7 fichas de enemigo:** poseído, acechador, abominación, espectro, parásito, Guardián y Corazón.
- **12 acciones/contextos** incluyendo combate d6, refuerzo con chatarra, bengalas, barricadas, investigación, habilidades, objetos y rituales.
- **Modo infinito con extracción** a partir del turno 12, puntuación, 7 logros y estadísticas persistentes.
- **Guardado local automático**, migración 0.3 y antiguas v0.1–0.2, controles de teclado/táctiles, animaciones de dados, efectos opcionales Web Audio sintetizados, diseño adaptable y preferencia de movimiento reducido.

- **Nuevo en 1.8:** ocho ilustraciones cinematográficas exclusivas (introducción, selección de capítulos y desenlace), respuesta visual instantánea a ataques/rituales, botón para desactivar animaciones y corrección de un bloqueo del jefe con el cupo de enemigos completo.

Para reglas completas, consulta [MANUAL.md](MANUAL.md). No son necesarias cuentas, bibliotecas externas, anuncios ni peticiones a servidores de terceros.

## Arquitectura

```text
index.html                 Estructura de la aplicación estática y acceso PWA
JUGAR-SIN-INSTALAR.html    Build autocontenido (generado)
manifest.webmanifest       Metadatos de instalación PWA
sw.js                      Recursos locales almacenados offline con caché versionada
assets/icon.svg            Icono vectorial original
css/style.css              Diseño editorial, tablero, controles y responsive
css/edition18.css          Nuevas escenas, feedback y accesibilidad
js/chapter-art.js          Ocho ilustraciones cinematográficas SVG originales
js/feedback.js             Efectos de ataque, ritual y preferencias persistentes
js/engine.js               Reglas puras, RNG determinista, IA, campaña, escenas, validación, migración
js/art.js                  Arte SVG procedimental, ilustraciones de carta, retratos
js/audio.js                Efectos Web Audio opcionales y ambiente sintetizado
js/app.js                  DOM, controles, campaña, modales, guardado, logros y estadística
scripts/build-single.js    Empaquetador autocontenido basado solo en Node.js
MANUAL.md                  Manual completo y reglas oficiales
QA.md                      Matriz de validaciones, alcances y límites
CHANGELOG.md               Evolución de 0.3 a 1.8
LICENSE                    MIT
.github/workflows/pages.yml  Tests Node y despliegue opcional a GitHub Pages
tests/engine.test.js       Pruebas Node (incluye 100 partidas de estrés y jefes en tablero lleno)
tests/edition18.test.js    Pruebas visuales estáticas y de PWA
tests/test_launcher.py     Smoke real del servidor Windows/Linux
tests/browser_smoke.py     Playwright/Chromium: UX, combate, guardados, opciones y móvil
```

## Desarrollo, pruebas y distribución

Con Node.js 20 o posterior (solo para desarrollo, no para jugar):

```bash
npm test
npm run build:single
npm run serve
```

Si Playwright para Python y Chromium están instalados, ejecuta:

```bash
python3 tests/browser_smoke.py
python3 tests/test_launcher.py
```

La prueba UI incluye inyección local del HTML debido a las restricciones de URL del entorno original; no demuestra que un GitHub Pages público esté desplegado. El test del motor usa Node.js estándar y no requiere paquetes externos.

Para publicar en GitHub Pages, sube **el contenido de esta carpeta** a la raíz de un repositorio y configura `Settings → Pages → Source: GitHub Actions`. El workflow ejecuta `npm test`, genera el HTML único y publica solo si esos pasos terminan correctamente. Para el repositorio oficial `ivan7800/DEAD-CABIN-404` el despliegue debe verificarse por ejecución en GitHub Actions.

## Privacidad y guardados

Todo es local. Usa `localStorage` con claves `dead-cabin-404-v4` (partida), `dead-cabin-404-campaign-v3` (desbloqueo, conservada para migraciones) y `dead-cabin-404-records-v4` (récords). No envía datos a la red. Existe una ranura de partida activa por navegador/origen; cambiar de modo sustituye la partida activa, aunque conserva campaña y logros.

## Dirección visual y derechos

Arte SVG ilustrado original y tablero de estética **terror gótico ochentero / juego físico premium**, sin descargar imágenes con derechos de terceros. El código se entrega con licencia MIT. No contiene materiales de Evil Dead ni es una adaptación oficial. El diseño es **2D vectorial**, no fotografía, miniaturas 3D ni un título con producción AAA.

## Limitaciones honestas

El motor y la UI se han probado automáticamente en Chromium, pero no hay pruebas de usuario final a lo largo de los ocho expedientes, ni certificación de compatibilidad de Safari iOS o auditoría externa de accesibilidad. El equilibrio y el contenido narrativo pueden ampliarse. La etiqueta 1.0 significa que el conjunto de sistemas y escenarios definido para este lanzamiento está implementado; no garantiza ausencia de errores ni calidad comercial validada por jugadores.

### Actualización 1.7 · La cabaña cobra vida

La edición Premium 1.7 presenta miniaturas SVG originales con relieve 2.5D, las 25 habitaciones diferenciadas por marcas, sangre, moho, runas, grietas y luces, una ventana de exploración con vista ampliada y un nuevo sistema de audio procedural dinámico. Se mantienen las reglas, las partidas y los 8 expedientes de la edición 1.0.

**Audio**: comienza silenciado; actívalo con SONIDO. Sintetiza drones, viento y efectos en Web Audio; no reproduce grabaciones ni necesita internet.

**Calidad**: es una versión jugable y probada automáticamente, no un juego comercial con pruebas de aceptación completas. La representación de miniaturas es **2.5D vectorial**, no 3D real. Navegación de Safari en dispositivos físicos y balance humano todavía por verificar.

Para validar localmente: `npm test`, `python3 tests/browser_smoke.py
python3 tests/test_launcher.py` (requiere Chromium y Playwright) y `npm run build:single`.

## Evidencia específica de 1.8

- Suite Node: **38 pruebas**, incluidas ocho rutas sintéticas de victoria (no equivalen a ocho partidas humanas completas).
- Chromium: pruebas de interfaz en escritorio y pantallas táctiles simuladas de 390/320 px; cero errores JavaScript observados.
- Lanzador Python: recurso HTTP servido en `127.0.0.1` y recursos 1.8 comprobados.
- HTML independiente: probado mediante `page.set_content`; navegación directa `file://` está restringida en este entorno, no ha podido verificarse ese protocolo.
- La experiencia gráfica es **2D/SVG escalable con apariencia 2.5D**, no modelos 3D ni fondos prerenderizados fotorrealistas.
- No se ha completado un test humano integral de los ocho capítulos ni un estudio de equilibrio por cohorte.
