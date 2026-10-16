---
title: Extra life from points
depends_on: [partida, jugador, marcador, power-ups, sonido, multijugador, marcador/combos]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Extra life from points | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiV1h2zDMq5zcCryXFSArvd7
---
## Summary
Every 10,000 points (10,000, 20,000, 30,000…) the player gets one more spare ship, up to the cap of 5 spare ships, with the extra life power-up sound; the scoreboard shows it at once. With 5 spare ships already, crossing a mark gives nothing and plays no sound, and the next mark still counts. Points multiplied by combos (marcador/combos) count like any other. In a two-player game each player earns it with their own points. In js/partida.js (KF.partida.vidaExtraPorPuntos, PUNTOS_VIDA_EXTRA); each player ship keeps the points of its next extra life (KF.Nave.proximaVida), reset to 10,000 at the start of each game. In a two-player game the host computes it and the spare ships and the sound reach the guest in the usual snapshot. Validated by the owner.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 09:28 · Owner's answers: every 10,000 points, not only once, because extra lives are not easy to get; the cap of 5 spare ships holds; in a two-player game each player earns it with their own points.
- 2026-10-16 09:28 · Leaves the lab: executed. Moved from creative-lab/vida-extra-por-puntos to partida/vida-extra-por-puntos, because Game gives the spare ships.
- 2026-10-16 09:28 · Implemented as described in the Summary. Each frame, before handling lost ships, Game checks each player's points, so a player who crosses a mark while exploding with no spares left still gets the ship and comes back.
- 2026-10-16 09:28 · Acceptance: going from 9,990 to 10,000 or more points gives one more spare ship with the power-up sound; 15,000 gives nothing more, 20,000 gives another; with 5 spare ships nothing more is added; a new game starts again with 2 spare ships and the next one at 10,000; in a two-player game only the player who reaches the mark gets it. Checked by Claude in a headless browser (one player, and two players with a simulated partner); the owner validates it by playing.
- 2026-10-16 09:40 · Validated by the owner by playing: the node becomes stable.

## Requirements
- 2026-10-13 17:06 · idea: Give the player one more spare ship on reaching 10,000 points, as in the arcade.
- 2026-10-16 09:24 · Pasa de idea a desarrollo
- 2026-10-16 09:27 · Cada 10.000. No resulta nada fácil conseguir vidas extras.
- 2026-10-16 09:27 · Máximo 5 vidas
- 2026-10-16 09:27 · answer: two players → 3. Ok (each player earns it with their own points)
