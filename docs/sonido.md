---
title: Sound
depends_on: [architecture, jugador, enemigos, enemigos/ataque]
threads:
  - 2026-10-03 18:15 · New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - 2026-10-03 19:08 · Sound | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi5jiNUVSiXE1749BDZmXrnT
  - 2026-10-04 10:16 · Touch controls | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - 2026-10-04 10:48 · Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - 2026-10-16 10:58 · Sound settings | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiA9ciq65uYqnPkDkSENqCxN
  - 2026-10-06 15:35 · Real sounds | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFf1TgQJLpT3XvZn4f9CLXB
  - 2026-10-21 17:39 · Coins and upgrade shop | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
The game's sounds, recorded audio files played with Web Audio from js/sonido.js (the detail is in sonido/sonidos-con-profundidad): the shot, the explosions of alien ships (a different one for the yellow), the player's explosion, a sound while alien ships attack, a sound on each power-up, a tune at the start of each wave and background music that speeds up as fewer ships remain (at its starting speed during the challenge wave, partida/oleada-desafio, and the mothership boss, enemigos/jefe). Each hit on the mothership plays the alien explosion and its destruction the yellow's. Sound is enabled with the first key pressed or the first touch on the screen, and goes silent while the page is hidden or the game is paused (partida/pausa). The music and the other sounds have separate volumes, set in the pause menu (sonido/ajustes-sonido).
Picking up a coin and buying an upgrade (mejoras) play the power-up sound.
A broken shield or a lost support ship (mejoras/escudo-y-apoyo) sounds like an enemy ship exploding.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 19:08 · [replaced by sonido/sonidos-con-profundidad 2026-10-06 15:45] Shot: a square-wave "pew" that drops from high to low pitch in 0.15 seconds, each time a shot leaves the player ship.
- 2026-10-03 19:08 · [replaced by sonido/sonidos-con-profundidad 2026-10-06 15:45] Explosion: filtered noise that fades out, each time a ship is destroyed, alien or the player's ("a ship" without distinction). An alien's lasts 0.5 seconds; the player's is deeper, louder and lasts 1.2 seconds. It hooks into the ship-destroyed notice from enemigos (KF.enemigos.alDestruir) and into the player ship switching to exploding.
- 2026-10-03 19:08 · [replaced by 2026-10-03 19:11] Attack buzz: it sounds during the whole dive, from when a ship leaves its slot until it exits at the bottom (not on the return to the formation), and gets deeper as the highest of the attacking ships descends. It stops when no ship is leaving or diving.
- 2026-10-03 19:11 · [replaced by sonido/sonidos-con-profundidad 2026-10-06 15:45] Attack buzz: it sounds during the whole dive, from when a ship leaves its slot until it exits at the bottom (not on the return to the formation), and gets deeper as the highest of the attacking ships descends. It stops when no ship is leaving or diving. Its volume is half the initial one (gain 0.04), so it does not dominate the other sounds.
- 2026-10-03 19:08 · [replaced by 2026-10-04 10:16] Sound only observes the game (shot, player state, ship-destroyed notice and attackers); the other parts do not call it. Audio starts with the first key, because browsers do not allow anything to play before that, and stops when the tab is hidden. Code in js/sonido.js.
- 2026-10-03 19:12 · Validated by the owner: the three sound effects are implemented and the node becomes stable.
- 2026-10-04 10:16 · Sound only observes the game (shot, player state, ship-destroyed notice and attackers); the other parts do not call it. Audio starts with the first key or on releasing the first touch on the touch screen, because browsers do not allow anything to play before that, and stops when the tab is hidden. Code in js/sonido.js.
- 2026-10-04 10:52 · [replaced by sonido/sonidos-con-profundidad 2026-10-06 15:45] The "pew" sounds each time the player ship shoots (KF.jugador.salvas), including with the power-ups' multiple shots and with the annihilation.
- 2026-10-05 10:16 · [replaced by 2026-10-05 10:55] Pending draft: sounds with more depth, plus a sound on picking up a power-up and another at the start of each wave (see Requirements). The current sounds remain in use until it is done.
- 2026-10-05 10:55 · The draft of sounds with more depth (plus a sound on picking up a power-up and another at the start of each wave) moves to its own child node, `sonido/sonidos-con-profundidad`, and Sound goes back to stable: each draft is its own node (CVP rules version 8). The current sounds remain in use until it is done.
- 2026-10-06 15:45 · [replaced by 2026-10-06 15:58] The synthesized sounds are replaced by recorded ones and two are added (power-up and wave start), plus background music; the detail is in the child node sonido/sonidos-con-profundidad, still a draft until the owner validates it.
- 2026-10-06 15:58 · The synthesized sounds are replaced by recorded ones and two are added (power-up and wave start), plus background music; the detail is in the child node sonido/sonidos-con-profundidad, validated by the owner and stable.
- 2026-10-13 07:12 · Two players: shots, explosions and the background music take every player ship into account (music is silent only when no ship is in play). On the guest of a two-player game the sounds come from the changes the host's snapshots bring, so both devices hear the same.
- 2026-10-13 17:16 · Silence: the audio is suspended while the page is hidden or the game is paused (KF.pausa.activa, partida/pausa) and resumes when neither applies (KF.sonido.ajustarSilencio in js/sonido.js).
- 2026-10-15 08:55 · During the challenge wave the background music plays at its starting speed; its extra ship plays the power-up sound.
- 2026-10-16 10:30 · With the mothership boss (enemigos/jefe), the music plays at its starting speed, each hit plays the alien explosion (Sound watches KF.jefe.impactos) and its destruction the yellow's explosion.
- 2026-10-16 10:58 · Volumes: the music (background and wave start) and the other sounds go through separate gains, each at 100%, 75%, 50%, 25% or OFF, set in the pause menu and remembered in the browser; the detail is in the child node sonido/ajustes-sonido.
- 2026-10-21 20:22 · Derived from mejoras: Picking up a coin and buying an upgrade (mejoras) play the power-up sound.

## Requirements
- 2026-10-03 18:13 · There are sound effects: shots from the player ship; explosion noise when a ship is destroyed; buzz while an alien ship leaves the formation to make an attack.
- 2026-10-03 18:22 · draft: Synthesize the three sound effects (shot, explosion and attack buzz) and trigger them at their moments.
- 2026-10-03 19:07 · B (buzz during the whole dive)
- 2026-10-03 19:10 · The volume of the attacking ships 50% lower, it dominates too much
- 2026-10-04 10:16 · Derived from architecture: sound is also enabled with the first touch.
- 2026-10-13 07:12 · Derived from multijugador: sound the same on both devices of a two-player game.
- 2026-10-13 17:16 · Derived from partida/pausa: go silent during the pause and sound again on resuming.
- 2026-10-15 08:55 · Derived from partida/oleada-desafio: during the challenge wave, play the background music at its starting speed, and play the power-up sound for its extra ship.
- 2026-10-16 10:30 · Derived from enemigos/jefe: sounds for the hits and the destruction of the mothership boss, and the music at its starting speed meanwhile.
- 2026-10-16 10:58 · Derived from sonido/ajustes-sonido: separate volumes for the music and the other sounds.
- 2026-10-21 20:22 · Derived from mejoras: play a sound when a coin is picked up and when an upgrade is bought, reusing an existing sound.
- 2026-10-21 21:12 · Derived from mejoras/escudo-y-apoyo: a sound when the shield breaks or a support ship is lost.
