---
title: Estela del motor
status: draft
depends_on: []
threads:
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Estela del motor | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQBdx8sringjXy3tdpEhHwb
---
## Summary
Mientras la nave del jugador se desplaza, una pequeña llama naranja con punta amarilla parpadea justo debajo de ella. Implementado, pendiente de validar por el dueño.

## Decisions
- 2026-10-05 11:51 · Creado como draft hijo de Jugador, uno de los seis para probar el apilado de cajas de Claude Visual Project.
- 2026-10-05 12:43 · Llama del motor: mientras la nave se desplaza (velocidad distinta de cero, con flechas o con el dedo, también mientras frena por la inercia) aparece justo bajo ella una llama de 3×3 píxeles que alterna dos formas cada 0,05 segundos. Parada o detenida contra el borde no hay llama; tampoco mientras está invisible por el parpadeo del escudo ni al explotar. Código en js/jugador.js (tiempoLlama, CAMBIO_LLAMA); los dibujos son KF.graficos.SPRITES_LLAMA.

## Requirements
- 2026-10-05 11:51 · draft: Mostrar una pequeña llama parpadeante bajo la nave del jugador mientras se mueve.
