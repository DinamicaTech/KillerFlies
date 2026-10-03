---
title: Marcador
depends_on: [enemigos, partida, architecture]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
La información en pantalla: oleada actual y máxima arriba a la izquierda, puntos y récord arriba a la derecha, y las naves de recambio abajo a la derecha. Los récords se guardan en el navegador.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · En la parte superior izquierda se mostrará el número de oleada + "/" + número de oleada máxima conseguida por ese jugador. En la parte superior derecha, se mostrarán los puntos conseguidos + "/" + puntos máximos conseguidos por ese jugador.
- 2026-10-03 18:13 · Tiene dos naves de recambio (que aparecen pequeñitas a la derecha abajo del todo)
- 2026-10-03 18:22 · Derived from enemigos: sumar los puntos de cada nave destruida (azul 10, lila 20, roja 30, amarilla 50).
- 2026-10-03 18:22 · draft: Implementar el marcador: oleada/oleada máxima arriba a la izquierda, puntos/puntos máximos arriba a la derecha, naves de recambio pequeñas abajo a la derecha, y guardar los máximos en el navegador.
