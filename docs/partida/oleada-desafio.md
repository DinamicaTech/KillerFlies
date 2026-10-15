---
title: Challenge wave
status: draft
depends_on: [enemigos, enemigos/formacion, jugador, marcador, power-ups, multijugador, sonido]
threads:
  - Challenge wave | https://claude.ai/code/project/chan_01GmFabmbZMkMrshz1aTJxzL?thread=cmsg_01GmFabmbZMkMrshz1aTJxzLRMDCMVrG6g779B1K1CqbZN
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
---
## Summary
The challenge wave, in js/desafio.js (KF.desafio): after clearing each wave, before the next one, 'CHALLENGE' is shown for 2 seconds and then four groups of six ships (blue, purple, green, red) cross the screen one after another along fixed curved paths (a loop from the top left, the same mirrored, a wave from left to right and a U-turn from the right), a group every 4 seconds, each ship taking 6 seconds to cross; about 20 seconds in all. They do not fire or collide with the player, and each one gives its usual points to whoever destroys it (the bomb and annihilation power-ups also reach them). If all of them are destroyed, 'PERFECT' and 'EXTRA SHIP' are shown and each player still in the game gets one more spare ship, up to the cap of 5, with the power-up sound. As soon as a ship leaves the screen alive the challenge ends: the rest vanish and 'NO BONUS' is shown. Two seconds after either message the next wave starts. Meanwhile the scoreboard shows 'CHALLENGE' instead of the wave, no capsules fall, the active power-up is kept and the background music plays at its starting speed. In a two-player game the host runs it and sends the guest its time and which ships are alive; the guest computes their positions. Pending the owner's validation.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-15 08:29 · Owner's answers to the debate: the challenge comes after every wave (not every 4); the reward for destroying all the ships is an extra life (it replaces the points bonus); the ships cross once in groups, as in Galaga, so the round lasts about 20 seconds by itself, and it ends as soon as a ship leaves the screen; in a two-player game the ships destroyed by both count together and each player gets one life.
- 2026-10-15 08:55 · Leaves the lab: executed. Moved from creative-lab/oleada-desafio to partida/oleada-desafio, because Game chains the waves and gives the spare ships; Enemies, Player, Scoreboard, Power-ups, Multiplayer and Sound get derived requirements.
- 2026-10-15 08:55 · A perfect challenge with 5 spare ships already gives nothing more: the cap of 5 holds.
- 2026-10-15 08:55 · Implemented as described in the Summary. Values chosen by Claude, adjustable after testing: 4 groups of 6 ships, 2 seconds of title, a group every 4 seconds, 0.3 seconds between ships of a group, 6 seconds per crossing, 2 seconds of final message. The challenge does not speed up with the waves.
- 2026-10-15 08:55 · Acceptance: after each wave the challenge appears; destroying its 24 ships gives one spare ship (none above 5) and 600 points; letting one escape ends it at once with 'NO BONUS'; then the next wave starts with the power-up kept until it ends; in a two-player game the guest sees the same ships and both players get the spare ship. Checked by Claude in a headless browser (one player, and a simulated guest fed with the host's snapshots); the owner validates it by playing.

## Requirements
- 2026-10-13 17:06 · idea: Every 4 waves, play a challenge wave in which the alien ships cross the screen in patterns without firing, with a points bonus if the player destroys all of them, as in Galaga.
- 2026-10-15 08:06 · Podemos hacer que esta pantalla aparezca después de cada nivel para ofrecer una vida extra si se destruyen todas las naves antes de un time-out (20 segundos?)
- 2026-10-15 08:29 · answer: how often → 1. A
- 2026-10-15 08:29 · answer: reward → 2. Una vida extra
- 2026-10-15 08:29 · answer: how the time works → 3. A, pero si una nave abandona la pantalla, se acaba esta prueba ya que el jugador igualmente ya no conseguirá la vida extra
- 2026-10-15 08:29 · answer: two players → 4. Ok, una vida cada uno
- 2026-10-15 08:35 · [answered 2026-10-15 08:41] question: if the player already has 5 spare ships (the cap of the extra-life power-up), what does a perfect challenge give? A) nothing more, the cap holds (recommended); B) a points bonus instead; C) the cap is raised.
- 2026-10-15 08:41 · answer: perfect challenge with 5 spare ships → A
- 2026-10-15 08:41 · Ya la puedes pasar a desarrollo
