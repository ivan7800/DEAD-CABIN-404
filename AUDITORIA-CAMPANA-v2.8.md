# DEAD CABIN 404 v2.8 — Informe de campaña

La auditoría conecta episodios 1→8 con el mismo superviviente, conservando el legado del capítulo completado. Al morir, el recorrido termina. Se conservan las mismas semillas que en el comparativo v2.7.

| Dificultad | Campañas completadas / 36 | Episodios ejecutados |
|---|---:|---:|
| Historia | 22 | 255 |
| Normal | 5 | 169 |
| Pesadilla | 0 | 81 |
| Total | 27 / 108 | 505 |

Las campañas completadas no cambian respecto a v2.7. La mejora comprobable es de contrajuego: Defender ahora evita +1 oscuridad del pulso del Corazón. En Pesadilla, la invocación entrega un talismán de emergencia una sola vez. **El equilibrio final NO está resuelto**: hacen falta pruebas con personas y un análisis adicional de la dificultad Pesadilla.

Reproducir con `npm test`, `node scripts/audit-chain.js --write`, `python3 tests/browser_smoke.py`, `python3 tests/test_launcher.py` y `npm run build:single`.
