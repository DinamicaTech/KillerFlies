---
title: Combos
depends_on: [marcador, jugador, enemigos, partida, partida/oleada-desafio, power-ups, multijugador, graficos]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Combos | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2cfjgx74GxxRcMCH7Lec7P
---
## Summary
Points multiplier for destroying ships in a row without missing, in js/combos.js (KF.combos): each player ship keeps its streak (KF.Nave.racha). The first 5 ships in a row give their usual points, the 6th to the 10th double, the 11th to the 15th triple and from the 16th on quadruple. The streak goes back to zero when a shot leaves through the top without hitting anything (with the triple shot, only if none of its three projectiles hits) and when the player ship explodes. It also counts in the challenge wave and carries over from one wave to the next. Ships destroyed by collision, the bomb, the annihilation or the deep shot count like any other, and so does the mothership boss (enemigos/jefe), with its own points; a hit on it is not a lost shot. The points earned, already multiplied, float where each ship explodes: they rise 10 pixels and fade out in 0.8 seconds, in white (in a two-player game, in each player's colour). While the multiplier is active the scoreboard shows 'X2' to 'X4' under the points (in a two-player game, to the left of each player's points). In a two-player game the host computes the combos and sends the guest each player's streak and the floating points.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 08:42 · Leaves the lab: executed. Moved from creative-lab/combos to marcador/combos, because the Scoreboard adds the points; Player, Enemies, Game and Multiplayer get derived requirements.
- 2026-10-16 08:42 · Owner's answers: the multiplier goes up one step every 5 ships in a row, up to x4; a shot lost through the top and the death of the player ship break the combo; the multiplier is shown on the scoreboard while it is active; the combo also counts in the challenge wave and carries over between waves.
- 2026-10-16 08:42 · Implemented as described in the Summary. Values chosen by Claude, adjustable after testing: floating points rise 10 pixels in 0.8 seconds. A collision with the shield on destroys the alien ship and counts for the combo without breaking it.
- 2026-10-16 08:42 · Acceptance: after 5 ships in a row the 6th gives double points and the doubled value floats over its explosion, with 'X2' under the points; a missed shot or losing the ship goes back to x1 and the 'X2' disappears; in a two-player game the guest sees the same floating points and multipliers. Checked by Claude in a headless browser (one player, and a simulated guest fed with the host's snapshot); the owner validates it by playing.
- 2026-10-16 09:14 · Validated by the owner by playing: the node becomes stable.
- 2026-10-16 10:30 · The mothership boss (enemigos/jefe) counts as one more ship with its own points (a ship may carry `puntos`, which wins over its type's).

## Requirements
- 2026-10-13 17:06 · idea: Give a points multiplier for destroying ships in a row without missing, and show the points earned floating where each ship explodes.
- 2026-10-16 08:33 · Pasa de idea a desarrollo.
- 2026-10-16 08:39 · answer: multiplier scale → 1.A (one step up every 5 ships in a row, up to x4)
- 2026-10-16 08:39 · answer: what breaks the combo → 2.A (a shot lost through the top and the death of the player ship)
- 2026-10-16 08:39 · answer: show the multiplier → 3.A (a small 'X2' under the points while it is active)
- 2026-10-16 08:39 · answer: challenge wave → 4.A (the combo also counts there and carries over between waves)
- 2026-10-16 10:30 · Derived from enemigos/jefe: multiply the mothership boss's points like any ship's.
