---
title: Destello al disparar
status: draft
depends_on: []
threads:
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Destello al disparar | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHLcZpng9XYCwPR9yuYwVSw
---
## Summary
Cada vez que la nave dispara aparece durante 0,06 segundos un pequeño destello (estrella blanca con centro amarillo) en la punta del cañón, que sigue a la nave y desaparece si explota. Implementado, a falta de que el dueño lo valide.

## Decisions
- 2026-10-05 11:51 · Creado como draft hijo de Jugador, uno de los seis para probar el apilado de cajas de Claude Visual Project.
- 2026-10-05 12:05 · Destello: cada vez que la nave dispara (cada salva; con el disparo triple, uno solo) aparece justo encima de la punta del cañón durante 0,06 segundos, sigue a la nave si se mueve y no se dibuja si la nave explota. Con la aniquilación no hay destello porque no se lanza proyectil. Código en js/jugador.js (KF.jugador.destello, DURACION_DESTELLO); el dibujo es KF.graficos.SPRITE_DESTELLO.

## Requirements
- 2026-10-05 11:51 · draft: Mostrar un breve destello en el cañón de la nave cada vez que dispara.
