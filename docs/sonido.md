---
title: Sound
depends_on: [architecture, jugador, enemigos, enemigos/ataque]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Sound | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi5jiNUVSiXE1749BDZmXrnT
  - Touch controls | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
---
## Summary
The game's sound effects, synthesized with Web Audio in js/sonido.js: a "pew" with each player shot, an explosion noise each time a ship is destroyed (deeper and longer if it is the player's) and a buzz while any alien ship leaves the formation or dives down. Sound is enabled with the first key pressed or the first touch on the screen.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 19:08 · Shot: a square-wave "pew" that drops from high to low pitch in 0.15 seconds, each time a shot leaves the player ship.
- 2026-10-03 19:08 · Explosion: filtered noise that fades out, each time a ship is destroyed, alien or the player's ("a ship" without distinction). An alien's lasts 0.5 seconds; the player's is deeper, louder and lasts 1.2 seconds. It hooks into the ship-destroyed notice from enemigos (KF.enemigos.alDestruir) and into the player ship switching to exploding.
- 2026-10-03 19:08 · [replaced by 2026-10-03 19:11] Attack buzz: it sounds during the whole dive, from when a ship leaves its slot until it exits at the bottom (not on the return to the formation), and gets deeper as the highest of the attacking ships descends. It stops when no ship is leaving or diving.
- 2026-10-03 19:11 · Attack buzz: it sounds during the whole dive, from when a ship leaves its slot until it exits at the bottom (not on the return to the formation), and gets deeper as the highest of the attacking ships descends. It stops when no ship is leaving or diving. Its volume is half the initial one (gain 0.04), so it does not dominate the other sounds.
- 2026-10-03 19:08 · [replaced by 2026-10-04 10:16] Sound only observes the game (shot, player state, ship-destroyed notice and attackers); the other parts do not call it. Audio starts with the first key, because browsers do not allow anything to play before that, and stops when the tab is hidden. Code in js/sonido.js.
- 2026-10-03 19:12 · Validated by the owner: the three sound effects are implemented and the node becomes stable.
- 2026-10-04 10:16 · Sound only observes the game (shot, player state, ship-destroyed notice and attackers); the other parts do not call it. Audio starts with the first key or on releasing the first touch on the touch screen, because browsers do not allow anything to play before that, and stops when the tab is hidden. Code in js/sonido.js.
- 2026-10-04 10:52 · The "pew" sounds each time the player ship shoots (KF.jugador.salvas), including with the power-ups' multiple shots and with the annihilation.
- 2026-10-05 10:16 · [replaced by 2026-10-05 10:55] Pending draft: sounds with more depth, plus a sound on picking up a power-up and another at the start of each wave (see Requirements). The current sounds remain in use until it is done.
- 2026-10-05 10:55 · The draft of sounds with more depth (plus a sound on picking up a power-up and another at the start of each wave) moves to its own child node, `sonido/sonidos-con-profundidad`, and Sound goes back to stable: each draft is its own node (CVP rules version 8). The current sounds remain in use until it is done.

## Requirements
- 2026-10-03 18:13 · There are sound effects: shots from the player ship; explosion noise when a ship is destroyed; buzz while an alien ship leaves the formation to make an attack.
- 2026-10-03 18:22 · draft: Synthesize the three sound effects (shot, explosion and attack buzz) and trigger them at their moments.
- 2026-10-03 19:07 · B (buzz during the whole dive)
- 2026-10-03 19:10 · The volume of the attacking ships 50% lower, it dominates too much
- 2026-10-04 10:16 · Derived from architecture: sound is also enabled with the first touch.
