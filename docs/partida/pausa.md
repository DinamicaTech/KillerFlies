---
title: Pause
depends_on: [partida, multijugador, sonido, jugador/accelerometer-control, architecture]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Pause | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2dkB4NJNWoWWvUJAgpVGez
---
## Summary
Pausing a game, in js/pausa.js (KF.pausa): the P key, or a tap on the small II button at the top centre of touch screens, pauses and resumes; while paused any short tap resumes without shooting. The game also pauses by itself when the page is hidden (tab change, minimised window or locked phone) and never resumes by itself. Everything freezes, the sound goes silent and 'PAUSA' is shown in the centre; on resuming, the phone's position becomes the centre of the tilt again. In a two-player game both devices pause, show 'PAUSA J1' or 'PAUSA J2', and only the player who paused can resume. It came from the creative lab and is validated by the owner.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-13 17:16 · Leaves the lab: executed. It is now the node partida/pausa, a child of Game, which owns the game states.
- 2026-10-13 17:16 · When: only while playing (not on 'START GAME' or 'GAME OVER') and not while a two-player game is waiting for the other player. Everything freezes in place (KF.detenido() in js/base.js: only the parts marked enPausa are updated), the screen darkens and 'PAUSA' is written large in yellow in the centre, with 'P O TOCA PARA SEGUIR' (or 'P PARA SEGUIR' without a touch screen) in grey under it.
- 2026-10-13 17:16 · Controls: the P key pauses and resumes. On touch screens a small grey II button is drawn at the top centre, between the wave and the points, while playing; a short tap on it (within 16 logical pixels of the centre, near the top) pauses. While paused any short tap resumes. Neither tap shoots, and whatever was swiped or tapped during the pause is discarded on resuming.
- 2026-10-13 17:16 · Automatic pause: the game pauses when the page becomes hidden (visibilitychange: tab change, minimised window, locked phone). It never resumes by itself; the player resumes with P or a tap.
- 2026-10-13 17:16 · On resuming, the current position of the phone becomes the centre of the tilt (KF.inclinacion.calibrar, jugador/accelerometer-control), and the sound comes back (sonido).
- 2026-10-13 17:16 · Two-player game: a pause pauses both devices, which show 'PAUSA J1' or 'PAUSA J2' (who paused); only that player can resume, and the hint is only shown on their device. Every message between the devices carries who paused (z, 0 if nobody) and a version number (zv) that grows with each change; the newest wins, and on a tie the host's. If the player who paused leaves (the host carries on alone after 30 seconds, or the guest returns to the menu), the pause ends. While a page is hidden its game loop stops, so it keeps sending one message per second, so that the other player does not take the connection as lost (browsers may slow that timer down further after several minutes hidden, and then the disconnection rule of multijugador applies).
- 2026-10-13 17:16 · Tested in the browser: one-player game with the keyboard (P pauses and resumes, the formation and the sound stop, space does not shoot), with a touch screen (II pauses, a tap resumes, neither shoots) and hiding the page (pauses and stays paused when it is shown again); two-player game with a local PeerJS server (J2 pauses both, J1 cannot resume, J2 resumes; J1 hidden for 6 seconds without its game loop keeps the connection; J2 pausing and leaving ends the pause when the host carries on alone). Pending the owner's test on real devices.
- 2026-10-13 17:18 · Validated by the owner ("Works ok !"): the node becomes stable.

## Requirements
- 2026-10-13 17:06 · idea: Pause the game with the P key or a tap on a pause button, and pause it automatically when the browser tab changes or the phone is locked.
- 2026-10-13 17:09 · La pasamos a desarrollo, sí es importante poder pausar la partida.
- 2026-10-13 17:10 · go ahead
- 2026-10-13 17:18 · Works ok !
