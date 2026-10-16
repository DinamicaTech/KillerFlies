---
title: Difficulty levels
depends_on: [partida, enemigos/ataque, enemigos/formacion, enemigos/jefe, graficos, multijugador]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Difficulty levels | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi5nXSFnaSDCcojo6UjHX3wU
---
## Summary
The player chooses EASY, NORMAL or HARD in the start menu: a line '< NORMAL >' under the menu options, changed with the left and right arrows or with a tap on it (each tap goes to the next level). The choice is remembered in the browser; with nothing saved it is NORMAL. NORMAL is the game as it was before the levels. EASY makes everything 25% slower (formation block, dives, bombs, power-up capsules and the mothership boss), with one attacker less at a time (never fewer than one) and 30% more time between attacks; HARD makes everything 25% faster, with one attacker more at a time and 25% less time between attacks. The 5% increase per wave, the spare ships, the extra lives and the points are the same in every level, and there is a single high score for all of them. The formation behind the menu moves at the speed of the chosen level. In a two-player game the host's level applies to both: it reaches the guest in the snapshot. In js/dificultad.js (KF.dificultad: `elegido` is the level marked in the menu, `nivel` the one of the game in play); Game multiplies each wave's speed by it and Attack takes its attackers and pauses from it. Tested by tools/comprobar-dificultad.mjs on every pull request. Validated by the owner.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 10:41 · Leaves the lab: executed. Moved from creative-lab/dificultad to partida/dificultad, because the start menu and the speed of each wave belong to Game.
- 2026-10-16 10:41 · Levels agreed with the owner: the current game is NORMAL and does not change; EASY is 25% slower with one attacker less and more spaced attacks, HARD 25% faster with one more and closer attacks (attack pauses ×1.3 in EASY and ×0.75 in HARD). The per-wave increase, spare ships, extra lives and points do not change. One high score for all levels, so the scoreboard is not touched. In a two-player game the creator's level applies.
- 2026-10-16 10:41 · Menu: a line '< LEVEL >' in yellow under the options, 8 pixels further down; left and right arrows change it (wrapping round), a tap on it goes to the next level without choosing any option and without shooting. Changing it restarts the formation behind the menu at the new speed. The level is saved in localStorage under 'killerflies.dificultad' (by name); an unknown value gives NORMAL.
- 2026-10-16 10:41 · Acceptance: in EASY the first wave is clearly slower and in HARD faster; the chosen level is still marked after reopening the game; in a two-player game the guest plays at the host's level. tools/comprobar-dificultad.mjs checks the speeds, attackers, pauses and memory of each level (workflow "Pruebas"); checked by Claude in a headless browser; the owner validates it by playing.
- 2026-10-16 10:48 · Validated by the owner by playing: the node becomes stable.

## Requirements
- 2026-10-13 17:06 · idea: Let the player choose easy, normal or hard difficulty in the start menu.
- 2026-10-16 10:36 · Pasamos a desarrollo.
- 2026-10-16 10:36 · El nivel de dificultad actual es 'normal'
- 2026-10-16 10:38 · Ok! (to the plan: EASY 25% slower with one attacker less, HARD 25% faster with one more, one high score for all levels, the host's level in two-player games)
- 2026-10-16 10:48 · Está ok
