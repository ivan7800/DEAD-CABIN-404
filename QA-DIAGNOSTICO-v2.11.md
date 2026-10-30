# DEAD CABIN 404 v2.11 — Diagnóstico voluntario

## Qué registra
Cuando el usuario activa explícitamente **Diagnóstico** en la cabecera, se registran acciones de juego, aciertos o rechazos y una fotografía limitada de recursos tácticos: capítulo, turno, dificultad, superviviente, salud, cordura, oscuridad, puntos de acción y objetivos. No registra nombres personales, contenido de narración ni identificadores externos.

## Privacidad y límites
El registro está desactivado de forma predeterminada, no realiza llamadas de red y permanece en `localStorage` con clave independiente `dead-cabin-404-qa-v1`. Máximo 2.500 eventos; se eliminan los más antiguos. Desde el panel se puede activar/desactivar, exportar JSON y borrar. No afecta a partidas v4 ni a los logros.

## Cómo probar una campaña humana
1. Abrir juego y pulsar **DIAGNÓSTICO → ACTIVAR REGISTRO**.
2. Jugar con normalidad; hacer anotaciones externas sobre frustración y tensión subjetiva cada 10 turnos.
3. Al final, pulsar **DIAGNÓSTICO → EXPORTAR JSON** y revisar el archivo en local antes de compartir.
4. Pulsar **BORRAR REGISTRO** para eliminar los eventos, si se desea.

## Precauciones de interpretación
La cuenta de «victorias» del resumen corresponde a registros de acciones cuyo estado ya estaba marcado como ganado, no a partidas únicas. No debe interpretarse como número de victorias de campaña. El registro no calcula tiempo real transcurrido, ni sustituye pruebas humanas completas.

## Verificaciones
Suite Node: 95/95 tests, incluidos 5 casos de privacidad, formato, límites, borrado y errores. Lanzadores: prueba local de servidor. HTML independiente reconstruido. No se declara validación en dispositivos físicos.
