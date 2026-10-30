# Auditoría de campaña DEAD CABIN 404 — v2.6 a v2.7

## Alcance y honestidad metodológica
Se han ejecutado las pruebas automatizadas del motor, un recorrido sintético de **1.152 partidas** (8 capítulos × 3 dificultades × 3 supervivientes × 16 semillas) y pruebas de navegador Chromium. La estrategia automática no equivale a una partida humana ni certifica diversión, accesibilidad física ni instalación iOS. No se han realizado ocho partidas humanas completas.

## Resultado global
- v2.6: **784 / 1.152** victorias, sin acciones inválidas.
- v2.7: **787 / 1152** victorias, sin acciones inválidas.
- La mejora buscada es de ritmo en la fase de regreso, no de combate o de dificultad general.

## Balance y ritmo por capítulo

| Capítulo | Victorias en v2.6 | Victorias en v2.7 | Turnos medios v2.7 | Diagnóstico |
|---|---:|---:|---:|---|
| 1 | 128/144 | 128/144 | 14.2 | Introducción clara; podría acortarse el onboarding repetido |
| 2 | 114/144 | 114/144 | 16.3 | Tormenta reconocible; la amenaza sigue una cadencia legible |
| 3 | 97/144 | 97/144 | 16.9 | Objetivo de caza dependiente de apariciones; requiere observación humana |
| 4 | 95/144 | 95/144 | 17.1 | Jefe distintivo, pero prolongación de combate táctica |
| 5 | 88/144 | 91/144 | 21.1 | Exploración larga por geometría y salas malditas |
| 6 | 109/144 | 109/144 | 18.4 | Fuerte ambientación sonora; investigar radio sigue siendo rutina |
| 7 | 93/144 | 92/144 | 22.4 | Secuencia de cuatro sellos prolongada y regreso punitivo |
| 8 | 60/144 | 61/144 | 23.8 | Mayor dificultad y duración; clímax sensible a desgaste |

## Corrección aplicada
En capítulos **5, 7 y 8**, cuando ya se completaron los objetivos y el superviviente está regresando a la Entrada, una vez cada tres turnos el avance **base** de oscuridad se reduce como máximo en 1. Los eventos del mazo, enemigos, rituales y ataques conservan sus efectos originales. La previsión táctica comunica esta condición. Formato de guardado v4 sin cambios.

## Evidencia y QA
- 80/80 pruebas Node, incluidas cuatro pruebas nuevas del ajuste.
- 1.152 simulaciones sin acciones inválidas.
- Chromium escritorio y móviles emulados 320 y 390 píxeles sin errores de ejecución observados.
- Lanzadores Windows y Linux comprobados en la prueba automatizada del servidor local.
- No se ha verificado Safari físico, lectores de pantalla reales ni sesiones humanas completas.

## Riesgos pendientes (sin maquillarlos)
1. P1: medir percepción de la duración y el desgaste en una campaña real; evitar que el capítulo 8 resulte frustrante.
2. P1: ocho playtests completos con registro de tiempo real, dudas, derrotas, decisiones y abandonos.
3. P2: más acontecimientos únicos durante el trayecto, no solamente en el desenlace.
4. P2: continuidad narrativa entre capítulos que cambie rutas, no solo recursos.
5. P2: contrastes y accesibilidad en iPhone y equipos físicos.

## Decisión de publicación
Se entrega **v2.7 candidata**, no se reemplaza automáticamente `main`. Publicar después de revisar efectos y QA.
