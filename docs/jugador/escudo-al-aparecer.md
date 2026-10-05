---
title: Shield on spawn
depends_on: []
threads:
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Shield on spawn | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiF2yKDQhz2dpj7kMYn4YEgz
---
## Summary
When it appears, the player ship blinks for two seconds and is invulnerable meanwhile; the alien ship that collides with it is destroyed and the bomb disappears.

## Decisions
- 2026-10-05 11:51 · Created as a child draft of Player, one of the six to test Claude Visual Project's box stacking.
- 2026-10-05 12:12 · Shield: each time Game makes the ship appear (KF.jugador.aparecer), for 2 seconds it blinks (0.1 seconds visible and 0.1 invisible) and KF.jugador.explotar has no effect; it moves and fires normally. The diving alien ship that collides with it is destroyed all the same (and gives its points) and the bomb that touches it disappears. Code in js/jugador.js (KF.jugador.escudo); Attack and Game do not change.
- 2026-10-05 12:12 · Validated by the owner: the node becomes stable.

## Requirements
- 2026-10-05 11:51 · draft: When it appears, the player ship blinks for two seconds and during that time it is invulnerable.
- 2026-10-05 12:09 · Better that the enemy ship gets destroyed
