---
title: Attack
depends_on: [enemigos, enemigos/formacion, jugador, graficos, architecture]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Dive attacks | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFJ5MweEGxxYP7n8Day6kv9
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
  - Escorts stop firing | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi5smrQFKAMrwWFX1Sq9bmj5
  - Coins and upgrade shop | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
The attacks: a ship (or a yellow with its escort of reds) leaves the formation with a small parabola, turns, dives toward the player dropping bombs and, if it does not collide, exits at the bottom, reappears at the top and returns to its place. The new types come down in their own way: the green in zigzag, the orange rams in a straight line without bombs and the cyan stops at mid-screen and fires an aimed burst. One or two attacks start at a time and there are more with each wave, which also makes them faster; the difficulty level (partida/dificultad) takes one away in EASY and adds one in HARD. When the player's spare ship comes out, attacks wait two seconds. The yellow leaves with the two reds below it (or the nearest ones); if the yellow is destroyed during the attack, its reds stop dropping bombs. An attacking ship that collides with the player makes it explode and is destroyed; the player's shot also hits it.
The BOMBS upgrade (mejoras) slows the enemy bombs to 95% of their speed per level in one-player games.
A bomb or a diving ship that touches a support ship of the WINGMAN upgrade destroys it (the diving ship is destroyed too).

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:40 · The edge in § 6 is the bottom one: the diving ship that exits at the bottom reappears at the top and returns to its slot in the formation.
- 2026-10-03 18:40 · Attack pace: one or two attacks at a time at first, and more with each wave.
- 2026-10-03 18:40 · Order: this node is implemented after enemigos/formacion and jugador, which are still drafts without code; until then it stays as a draft.
- 2026-10-03 19:05 · Exit: the ship leaves its slot with an upward half-turn of 12 pixel radius in 0.8 seconds, toward the side of the screen it is on, and rotates 180° while doing it.
- 2026-10-03 19:05 · Dive: it descends at 70 pixels per second; while it is above the player it veers toward them (up to 55 pixels per second horizontally) with a gentle oscillation that makes the trajectory irregular, and points its cannons at them. Once past the player it continues straight.
- 2026-10-03 19:05 · [replaced by 2026-10-04 12:05] Bombs: each ship drops at random between one and its type's maximum (blue 2, purple 3, red and yellow 4), at least 0.3 seconds apart, only while descending between 90 and 60 pixels above the player. They fall at 110 pixels per second keeping the horizontal speed the ship had when dropping them.
- 2026-10-03 19:05 · [replaced by 2026-10-13 07:45] Escort: when a yellow attacks, the two living reds in their slot closest to its column leave with it (the ones below if present, otherwise the nearest; one if only one is left). They do their own parabola and then descend in parallel below it, one on each side, with their own orientation. If the yellow is destroyed, they continue the dive on their own.
- 2026-10-03 19:05 · Return: the ship that exits at the bottom reappears at the top above its slot, descends to it following the formation's sway, straightens up in the last 60 pixels and rejoins the formation.
- 2026-10-03 19:05 · [replaced by 2026-10-03 19:18] Pace: the first attack comes at 2 seconds and then every 1.5 to 3 seconds (10% less per wave); 1 + wave number attacks fit at the same time, up to 6 (the yellow with its escort counts as one). Yellows are chosen three times as often as the rest. No attack starts while the player ship is exploding. Game will provide the wave number (KF.ataque.oleada) and a speed multiplier for the dive and the bombs (KF.ataque.factorVelocidad); for now it is wave 1 at normal speed.
- 2026-10-03 19:05 · Collisions: a bomb or a diving ship that touches the player ship makes it explode; the alien ship that collides is destroyed, as in the arcade. The player's shot also destroys diving ships. Points are left to Scoreboard and the buzzing to Sound.
- 2026-10-03 19:05 · Code in js/ataque.js; the bomb sprite and the rotated drawing of the ships in js/graficos.js.
- 2026-10-03 19:02 · Validated by the owner: dive attacks are implemented and the node becomes stable.
- 2026-10-03 19:18 · Pace: the first attack comes at 2 seconds and then every 1.5 to 3 seconds (10% less per wave); 1 + wave number attacks fit at the same time, up to 6 (the yellow with its escort counts as one). Yellows are chosen three times as often as the rest. No attack starts while the player ship is not in play (exploding or out of the game). When the spare ship comes out, attacks again wait 2 seconds (KF.ataque.tregua). Game provides the wave number (KF.ataque.oleada) and the speed multiplier for the dive and the bombs (KF.ataque.factorVelocidad), 5% more per wave.
- 2026-10-04 10:52 · Escort and power-ups: the yellow that leaves with two reds forms a group; when all three are destroyed outside the formation, Attack notifies whoever subscribes with KF.ataque.alDestruirEscolta(fn(x, y)), with the position of the last one. A ship that has already returned to its slot no longer counts.
- 2026-10-04 12:05 · [replaced by 2026-10-13 07:45] Bombs: each ship drops at random between one and its type's maximum (blue and green 2, purple 3, red and yellow 4; orange none), at least 0.3 seconds apart, only while descending between 90 and 60 pixels above the player. They fall at 110 pixels per second keeping the horizontal speed the ship had when dropping them. The cyan does not drop them this way: it fires them in its burst.
- 2026-10-04 12:05 · Zigzag (green): after the exit it descends at 70 pixels per second in a tight side-to-side zigzag (lateral speed up to 75 pixels per second, about 1.4 seconds per round trip) with a slight drift toward the player, oriented according to its heading.
- 2026-10-04 12:05 · Ramming (orange): after the exit it aims at where the player is at that moment and charges in a straight line toward that point at twice the dive speed (140 pixels per second), without bombs; it does not correct its course.
- 2026-10-04 12:05 · Shooter (cyan): it descends like the dive down to mid-screen (height 144), hovers for one second with its cannons toward the player and halfway through fires a fan-shaped burst, aimed at them, with its attack's bombs (one to three, 30 pixels per second of lateral speed apart); then it continues descending.
- 2026-10-04 12:05 · The reds escorting a yellow always go down with it; the new attacks are only for the green, orange and cyan types, which never escort.
- 2026-10-13 07:12 · Two players: attacks start while any player ship is alive; each diving ship (and the shooter, the ram and the zigzag) goes for the living player ship closest to it horizontally, and bombs and collisions hit either ship. On the guest of a two-player game attacks are not simulated: they arrive from the host.

