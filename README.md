# DEAD CABIN 404 — La noche del umbral

**Versión 1.0.0 · Edición digital solitaria · Juego original de terror táctico · En español**

Un juego de mesa digital completo de un jugador ambientado en una cabaña imposible: tablero modular ilustrado, habitaciones ocultas, 24 cartas de acontecimientos, 7 tipos de enemigo, dados d6, gestión de recursos, 8 expedientes de campaña, encuentros de dos decisiones, modo supervivencia y logros.

## Jugar inmediatamente

- **Solo un archivo:** abre `JUGAR-SIN-INSTALAR.html`. Incluye interfaz, motor de juego, cartas, ilustraciones y audio en un HTML. No necesitas instalar nada. También se entrega como `DEAD-CABIN-404-v1.0-JUGAR.html` fuera del ZIP.
- **Proyecto modular:** descomprime el ZIP completo y abre `index.html` (conservando las carpetas `css`, `js`, `assets`). Si tu navegador restringe el guardado desde `file://`, usa el servidor opcional.
- **Servidor local:** desde esta carpeta, `python -m http.server 8000`; abre `http://localhost:8000`.
- **Instalación PWA y sin conexión:** mediante HTTPS o localhost el sitio registra un *service worker* con recursos locales y puede funcionar sin conexión tras la primera carga. El archivo único no necesita PWA.

## Componentes reales de la edición 1.0

- **3 supervivientes** con equipamiento inicial y habilidad individual: Alex (reconocer), Mara (primeros auxilios), Noa (exorcismo).
- **3 dificultades**: Historia, Supervivencia y Pesadilla.
- **8 expedientes** con condiciones propias: reliquias, clima, cacería de acechadores, jefes, habitaciones malditas, radio, rituales y Corazón final.
- **25 habitaciones** con ilustraciones SVG originales generadas localmente, niebla de guerra, fichas, grietas, barricadas y pistas.
- **24 acontecimientos diferentes** barajados sin repetir hasta vaciar el mazo, y **24 escenas** narrativas de dos opciones (cuatro ocultas por partida).
- **7 fichas de enemigo:** poseído, acechador, abominación, espectro, parásito, Guardián y Corazón.
- **12 acciones/contextos** incluyendo combate d6, refuerzo con chatarra, bengalas, barricadas, investigación, habilidades, objetos y rituales.
- **Modo infinito con extracción** a partir del turno 12, puntuación, 7 logros y estadísticas persistentes.
- **Guardado local automático**, migración 0.3 y antiguas v0.1–0.2, controles de teclado/táctiles, animaciones de dados, efectos opcionales Web Audio sintetizados, diseño adaptable y preferencia de movimiento reducido.

Para reglas completas, consulta [MANUAL.md](MANUAL.md). No son necesarias cuentas, bibliotecas externas, anuncios ni peticiones a servidores de terceros.

## Arquitectura

```text
index.html                 Estructura de la aplicación estática y acceso PWA
JUGAR-SIN-INSTALAR.html    Build autocontenido (generado)
manifest.webmanifest       Metadatos de instalación PWA
sw.js                      Recursos locales almacenados offline con caché versionada
assets/icon.svg            Icono vectorial original
css/style.css              Diseño editorial, tablero, controles y responsive
js/engine.js               Reglas puras, RNG determinista, IA, campaña, escenas, validación, migración
js/art.js                  Arte SVG procedimental, ilustraciones de carta, retratos
js/audio.js                Efectos Web Audio opcionales y ambiente sintetizado
js/app.js                  DOM, controles, campaña, modales, guardado, logros y estadística
scripts/build-single.js    Empaquetador autocontenido basado solo en Node.js
MANUAL.md                  Manual completo y reglas oficiales
QA.md                      Matriz de validaciones, alcances y límites
CHANGELOG.md               Evolución de 0.3 a 1.0
LICENSE                    MIT
.github/workflows/pages.yml  Tests Node y despliegue opcional a GitHub Pages
tests/engine.test.js       28 pruebas Node (más simulación adversarial de 100 partidas)
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
python tests/browser_smoke.py
```

La prueba UI incluye inyección local del HTML debido a las restricciones de URL del entorno original; no demuestra que un GitHub Pages público esté desplegado. El test del motor usa Node.js estándar y no requiere paquetes externos.

Para publicar en GitHub Pages, sube **el contenido de esta carpeta** a la raíz de un repositorio y configura `Settings → Pages → Source: GitHub Actions`. El workflow ejecuta `npm test`, genera el HTML único y publica solo si esos pasos terminan correctamente. **No se ha creado ni publicado automáticamente un repositorio desde este paquete.**

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

Para validar localmente: `npm test`, `python tests/browser_smoke.py` (requiere Chromium y Playwright) y `npm run build:single`.
