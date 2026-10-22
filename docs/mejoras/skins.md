---
title: Skins and cosmetics
status: draft
depends_on: [mejoras, jugador, enemigos, enemigos/ataque, power-ups, power-ups/aspecto-nave, graficos]
threads:
  - Monedas y tienda de mejoras | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
Phase 4 of the upgrades, built in js/tienda.js, js/ataque.js, js/jugador.js, js/enemigos.js and js/graficos.js; one-player games only, like every upgrade. Eight new shop rows (17 with BACK):
- YELLOW (5 per level, no cap): the yellow ships, which attack 3 times more often than the others, get 10% more attack weight per level, so more capsules.
- KEEP POWER (15, once): the first time in each game the ship is destroyed with a power-up, the next ship keeps it (it still ends with the wave).
- ESCORT (10, once): the capsule also drops for a yellow and one of its red escorts, and for a yellow that attacks with a single escort; a group drops one capsule.
- SKIN BLUE and SKIN GOLD (10 each): another hull and nose for the player ship, each with its own look for every power-up (the power-up still sets the interior).
- TRAIL (5, blue engine flame), BLAST (5, plasma coloured explosions and fragments) and STARS (5, nebula coloured starfield).
Skins and cosmetics are bought once and then their row puts them on or takes them off without paying (ON/OFF on the row, and the explanation says how); only one skin is on at a time, and a skin just bought is put on. What is off is saved with the account (`quitadas`). The other player's ship in a two-player game never wears any of it. The better shot sound is parked.
Tests: tools/comprobar-skins.mjs and tools/comprobar-mejoras.mjs in the "Pruebas" workflow.
**Acceptance:** with `?monedas=200`, buy SKIN BLUE and pick up power-ups to see its variants, then SKIN GOLD (BLUE goes off) and take it off; put on TRAIL, BLAST and STARS and see the flame, the explosions and the stars change; buy YELLOW a few times and notice more yellow attacks; with ESCORT get a capsule killing the yellow and one escort; with KEEP POWER lose a ship with a power-up and keep it. Pending the owner's validation.

## Decisions
- 2026-10-21 20:22 · Created as a draft when the upgrades idea left the lab in phases.
- 2026-10-21 21:12 · The better shot sound is parked until the owner finds an audio file; it is not part of this phase.
- 2026-10-22 11:15 · Built as in the Summary, with the owner's go-ahead to the breakdown (names, prices and the two skins, blue and gold, proposed by Claude). KEEP POWER is spent only by a death with a power-up, not by any first death; ESCORT needs the yellow itself among the two ships destroyed.

## Requirements
- 2026-10-21 20:22 · draft: Add to the upgrade shop (mejoras) skins for the player ship, each with a variant for every power-up look (power-ups/aspecto-nave), and cosmetics (colours of the trails, the explosions and the starfield), plus the other accepted upgrades not yet built: better sound effects, a higher chance of yellow attacks (stackable), the power-up kept on the first death and a capsule with a yellow and only one escort.
- 2026-10-21 21:07 · Aparcamos el sonido de disparo hasta que te encuentre un fichero de audio.
- 2026-10-22 11:07 · adelante con el resto de mejoras y multi-perfil de jugador
