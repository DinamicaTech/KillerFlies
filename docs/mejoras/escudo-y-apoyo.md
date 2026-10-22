---
title: Shield, support ships and bonus screen
depends_on: [mejoras, jugador, enemigos/ataque, partida, partida/oleada-desafio, graficos, sonido]
threads:
  - Monedas y tienda de mejoras | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
Phase 3 of the upgrades, built in js/tienda.js, js/jugador.js, js/ataque.js, js/partida.js and js/monedas.js; one-player games only, like every upgrade. Three new shop rows:
- BONUS (10 coins, once): unlocks the challenge wave (partida/oleada-desafio), which without it does not appear, as in the original Galaxian. In it each group destroyed whole drops a coin, up to 4 per challenge (the one after each wave), each collected only once.
- SHIELD (20, once): each new ship comes with a cyan ring that takes one hit from a bomb or a diving ship; then the ship is invulnerable for 1 second.
- WINGMAN (15 per level, 2 levels): a small support ship at the left of the player ship (level 2 adds one at the right) that fires a normal shot at the same time as the ship, not counted for its limit of shots on screen; whatever touches it destroys it. The ship keeps far enough from the edge for its support ships to stay on screen.
Shield and support ships come back with each new ship, and the bought ones reach the ship in play at once. A broken shield or a lost support ship sounds like an enemy explosion. With 10 rows the shop list now shows 8 at a time, with arrows above and below that scroll it (the marked row is always visible, and a tap on an arrow scrolls one row).
Tests: tools/comprobar-escudo-apoyo.mjs and tools/comprobar-mejoras.mjs in the "Pruebas" workflow.
**Acceptance:** buy SHIELD and let a bomb hit: the ring breaks and the ship survives; buy WINGMAN and see the support ship fire with you and die from a bomb; without BONUS no challenge after a wave; with BONUS it comes back and its groups drop coins. Validated by the owner.

## Decisions
- 2026-10-21 20:22 · Created as a draft when the upgrades idea left the lab in phases.
- 2026-10-21 21:12 · Built as in the Summary, with the owner's go-ahead: the challenge stays locked in one-player games until BONUS is bought, and its coins are collected once. Names, prices and the return of the shield and support ships with each new ship were proposed by Claude in the breakdown and accepted with that go-ahead.
- 2026-10-22 11:15 · Validated by the owner: passes from draft to stable.

## Requirements
- 2026-10-21 20:22 · draft: Add to the upgrade shop (mejoras) the shield that takes one hit (and comes back when the ship is destroyed), up to two support ships at the sides of the player ship that fire with it and are destroyed when hit, and the bonus screen between waves (partida/oleada-desafio) locked until it is bought, as one of the first upgrades, giving a coin for each group of ships destroyed in it.
- 2026-10-21 21:04 · Adelante con el resto de mejoras de la tienda
- 2026-10-21 21:07 · Ok a no mostrar el desafío hasta haberlo comprado. De hecho, hace que 'de serie' el juego se comporte como el Galaxian orginal (bueno, más o menos)
- 2026-10-22 11:15 · answer: validation of phase 3 → "Ok. funciona ok"
