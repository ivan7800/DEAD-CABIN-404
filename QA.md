# Auditoría técnica — DEAD CABIN 404 1.0

## Realmente comprobado

| Área | Método | Resultado |
|---|---|---|
| Sintaxis de módulos JS | `node --check` | OK |
| Reglas y estados | 28 tests `node:test` | 28/28 superados |
| Seguridad de estados | Simulación adversarial de 100 semillas con acciones aleatorias | 100 simulaciones sin invariantes rotos |
| Capítulos | Comprobación de generación de 8 misiones × 3 clases × 3 dificultades | OK |
| Cartas | 24 extracciones únicas por ciclo, rebarajado al agotar | OK |
| Combate | PA, alcance, tiro d6, munición, bonus, jefes, barricada, aturdimiento | OK |
| Campaña y decisiones | Condiciones de misión, bloqueo durante elección, victoria y desbloqueo | OK |
| Guardado | Serialización validada, migración v0.3 y anterior, restauración UI simulada | OK |
| Interfaz Chrome | Playwright con Chromium, 1440px, uso de acciones, logros y modo infinito | OK |
| Interfaz móvil simulada | Chromium táctil 390px y 320px sin desbordamiento horizontal | OK |
| Errores JavaScript del navegador | Monitor de `pageerror` en pruebas E2E | 0 errores |
| Versión un solo archivo | HTML/CSS/JS combinados mediante build Node.js y prueba de carga en Chromium | OK |
| PWA | Archivos de manifiesto, icono y service worker disponibles, registro condicionado a HTTP(S) | Inspección estática |

## Riesgos y pendientes externos

- No hay test de usuario real en Safari iOS, Firefox, Steam Deck ni Linux/Mac reales. Las medidas táctiles se hicieron con emulación de pantalla en Chromium.
- Las pruebas Chromium usan documento local inyectado y almacenamiento simulado por las políticas del entorno; no prueban almacenamiento `file://` o despliegue HTTPS real.
- No hay partida humana completa de los 8 capítulos ni estudio de dificultad con jugadores; existen pruebas del motor, simulaciones y rutas de victoria sintéticas.
- El modo infinito está pensado como partida abierta con límites de derrota, no supervivencia matemáticamente infinita.
- Arte vectorial y animación HTML/CSS, no miniaturas tridimensionales ni ilustraciones fotográficas.
- Sin backend, ranking global ni sincronización entre dispositivos.
- El workflow de GitHub Pages está preparado, **pero no se atribuye una publicación pública si no hay evidencia de despliegue**.

## Pruebas manuales aconsejadas antes de un lanzamiento promocionado

1. Completar los ocho expedientes en Historia y Supervivencia con los tres personajes.
2. Jugar veinte partidas en cada dificultad para ajustar ratio de victoria y eventos frustrantes.
3. Probar iPhone Safari, VoiceOver, orientación vertical/horizontal y navegación con teclado.
4. Instalar la PWA desde HTTPS, abrir en modo avión, actualizar recursos y comprobar guardado.
5. Comprobar despliegue limpio en un repositorio nuevo de GitHub Pages, incluida caché del service worker.
