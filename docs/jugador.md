---
title: Jugador
depends_on: []
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
La nave que controla el jugador en la parte inferior de la pantalla: se mueve en horizontal, dispara de uno en uno y explota si la alcanza una nave o una bomba.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · La nave que controla el jugador está en la parte inferior de la pantalla y solo se puede mover horizontalmente mientras dispara.
- 2026-10-03 18:13 · Hasta que el disparo no da en un blanco o llega a la parte superior de la pantalla, no se puede volver a disparar.
- 2026-10-03 18:13 · Si alguna nave alienígena o una bomba choca contra la nave del jugador, esta explota.
- 2026-10-03 18:22 · draft: Implementar la nave del jugador: movimiento horizontal con el teclado en la parte inferior, un único disparo en pantalla que se libera al impactar o salir por arriba, y explosión al chocar con una nave alienígena o una bomba.
- 2026-10-03 18:22 · question: ¿Qué teclas se usan? A) flechas izquierda/derecha y espacio (recomendado) B) además A/D.