- 2026-10-13 07:45 · Escort: when a yellow attacks, the two living reds in their slot closest to its column leave with it (the ones below if present, otherwise the nearest; one if only one is left). They do their own parabola and then descend in parallel below it, one on each side, with their own orientation. If the yellow is destroyed during its attack, as in the original game, its reds drop no more bombs in that attack (bombs already falling keep falling); they continue the dive on their own, exit at the bottom and return to their slots, and fire normally in later attacks.
- 2026-10-13 07:45 · Bombs: each ship drops at random between one and its type's maximum (blue and green 2, purple 3, red and yellow 4; orange none), at least 0.3 seconds apart, only while descending from height 90 of the screen down to 60 pixels above the player (the band the game already had; the earlier wording "between 90 and 60 pixels above the player" did not match it). They fall at 110 pixels per second keeping the horizontal speed the ship had when dropping them. The cyan does not drop them this way: it fires them in its burst.

- 2026-10-16 10:41 · Difficulty (partida/dificultad): the maximum of attacks at a time gets the level's attackers added (EASY −1, never below one; HARD +1) and the seconds between attacks are multiplied by the level's factor (EASY ×1.3, HARD ×0.75); NORMAL leaves both as they were (KF.dificultad.ataquesDeMas and factorPausa).
- 2026-10-21 20:22 · Derived from mejoras: The BOMBS upgrade (mejoras) slows the enemy bombs to 95% of their speed per level in one-player games.
- 2026-10-21 21:12 · Derived from mejoras/escudo-y-apoyo: bombs and diving ships destroy the support ships they touch.

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 4: random dive attacks with a gently irregular trajectory toward the player, dropping bombs that keep the ship's horizontal inertia; maximum bombs: blue 2, purple 3, red and yellow 4.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 5: the yellow attacks escorted by two reds (or one if no more are left) that go in parallel below it as a shield.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 6: a diving ship that reaches the edge of the screen reappears at the top and returns to its position in the formation.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 7: on leaving, a small upward parabola during which the ship rotates 180°, and then it orients itself (cannons) toward the player ship.
- 2026-10-03 18:22 · draft: Implement the dive attacks according to sources/KillerFlies.txt §§ 4 to 7, with the screenshots sources/KF1.JPG (yellow with escort) and sources/KF2.JPG (purple with bombs) as reference.
- 2026-10-03 18:40 · 1.A (§ 6: bottom edge; it exits at the bottom, reappears at the top and returns to its place)
- 2026-10-03 18:40 · 2.A (start with one or two attacks at a time and increase with each wave)
- 2026-10-03 18:40 · 3.A (do Formation and Player first, each in its own thread, and pick this one up afterwards)
- 2026-10-03 18:54 · Yes, the escort the two red ships below, if there are none, the nearest ones
- 2026-10-03 19:18 · Derived from partida: when the spare ship comes out, attacks wait 2 seconds before starting.
- 2026-10-04 10:52 · Derived from power-ups: notify when the yellow and its two red escorts are all three destroyed outside the formation.
- 2026-10-04 12:05 · Derived from enemigos/formacion: the new types' own attacks: zigzag (green), ramming without bombs (orange) and shooter with aimed burst (cyan).
- 2026-10-13 07:12 · Derived from multijugador: aim the attacks at the closest living player ship and let bombs and collisions hit either ship.
- 2026-10-13 07:32 · When, in a formation of a yellow ship plus one or two reds, the yellow ship is destroyed, the red ships stop firing.
- 2026-10-13 07:42 · The rule of the original game is that if the yellow dies, the reds stop firing.
- 2026-10-13 07:43 · The bombing band is perfect as it is.
- 2026-10-16 10:41 · Derived from partida/dificultad: one attacker less at a time and more spaced attacks in EASY, one more and closer attacks in HARD.
- 2026-10-21 20:22 · Derived from mejoras: slow the enemy bombs to 95% of their speed per level of the BOMBS upgrade in one-player games.
- 2026-10-21 21:12 · Derived from mejoras/escudo-y-apoyo: destroy a support ship when a bomb or a diving ship touches it.
