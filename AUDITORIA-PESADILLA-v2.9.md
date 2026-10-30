# Informe del ajuste v2.9 — Pesadilla

## Causa demostrada en v2.8

36 campañas heurísticas encadenadas en Pesadilla, doce semillas por superviviente: 0 completadas, 81 episodios visitados, 30 derrotas por oscuridad y 6 por vida. Fallecieron 16 campañas en capítulo 1, 7 en capítulo 2, 5 en capítulo 3, 4 en capítulo 4 y 4 en capítulo 5. No alcanzaban el capítulo 8.

## Cambio controlado

En campaña Pesadilla solamente, reducir el incremento base de oscuridad de 2 a 1 en turnos pares. Mantener amenazas adicionales, cartas, combate, enemigos y las demás dificultades sin cambios.

## Contraste reproducible

`node scripts/audit-chain.js --write` muestra 108 campañas en total: Historia 22/36, Normal 5/36, Pesadilla 2/36. Pesadilla llega a 115 episodios frente a 81 de la v2.8; no hay acciones rechazadas. Prueba específica `tests/edition29.test.js`.

**Interpretación:** mejora limitada, no demuestra buen equilibrio. Requiere más semillas, otras estrategias y sesiones humanas de campaña.
