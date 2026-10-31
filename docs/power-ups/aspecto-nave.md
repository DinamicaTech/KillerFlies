---
title: Look of the powered-up ship
status: draft
depends_on: []
threads:
  - 2026-10-05 10:14 · Look of the powered-up ship | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiKnMhEbDrKQq5FAr4HocuWC
---
## Summary
The player ship changes its look while it has a power-up, with a different design for each power, and returns to its normal design when the power is lost or ends. It keeps its shape, its size and its nose colour (red for player 1, green for player 2); only the interior colour and one detail change: rapid shot, yellow with two swept fins; deep shot, violet with a long cannon through the nose; bomb, orange with a diamond under the nose; annihilation, white with a pulsing halo around the ship until it fires; slow fire, dull grey with unlit nozzles; triple shot, green with a cannon on each side engine. The extra life does not change it. Sprites in js/graficos.js, drawing in js/jugador.js, checked by tools/comprobar-aspecto-nave.mjs in the "Pruebas" workflow.

**Acceptance:** with Shift+1…6 each power shows its look; Shift+7 (extra life) keeps the current look; the ship returns to normal on dying, at a new wave and after using annihilation; the spare ships on the scoreboard keep the normal look; in a two-player game each ship shows its own power.

## Decisions
- 2026-10-05 10:13 · Created as a draft under Power-ups (the node that defines the powers); Graphics will provide the sprites when it is implemented.
- 2026-10-20 17:56 · Look per power (agreed with the owner): rapid, yellow interior and two swept fins; deep, violet interior and a long cannon through the nose; bomb, orange interior and a diamond under the nose; annihilation, white interior and a white halo that pulses around the ship; slow fire, dull grey interior and unlit nozzles; triple, green interior and a cannon on the tip of each side engine; extra life, no change, since it is not a power that lasts. Shape, 13×13 size, collision area and nose colour do not change, so player 2 stays green. The spare ships on the scoreboard keep the normal look. In a two-player game the other player's ship also shows its power (its power is already sent over the network).
- 2026-10-20 17:56 · Implemented; stays a draft until the owner validates it.
- 2026-10-22 11:15 · Derived from mejoras/skins: each skin of the shop has its own variant of every power-up look: the skin changes the hull and the nose, and the power-up the interior as usual.

## Requirements
- 2026-10-05 10:12 · On picking up the PowerUp, have the ship's design change to represent the power-up obtained
- 2026-10-05 10:13 · draft: On picking up a power-up, change the design of the player ship to represent the power obtained (a different look for each power); the ship returns to its normal design when the power is lost or ends.
- 2026-10-22 11:15 · Derived from mejoras/skins: give each skin a variant for every power-up look.
