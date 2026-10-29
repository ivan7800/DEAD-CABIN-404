# Verificación v2.6

- Pruebas Node ejecutadas localmente en ZIP v2.6: **76/76 correctas**.
- La rama de GitHub debe superar CI antes de ser fusionada.
- Cada desenlace dispone de dos decisiones y evita reentrada hasta resolverlo.
- Guardados v4 compatibles, sin prometer validación de dispositivos físicos o partidas humanas.

---

# QA de DEAD CABIN 404 v2.3 (29-10-2026)

**Alcance:** pruebas automatizadas reproducibles en el entorno, sin afirmar experiencia humana certificada.

| Prueba | Resultado |
|---|---|
| `npm test` | 60/60 correctas |
| Casos corruptos de estado v4 | 100/100 rechazados; compatibilidad del v4 antiguo preservada |
| `python3 tests/browser_smoke.py` | Aprobado Chromium con rutas existentes |
| `python3 tests/edition23_browser.py` | Aprobado Chromium 390/320 px, panel móvil, importación corrupta sin reemplazo, importación válida y persistencia |
| `python3 tests/test_launcher.py` | Aprobado; rutas de servidor local |
| `npm run build:single` | Generado HTML independiente |
| `node scripts/audit-balance-1152.js` | 1.152 simulaciones, 761 victorias, 0 acciones rechazadas |

La comparación base auditada v2.2 dio 735/1.152 con la misma estrategia y semillas. No es una tasa de victoria humana: requiere pruebas de balance con varios niveles de habilidad. El capítulo 8 continúa siendo exigente (19/48 Supervivencia y 7/48 Pesadilla con esta estrategia).

**Limitaciones:** no se han ejecutado partidas humanas de los ocho capítulos, pruebas de lector de pantalla, WCAG AA formal, iPhone Safari real, Steam Deck, dispositivos Linux/Windows físicos ni pruebas PWA offline de extremo a extremo sobre HTTPS.

---

## QA v2.2 archivada

# QA — DEAD CABIN 404 v2.2 · Evidencia reproducible

## Comprobaciones ejecutadas

| Área | Prueba | Resultado |
|---|---|---|
| Motor, reglas y UI estática | `npm test` | **55/55** |
| Regresión motor | 100 simulaciones de secuencias aleatorias, ocho rutas sintéticas de victoria, validación de estado | Aprobado |
| Dos jefes y fases | Tests sobre barrido, radio de pulso, Defensa, fase II, exposición, compatibilidad de guardados | Aprobado |
| Capítulo 5 | Dos salas de objetivo malditas y purificación comprobada | Aprobado |
| Cartas | 24 SVG específicos, efectos/categorías y filtro Chromium | Aprobado |
| Chromium escritorio | `python3 tests/browser_smoke.py`: acciones, cartas, capítulo, tutorial, combate, final, jefes y exportar/importar JSON | Aprobado |
| Chromium móvil emulado | Pantalla táctil 390 px y 320 px, sin desbordamiento horizontal; acciones rápidas | Aprobado |
| Consola JS | `pageerror` de Playwright en rutas probadas | 0 errores observados |
| Lanzadores | `python3 tests/test_launcher.py` | Servidor local HTTP correcto |
| HTML autónomo | `npm run build:single` | Generado y comprobada presencia de recursos |
| Galería | `python3 tests/test_gallery.py` | 24 cartas y filtros correctos |
| 192 partidas heurísticas | `node scripts/balance-sim.js`: 8 capítulos × 3 dificultades × 8 semillas; acciones despachadas al motor sin forzar victoria | 192 estados finales válidos, **0 acciones rechazadas** |
| PWA | `sw.js` con caché `dead-cabin-404-v2-2-0`, network-first de navegación, caché offline, test estático | Aprobado estáticamente |

## Resultado orientativo de las 192 simulaciones

La estrategia programada explora y prioriza objetivos, cura heridas, usa recursos y combate según una regla sencilla, **sin conocimiento futuro del RNG**. No representa cómo jugaría una persona experta.

| Capítulo | Historia | Supervivencia | Pesadilla |
|---|---:|---:|---:|
| 1 · El libro | 8/8 | 8/8 | 3/8 |
| 2 · Tormenta | 8/8 | 6/8 | 2/8 |
| 3 · Cazadores | 7/8 | 3/8 | 0/8 |
| 4 · Guardián | 7/8 | 5/8 | 3/8 |
| 5 · Casa imposible | 8/8 | 5/8 | 0/8 |
| 6 · Silencio | 7/8 | 4/8 | 2/8 |
| 7 · Cuatro nombres | 7/8 | 4/8 | 1/8 |
| 8 · Corazón | 7/8 | 2/8 | 0/8 |

**Interpretación:** los capítulos 3 y 8 y la dificultad Pesadilla siguen siendo especialmente duros para esta estrategia. Se necesitan muestras más amplias, varios perfiles de juego y datos de jugadores para medir el balance real. No se ha declarado el juego 9,5/10 ni «totalmente terminado».

## Pendientes antes de certificar experiencia completa

- Sesiones jugadas humanas completas de los ocho capítulos, incluyendo muerte y carga, sin instrumentos de QA.
- Safari en iPhone real, Steam Deck, Linux Mint y Windows reales; Chromium emulado no certifica estos dispositivos.
- WCAG y lector de pantalla: test formal de contraste, tabulación en modales, lectura de cartas y teclado asistivo.
- Rendimiento y consumo sostenido en móviles modestos y PWA instalada con conectividad variable.
- Equilibrio con jugadores reales en las tres dificultades; revisar especialmente capítulo 8 y Pesadilla.
- Auditoría de seguridad, restauración de datos y pruebas de regresión tras cada cambio.

**Veredicto técnico:** candidato estable para publicación y pruebas externas, sin garantía de experiencia perfecta ni certificación de accesibilidad.
