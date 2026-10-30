# Auditoría de políticas tácticas — v2.10.1

Se compararon **108 campañas encadenadas por política** (tres dificultades × tres supervivientes × doce semillas), con los mismos estados iniciales y legados, sin visión del resultado de los dados.

| Métrica | Política anterior | Política táctica conservadora |
|---|---:|---:|
| Campañas completas | 29/108 | 29/108 |
| Episodios jugados | 555 | 560 |
| Historia completa | 22/36 | 21/36 |
| Normal completa | 5/36 | 5/36 |
| Pesadilla completa | 2/36 | 3/36 |

Una primera política más agresiva fue **descartada** al bajar a 4/108 victorias: es evidencia de que optimizar heurísticas intuitivamente puede empeorar los resultados. La variante conservadora añade defensa anticipada en rituales, ahorra munición cuando un enemigo de 1 PV está a corta distancia, y reserva bengalas para grupos próximos en emergencias.

Los resultados se reproducen con `npm run audit:strategy` y quedan en `qa/strategy-comparison.json`. **No equivalen a experiencia de jugadores humanos ni prueban un equilibrio perfecto.** El contenido de juego y los guardados v4 no cambian respecto a v2.10; la actualización incluye herramientas QA y pruebas.
