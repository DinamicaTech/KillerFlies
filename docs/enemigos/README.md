---
title: Enemies
depends_on: [graficos]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Enemy formation | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Ship types | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFynq9GYHcEL7zVzxwoVjPM
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
The alien ships: seven types, each with its points and its maximum bombs per attack: blue (10, 2), purple (20, 3), red (30, 4) and yellow (50, 4), the arcade ones, and three that appear from wave 2 with their own attack: green (40, 2, zigzag), orange (60, no bombs, rams) and cyan (80, 3, shooter). A ship dies when hit by a player shot or when it collides with the player: it explodes on the spot and sends a notification so its points get added. Its child nodes define the formations of each wave and the attacks.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:44 · [replaced by 2026-10-03 19:08] Type table in js/enemigos.js (KF.TIPOS_NAVE): colour, points, maximum bombs and sprite of each type.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:08] Destruction: every alien ship dies in a single place, KF.enemigos.destruir (js/enemigos.js), both from the player's shot (in formation or diving) and when colliding with the player. It leaves on the spot a three-phase explosion of 0.1 seconds per phase (provisional drawing in js/graficos.js) and notifies whoever subscribes with KF.enemigos.alDestruir(fn(nave, motivo)), with motivo 'disparo' or 'choque'.
- 2026-10-03 19:10 · Points: the destroyed ship gives its type's points whether it is hit by the shot or collides with the player, as in the arcade. Adding and showing them is left to Scoreboard; the explosion noise, to Sound.
- 2026-10-03 19:06 · Validated by the owner: becomes stable.
- 2026-10-03 19:08 · [replaced by 2026-10-04 12:05] Type table in js/enemigos.js (KF.TIPOS_NAVE): points, maximum bombs and sprite of each type. The sprite, already coloured, is provided by graficos (KF.graficos.SPRITES_NAVE in js/graficos.js).
- 2026-10-03 19:08 · Destruction: every alien ship dies in a single place, KF.enemigos.destruir (js/enemigos.js), both from the player's shot (in formation or diving) and when colliding with the player. It leaves on the spot an explosion of 0.1 seconds per phase with the drawing from graficos (four phases) and notifies whoever subscribes with KF.enemigos.alDestruir(fn(nave, motivo)), with motivo 'disparo' or 'choque'.
- 2026-10-04 12:05 · Ship types: blue (10 points, 2 bombs), purple (20, 3), red (30, 4) and yellow (50, 4) attack by diving; green (40, 2) in zigzag, orange (60, 0) by ramming and cyan (80, 3) as a shooter (the attacks are defined by enemigos/ataque).
- 2026-10-04 12:05 · Type table in js/enemigos.js (KF.TIPOS_NAVE): points, maximum bombs, attack style and sprite of each type. The sprite, already coloured, is provided by graficos (KF.graficos.SPRITES_NAVE in js/graficos.js).

## Requirements
- 2026-10-03 18:13 · There are four types of alien ships (blue, purple, red and yellow) that give 10, 20, 30 and 50 points respectively when destroyed.
- 2026-10-03 18:22 · draft: Define the four alien ship types (blue, purple, red and yellow), with their points (10, 20, 30 and 50) and their maximum number of bombs per attack (2, 3, 4 and 4), and their destruction on being hit by a player shot.
- 2026-10-03 18:44 · Derived from enemigos/formacion: table of the four ship types with their colour, points and bombs.
- 2026-10-03 19:03 · (To the question "if an alien ship collides with you, does it give points?") Yes
- 2026-10-03 19:08 · Derived from graficos: each ship type takes its already coloured sprite from js/graficos.js.
- 2026-10-04 12:05 · Derived from enemigos/formacion: three new ship types, green, orange and cyan, with their points (40, 60 and 80), their bombs (2, 0 and 3) and their attack style.
