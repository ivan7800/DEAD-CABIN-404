# QA — DEAD CABIN 404 1.8

| Área | Resultado |
|---|---|
| Node `npm test` | 38/38 pruebas superadas localmente |
| Simulaciones adversariales | 100 semillas, hasta 180 acciones, invariantes válidos |
| Ocho episodios | 8 rutas **sintéticas** de victoria |
| Jefes con tablero lleno | Invocación con 10 enemigos (cap. 4 y 8) superada |
| Arte | 8 ilustraciones SVG diferentes |
| Chromium escritorio | Movimiento, combate, campaña, guardado, elecciones y modo infinito |
| Chromium móvil emulado | 390/320 px sin desbordamiento |
| Errores JavaScript | 0 observados en las rutas comprobadas |
| Lanzadores | Prueba HTTP 200 en 127.0.0.1 y assets locales |
| PWA | Recursos y versión de caché verificados estáticamente |

## Límites

- No son ocho partidas humanas completas: las rutas de victoria crean estados válidos cerca del final.
- El entorno bloquea `file://` en Chromium; el HTML autónomo se ha probado inyectado, no con doble clic físico.
- Pendientes Safari iPhone real, Steam Deck, auditoría por lector de pantalla y pruebas de equilibrio con jugadores.
- Arte SVG vectorial con volumen simulado, no fotografías ni modelos 3D.
- GitHub Pages y el workflow CI deben verificarse por separado tras la fusión.

## Repetir

```bash
npm test
npm run build:single
python3 tests/test_launcher.py
python3 tests/browser_smoke.py
```
