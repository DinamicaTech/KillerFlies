---
title: Attack
depends_on: [enemigos, enemigos/formacion, jugador, graficos, architecture]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Dive attacks | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFJ5MweEGxxYP7n8Day6kv9
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
The attacks: a ship (or a yellow with its escort of reds) leaves the formation with a small parabola, turns, dives toward the player dropping bombs and, if it does not collide, exits at the bottom, reappears at the top and returns to its place. The new types come down in their own way: the green in zigzag, the orange rams in a straight line without bombs and the cyan stops at mid-screen and fires an aimed burst. One or two attacks start at a time and there are more with each wave, which also makes them faster. When the player's spare ship comes out, attacks wait two seconds. The yellow leaves with the two reds below it (or the nearest ones). An attacking ship that collides with the player makes it explode and is destroyed; the player's shot also hits it.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:40 · The edge in § 6 is the bottom one: the diving ship that exits at the bottom reappears at the top and returns to its slot in the formation.
- 2026-10-03 18:40 · Attack pace: one or two attacks at a time at first, and more with each wave.
- 2026-10-03 18:40 · Order: this node is implemented after enemigos/formacion and jugador, which are still drafts without code; until then it stays as a draft.
- 2026-10-03 19:05 · Exit: the ship leaves its slot with an upward half-turn of 12 pixel radius in 0.8 seconds, toward the side of the screen it is on, and rotates 180° while doing it.
- 2026-10-03 19:05 · Dive: it descends at 70 pixels per second; while it is above the player it veers toward them (up to 55 pixels per second horizontally) with a gentle oscillation that makes the trajectory irregular, and points its cannons at them. Once past the player it continues straight.
- 2026-10-03 19:05 · [replaced by 2026-10-04 12:05] Bombs: each ship drops at random between one and its type's maximum (blue 2, purple 3, red and yellow 4), at least 0.3 seconds apart, only while descending between 90 and 60 pixels above the player. They fall at 110 pixels per second keeping the horizontal speed the ship had when dropping them.
- 2026-10-03 19:05 · Escort: when a yellow attacks, the two living reds in their slot closest to its column leave with it (the ones below if present, otherwise the nearest; one if only one is left). They do their own parabola and then descend in parallel below it, one on each side, with their own orientation. If the yellow is destroyed, they continue the dive on their own.
- 2026-10-03 19:05 · Return: the ship that exits at the bottom reappears at the top above its slot, descends to it following the formation's sway, straightens up in the last 60 pixels and rejoins the formation.
- 2026-10-03 19:05 · [replaced by 2026-10-03 19:18] Pace: the first attack comes at 2 seconds and then every 1.5 to 3 seconds (10% less per wave); 1 + wave number attacks fit at the same time, up to 6 (the yellow with its escort counts as one). Yellows are chosen three times as often as the rest. No attack starts while the player ship is exploding. Game will provide the wave number (KF.ataque.oleada) and a speed multiplier for the dive and the bombs (KF.ataque.factorVelocidad); for now it is wave 1 at normal speed.
- 2026-10-03 19:05 · Collisions: a bomb or a diving ship that touches the player ship makes it explode; the alien ship that collides is destroyed, as in the arcade. The player's shot also destroys diving ships. Points are left to Scoreboard and the buzzing to Sound.
- 2026-10-03 19:05 · Code in js/ataque.js; the bomb sprite and the rotated drawing of the ships in js/graficos.js.
- 2026-10-03 19:02 · Validated by the owner: dive attacks are implemented and the node becomes stable.
- 2026-10-03 19:18 · Pace: the first attack comes at 2 seconds and then every 1.5 to 3 seconds (10% less per wave); 1 + wave number attacks fit at the same time, up to 6 (the yellow with its escort counts as one). Yellows are chosen three times as often as the rest. No attack starts while the player ship is not in play (exploding or out of the game). When the spare ship comes out, attacks again wait 2 seconds (KF.ataque.tregua). Game provides the wave number (KF.ataque.oleada) and the speed multiplier for the dive and the bombs (KF.ataque.factorVelocidad), 5% more per wave.
- 2026-10-04 10:52 · Escort and power-ups: the yellow that leaves with two reds forms a group; when all three are destroyed outside the formation, Attack notifies whoever subscribes with KF.ataque.alDestruirEscolta(fn(x, y)), with the position of the last one. A ship that has already returned to its slot no longer counts.
- 2026-10-04 12:05 · Bombs: each ship drops at random between one and its type's maximum (blue and green 2, purple 3, red and yellow 4; orange none), at least 0.3 seconds apart, only while descending between 90 and 60 pixels above the player. They fall at 110 pixels per second keeping the horizontal speed the ship had when dropping them. The cyan does not drop them this way: it fires them in its burst.
- 2026-10-04 12:05 · Zigzag (green): after the exit it descends at 70 pixels per second in a tight side-to-side zigzag (lateral speed up to 75 pixels per second, about 1.4 seconds per round trip) with a slight drift toward the player, oriented according to its heading.
- 2026-10-04 12:05 · Ramming (orange): after the exit it aims at where the player is at that moment and charges in a straight line toward that point at twice the dive speed (140 pixels per second), without bombs; it does not correct its course.
- 2026-10-04 12:05 · Shooter (cyan): it descends like the dive down to mid-screen (height 144), hovers for one second with its cannons toward the player and halfway through fires a fan-shaped burst, aimed at them, with its attack's bombs (one to three, 30 pixels per second of lateral speed apart); then it continues descending.
- 2026-10-04 12:05 · The reds escorting a yellow always go down with it; the new attacks are only for the green, orange and cyan types, which never escort.

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
