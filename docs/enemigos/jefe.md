---
title: Mothership boss
depends_on: [enemigos, enemigos/ataque, partida, partida/oleada-desafio, jugador, power-ups, marcador/combos, graficos, sonido, multijugador]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Mothership boss | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiPQBuQhT7V38zTBR8RDkB4a
---
## Summary
The mothership boss, in js/jefe.js (KF.jefe): after clearing every third wave (3, 6, 9…), before the challenge wave, 'MOTHERSHIP' is shown for 2 seconds while a large mothership (44×22 pixels, about four ships wide) comes down alone, with no formation. It then moves from side to side near the top and fires bursts of 3 bombs in a fan aimed at the nearest player ship, every 2 seconds, faster with each wave like everything else; it holds its fire while no player ship is in play, so the spare ship can come out. It takes 20 hits the first time, 30 the second, 40 the third and so on; a health bar above it shows what is left and each hit makes it flash white and play the alien explosion sound. Every player shot that touches it stops there (the deep shot included) and takes 1; the bomb and the annihilation power-ups take 5. When destroyed it explodes in a chain of explosions for 2 seconds and gives 2,000 points per appearance (2,000, 4,000, 6,000…), multiplied by the combo, to whoever lands the last hit; then the challenge wave and the next wave follow. Meanwhile no capsules fall, the active power-up is kept and the background music plays at its starting speed. In a two-player game the host runs it and sends the guest its time, phase and health; the guest computes its position. Validated by the owner.

Acceptance: after clearing wave 3 the mothership appears, falls after 20 hits and adds 2,000 points; then come the challenge wave and wave 4; the next mothership comes after wave 6 with 30 hits and 4,000 points.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 10:09 · Owner's answer: every 3 waves instead of 5, because getting past 5 waves is very hard.
- 2026-10-16 10:09 · Leaves the lab: executed. Moved from creative-lab/jefe to enemigos/jefe, because the boss is an enemy.
- 2026-10-16 10:09 · Behaviour agreed with the owner: alone after waves 3, 6, 9… and before the challenge wave; 20 hits plus 10 per later appearance; 2,000 points per appearance with the combo multiplier; bursts of 3 bombs in a fan; bomb and annihilation take 5; no capsules while it is there; in a two-player game the last hit gets the points; drawn by code in the 21st-century ships style and with existing sounds.
- 2026-10-16 10:30 · Implemented as described in the Summary. Its bombs are ordinary alien bombs (KF.ataque.bombas), so they move, hit and reach the guest like any other. The kill goes through KF.enemigos.destruir with a ship of type 'nodriza' that carries its own points, so Combos and Sound treat it like any ship (the yellow's explosion sound). Its position depends only on its time, as in the challenge wave. Checked by Claude in a headless browser (one player, and two players with a simulated partner); the owner validates it by playing.
- 2026-10-16 11:29 · Validated by the owner: the node becomes stable.

## Requirements
- 2026-10-13 17:06 · idea: Every 5 waves, a large mothership appears that needs several hits to be destroyed and gives many points.
- 2026-10-16 10:07 · Será cada 3 waves, resulta muy complicado pasar 5.
- 2026-10-16 10:07 · Pásalo a desarrollo
- 2026-10-16 11:29 · Ok, ya puedes cerrar este hilo
