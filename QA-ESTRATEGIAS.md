# Comparación táctica reproducible

Esta rama introduce una auditoría de campañas con **dos estrategias automáticas** sobre el mismo motor y las mismas semillas. Ejecutar `npm run audit:strategy` genera `qa/policy-comparison.json` localmente. `npm test` valida la integridad de las acciones de ambas estrategias.

La política *baseline* reproduce el comportamiento del simulador anterior. La política *tactical* incorpora defensas al final del turno ante rituales de jefe, reservas de munición frente a enemigos casi derrotados, uso de bengala en emergencias y talismanes ante niveles críticos de oscuridad.

**Interpretación:** no llamar «IA superior» a una política sin medir los resultados; una mejora en Pesadilla puede empeorar otras dificultades. Estas simulaciones no equivalen a partidas humanas.

**Alcance:** solo herramientas de QA, sin cambios de reglas, guardados ni interfaz. Las versiones jugables v2.7–v2.10 siguen pendientes de integración separada.
