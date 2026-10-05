---
title: Muzzle flash
depends_on: []
threads:
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Muzzle flash | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHLcZpng9XYCwPR9yuYwVSw
---
## Summary
Each time the ship fires, a small flash (a white star with a yellow center) appears for 0.06 seconds at the tip of the cannon; it follows the ship and disappears if the ship explodes. Validated by the owner.

## Decisions
- 2026-10-05 11:51 · Created as a child draft of Player, one of the six to test Claude Visual Project's box stacking.
- 2026-10-05 12:05 · Flash: each time the ship fires (each salvo; with the triple shot, just one) it appears just above the tip of the cannon for 0.06 seconds, follows the ship if it moves and is not drawn if the ship explodes. With annihilation there is no flash because no projectile is fired. Code in js/jugador.js (KF.jugador.destello, DURACION_DESTELLO); the drawing is KF.graficos.SPRITE_DESTELLO.
- 2026-10-05 12:04 · Validated by the owner: becomes stable.

## Requirements
- 2026-10-05 11:51 · draft: Show a brief flash on the ship's cannon each time it fires.
