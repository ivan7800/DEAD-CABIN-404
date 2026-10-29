# QA v2.0 candidate — comprobación nueva

- 42/42 pruebas unitarias Node.
- Chromium escritorio: tutorial real con cuatro pasos, acción Defender desde botón, fin de fase, controles de movimiento, combate, campaña, encuentros, final y guardado.
- Chromium móvil emulado de 390 y 320 px: sin desbordamiento, controles visibles.
- Lanzador local Python 3: HTTP 200, solo localhost.
- Guardado v4: datos antiguos sin atributo guard siguen siendo válidos.
- Pendientes: ocho partidas humanas completas, verificación visual física en Windows/Linux/iPhone, balance estadístico, carga real tras despliegue GitHub Pages.
- Veredicto: APTO CON RESERVAS para pruebas privadas; no se certifica como juego comercial acabado.

# Auditoría técnica — DEAD CABIN 404 v1.8

## Ejecutado en este entorno

| Área | Método | Resultado |
|---|---|---|
| Motor, campaña y recursos | `npm test` (`node:test`) | 38/38
| Adversarial | 100 partidas de 180 acciones como máximo, invariantes comprobados | Sin fallos de validación
| Ocho capítulos | Estados de final alcanzable + `ESCAPE` | 8/8 rutas sintéticas de victoria
| Jefe con 10 enemigos | Invocación capítulos 4/8 con cupo completo | Resuelto, sin bloqueos
| Arte | Render SVG propio para 8 capítulos + tests de wiring | 8 ilustraciones distintas
| Chromium escritorio | Playwright con documento inyectado: movimiento, combate, encuentros, campaña, guardado, logros y modo infinito | Superado
| Chromium táctil | 390 px y 320 px (emulado), control y desbordamientos | Superado, sin overflow
| JavaScript navegador | `pageerror` Playwright | 0 errores observados
| Efectos visuales | Interruptor ON/OFF, escenario, señal al atacar | Superado
| Lanzador local | `python3 tests/test_launcher.py`: HTTP 200 y encabezados correctos | Superado
| HTML autónomo | `npm run build:single` + carga con `page.set_content` | Superado
| PWA | Inspección estática: todos los scripts/estilos cacheados, nueva versión | Superado

## Límite de la evidencia

- La navegación del navegador por direcciones `file://` está bloqueada por la política del entorno; el HTML autónomo sí pudo ejecutarse **inyectado en Chromium**, pero no se ha probado con doble clic real.
- El navegador Chromium no pudo comprobar un despliegue HTTPS a través de las restricciones de navegación del entorno. La ejecución de Actions en GitHub debe comprobarse tras fusionar.
- No se ha hecho una campaña humana completa de ocho capítulos en todas las dificultades, ni se dispone de datos de balance de jugadores. Las rutas de victoria programáticas construyen estados válidos cerca de sus condiciones de salida.
- Safari en iPhone físico, Firefox, Steam Deck y accesibilidad con lector de pantalla requieren pruebas adicionales.
- Los SVG permiten escalado sin píxeles visibles, pero **no son fondos fotorrealistas** ni miniaturas tridimensionales.
- El servidor de los lanzadores solo escucha en `127.0.0.1`, sin publicar el juego en la red doméstica.

## Comandos reproducibles

```bash
npm test
npm run build:single
python3 tests/test_launcher.py
python3 tests/browser_smoke.py  # necesita Playwright y Chromium en /usr/bin/chromium
```

La release se debe valorar con partidas reales antes de declarar un 9,5/10 definitivo.
