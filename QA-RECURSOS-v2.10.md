# Validación de recursos y combate v2.10

Comparación con `node scripts/audit-chain.js`, 108 campañas y las mismas semillas de v2.9:

| Dificultad | Completadas antes/después | Episodios antes | Episodios después |
|---|---:|---:|---:|
| Historia | 22/36 → 22/36 | 255 | 255 |
| Normal | 5/36 → 5/36 | 169 | 169 |
| Pesadilla | 2/36 → 2/36 | 115 | 131 |

Estas son simulaciones deterministas con una heurística básica: NO representan tasas humanas de victoria. Se han incluido nuevas pruebas para el efecto de los talismanes, progresión de dos bajas, límite inferior de oscuridad y compatibilidad de guardados. El equilibrio global de Pesadilla continúa sin resolver.
