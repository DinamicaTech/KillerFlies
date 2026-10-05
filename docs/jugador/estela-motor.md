---
title: Engine trail
depends_on: []
threads:
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Engine trail | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQBdx8sringjXy3tdpEhHwb
---
## Summary
While the player ship is moving, a small orange flame with a yellow tip flickers just below it.

## Decisions
- 2026-10-05 11:51 · Created as a child draft of Player, one of the six to test Claude Visual Project's box stacking.
- 2026-10-05 12:43 · Engine flame: while the ship is moving (speed other than zero, with the arrows or with a finger, also while braking due to inertia) a 3×3 pixel flame appears just below it, alternating between two shapes every 0.05 seconds. When stopped or held against the edge there is no flame; nor while it is invisible due to the shield's blinking, nor when exploding. Code in js/jugador.js (tiempoLlama, CAMBIO_LLAMA); the drawings are KF.graficos.SPRITES_LLAMA.
- 2026-10-05 12:45 · Validated by the owner: becomes stable.

## Requirements
- 2026-10-05 11:51 · draft: Show a small flickering flame under the player ship while it moves.
