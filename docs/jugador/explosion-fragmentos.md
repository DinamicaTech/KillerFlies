---
title: Explosión con fragmentos
depends_on: []
threads:
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Explosión con fragmentos | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi84jLToNjHSuRTTfkLNAWVf
---
## Summary
Al explotar, la nave del jugador lanza 16 fragmentos de 1 o 2 píxeles con los colores de su explosión, que se dispersan desde su centro, frenando un poco, y se apagan en un segundo. Validado por el dueño.

## Decisions
- 2026-10-05 11:51 · Creado como draft hijo de Jugador, uno de los seis para probar el apilado de cajas de Claude Visual Project.
- 2026-10-05 12:23 · Fragmentos: al explotar, la nave lanza 16 fragmentos cuadrados de 1 o 2 píxeles desde su centro, en direcciones al azar, a entre 30 y 90 píxeles por segundo; pierden la mitad de su velocidad cada segundo y se apagan poco a poco hasta desaparecer al cabo de 1 segundo. Cada uno tiene uno de los colores de la explosión (rojo, amarillo, blanco o celeste). Se dibujan encima de la explosión de tres fases, que no cambia, no dañan nada y terminan su recorrido aunque Partida saque la nave de recambio o acabe la partida. Código en js/jugador.js (KF.jugador.fragmentos, lanzarFragmentos, moverFragmentos); los colores son KF.graficos.COLORES_FRAGMENTOS.
- 2026-10-05 12:25 · Validado por el dueño: pasa a estable.

## Requirements
- 2026-10-05 11:51 · draft: Que la explosión de la nave del jugador lance fragmentos que se dispersan y se apagan.
