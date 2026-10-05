---
title: Hall of fame
status: draft
depends_on: []
threads:
  - Hall of fame | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi85PBYekPg2cZkUXJWUDppC
---
## Summary
Pendiente: al terminar la partida, si los puntos entran en los 10 mejores, pedir el nombre del jugador y mostrar el 'hall of fame' con las 10 mejores puntuaciones (nombre, oleada alcanzada y puntos) antes de volver a 'START GAME'.

## Decisions
- 2026-10-05 10:55 · Takes over the draft del hall of fame que estaba dentro de `marcador`: pasa a ser su propio nodo hijo (CVP rules versión 8).

## Requirements
- 2026-10-05 10:15 · Al final de la partida, si la puntuación está dentro de las últimas 10 mejores, pedir el nombre del jugador.
- 2026-10-05 10:15 · Al final de la partida, mostrar el 'hall of fame' de las primeras 10 puntuaciones, con el nombre del jugador, nivel alcanzado y puntos
- 2026-10-05 10:16 · draft: Al terminar la partida, si los puntos entran en los 10 mejores guardados en el navegador, pedir el nombre del jugador (con teclado y en el móvil) y guardarlo con los puntos y la oleada alcanzada; después mostrar el 'hall of fame' con las 10 mejores puntuaciones (nombre, oleada alcanzada y puntos) antes de volver a 'START GAME'.
