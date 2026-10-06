---
title: Sounds with more depth
status: draft
depends_on: [power-ups, partida, enemigos/formacion]
threads:
  - Sounds with more depth | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiKtDX1VB4yqoMRuygVESB5t
  - Real sounds | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFf1TgQJLpT3XvZn4f9CLXB
---
## Summary
The synthesized sounds are replaced by eight recorded ones given by the owner (assets/sonidos, played from js/sonido.js): shot, enemy explosion, yellow ship explosion, player explosion, attack sound while ships dive, power-up pickup, a tune at the start of each wave and background music that speeds up, with rising pitch, from 100% to 200% as the wave's ships are destroyed, and goes silent while the player ship is destroyed. Pending the owner's validation.

## Decisions
- 2026-10-05 10:55 · Takes over the draft of sounds with more depth that was inside `sonido`: it becomes its own child node (CVP rules version 8).
- 2026-10-06 15:45 · Each sound and its moment: 03 (assets/sonidos/disparo.mp3) on each player shot (KF.jugador.salvas, also with multiple shots); 07 (explosion-enemigo) when an alien ship is destroyed and 08 (explosion-amarilla) when it is a yellow one (KF.enemigos.alDestruir); 04 (explosion-jugador) when the player ship starts exploding; 05 (power-up) on each power received, extra life included (KF.powerups.recogidas); 02 (inicio-oleada) at the start of each wave, the first one included, that is, when the game starts.
- 2026-10-06 15:45 · Attack sound: 06 (ataque) replaces the buzz. It loops while any alien ship is leaving the formation or diving (not on the return to its slot) and fades out when none is. It no longer gets deeper as the ships descend.
- 2026-10-06 15:45 · [replaced by 2026-10-06 15:50] Background music: 00 (musica-fondo) loops while a game is being played, from the moment the wave-start tune ends; it is silent during that tune, on 'START GAME' and on 'GAME OVER'. Its speed goes from 100% with the whole wave to 200% with one ship left, in proportion to the ships destroyed, and the pitch rises with the speed, like a tape played faster. Each new wave starts again at 100%.
- 2026-10-06 15:45 · [replaced by 2026-10-06 15:50] Volumes, keeping the previous order: player explosion 1, yellow explosion 0.85, enemy explosion 0.75, wave-start tune and power-up 0.8, shot 0.5, attack sound 0.35 and background music 0.3 (KF.sonido.VOLUMENES).
- 2026-10-06 15:45 · The files have their leading and trailing silence cut, are converted to MP3 (the format every browser plays, Safari included) and are packed into js/sonidos-datos.js, so the game still sounds when index.html is opened from disk (architecture). The audio context is created on page load so the sounds are decoded in advance; it starts playing with the first key or touch, as before.
- 2026-10-06 15:50 · Background music: 00 (musica-fondo) loops while a game is being played, from the moment the wave-start tune ends; it is silent during that tune, on 'START GAME', on 'GAME OVER' and while the player ship is destroyed, from its explosion until the spare ship appears (the loop keeps running silently, so it comes back where it was and at the speed that matches the ships left). Its speed goes from 100% with the whole wave to 200% with one ship left, in proportion to the ships destroyed, and the pitch rises with the speed, like a tape played faster. Each new wave starts again at 100%.
- 2026-10-06 15:50 · Volumes, keeping the previous order: player explosion 1, yellow explosion 0.85, enemy explosion 0.75, wave-start tune and power-up 0.8, shot 0.5, attack sound 0.35 and background music 0.225, 25% lower than at first (KF.sonido.VOLUMENES).

## Requirements
- 2026-10-05 10:11 · Change the sounds to others with more depth
- 2026-10-05 10:16 · We include power-up and wave start
- 2026-10-05 10:16 · draft: Replace the current sounds (shot, explosions and attack buzz) with others with more depth (more layers, body and bass), keeping their moments and relative volumes, and add two new sounds of the same quality: one on picking up a power-up and another at the start of each wave.
- 2026-10-06 15:26 · I attach you 8 sound files (00 and 02 up to 08).
- 2026-10-06 15:26 · 00: Background music: The audio features a pattern that repeats four times. The idea is to keep this pattern playing in the background—at a moderate volume so it doesn't drown out the other sounds—and gradually increase its playback speed up to 200% as fewer enemy ships remain (with the final ship playing at the full 200% speed).
- 2026-10-06 15:26 · 02: Start game music
- 2026-10-06 15:26 · 03: Shoot (player's ship)
- 2026-10-06 15:26 · 04: Player's ship explosion
- 2026-10-06 15:26 · 05: Extra life (we use it for all the power-up activation)
- 2026-10-06 15:26 · 06: Sound when a enemy attacks
- 2026-10-06 15:26 · 07: Enemy ship explosion
- 2026-10-06 15:26 · 08: Boss explosion (yellow ship)
- 2026-10-06 15:32 · answer: sound at the start of each wave, with no file for it? → A (reuse 02 at the start of each wave)
- 2026-10-06 15:32 · answer: when the background music speeds up, does the pitch rise too? → A (yes, like a tape played faster)
- 2026-10-06 15:40 · Lower the background music volume a little (by 25%).
- 2026-10-06 15:40 · When the player ship is destroyed, it stops being heard until the new ship appears.
