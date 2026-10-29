# QA — DEAD CABIN 404 Premium UX 2.1

## Alcance y resultados de la entrega

| Área | Procedimiento | Resultado |
|---|---|---|
| Motor + UI estática | `npm test` (Node 22; suite engine, assets, edition 1.8/2.0/2.1) | 47/47 aprobadas |
| 24 cartas | Validación de 24 IDs, textos de efecto, categoría, icono y SVG únicos sin dependencias remotas | 24/24 aprobadas |
| Galería de cartas | Render real en Chromium, 24 SVG y textos legibles; screenshot `tests/cards-24-gallery.png` | Aprobada |
| Filtros del catálogo | Botones de categorías en `CARTAS-24.html` comprobados en Chromium | Aprobada |
| UI escritorio | `tests/browser_smoke.py` con eventos DOM reales para los controles ejercitados, guardados, campaña, final y nuevo render de cartas | Aprobada |
| Móvil emulado | Chromium con pantalla táctil a 390/320 px, sin overflow; dock de búsqueda, defensa y fin de turno | Aprobada |
| Errores JS | Listener `pageerror` durante pruebas mencionadas | 0 observados |
| Lanzador local | `python3 tests/test_launcher.py`, comprobación HTTP del servidor limitado a localhost | Aprobada |
| Build autónomo | `npm run build:single`; comprobación de scripts y estilos integrados | Aprobada |
| PWA | Tests de listado precache y caché `dead-cabin-404-v2-1-0` | Aprobada estáticamente |

Las 47 pruebas incluyen 100 simulaciones de acciones aleatorias y la ruta sintética de victoria para cada uno de los ocho capítulos. Estas comprobaciones **no sustituyen** sesiones jugadas completas ni miden diversión.

## Limitaciones y pendientes

- Prueba humana de los 8 capítulos y estudios de equilibrio en Historia, Supervivencia y Pesadilla.
- Comprobación visual en Safari iPhone, Firefox y Linux Mint reales, y prueba con lector de pantalla.
- Evaluación de rendimiento sostenido en dispositivos de gama baja, CPU y memoria de sesiones prolongadas.
- Auditoría de contraste automática de cada estado de control; la inspección visual de capturas no basta para certificar WCAG.
- La prueba de navegador usa inyección de archivos de código en Chromium debido a restricciones de acceso local del entorno de pruebas; no equivale a una prueba con red de GitHub Pages.
- No certificar como fotorrealistas los SVG 2.5D ni como totalmente validado el juego comercial.

## Resultados por control nuevo

- **Tarjeta de evento:** categoría, icono, título, flavor y efecto actualizados al resolver un turno; comprobado en navegador.
- **Acciones:** 3 grupos visuales; IDs funcionales conservados; todos los controles clásicos se mantienen en la aplicación.
- **Dock móvil:** búsqueda y defensa despachadas desde controles táctiles y botón de finalizar turno probado; ataque directo con hacha requiere enemigo válido y se prueba en una ruta adicional cuando está presente.
- **Inventario:** conserva los ID y manejadores; nuevo CSS en tarjetas.
- **Cabecera:** mismos botones y handlers; nueva agrupación semántica.

**Veredicto:** APTO CON RESERVAS para publicar como actualización visual y continuar las pruebas humanas.
