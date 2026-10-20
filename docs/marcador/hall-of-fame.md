---
title: Hall of fame
depends_on: [architecture/app-instalable]
threads:
  - Hall of fame | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi85PBYekPg2cZkUXJWUDppC
  - Hall of fame (development) | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiGqXyeWUw66XK8RHE2zG5ty
---
## Summary
After 'GAME OVER' in a one-player game, a key or a short tap opens the hall of fame instead of going back to 'START GAME'. If the points make the top 10 saved in the browser (more than 0 and, with the table full, more than the tenth), 'NEW HIGH SCORE' asks for the player's name (up to 8 letters, digits or spaces, pre-filled with the last name used): typed with the keyboard (Backspace deletes, Enter saves) or, on a touch screen, with an on-screen keyboard drawn in the game (A-Z, 0-9, SPACE, DEL, END). The name is saved with the wave reached and the points, and then 'HALL OF FAME' shows the 10 best (place, name, wave and points), the new one in yellow; it is shown even when the game did not get in. A key or a tap returns to 'START GAME'. One table for every difficulty; two-player games do not use it. Validated by the owner.

Files: js/salon-fama.js (KF.salonFama), opened from js/partida.js; checked by tools/comprobar-salon-fama.mjs in the "Pruebas" workflow.

Acceptance: at https://dinamicatech.github.io/KillerFlies/, on a computer and on a phone, end a one-player game with points, enter the name, see it in the hall of fame with its wave and points, and after reloading the page see it is still there.

## Decisions
- 2026-10-05 10:55 · Takes over the hall of fame draft that was inside `marcador`: it becomes its own child node (CVP rules version 8).

- 2026-10-16 11:35 · Flow: after 'GAME OVER' (with its 1 s guard) a one-player game goes to the hall of fame (KF.partida.estado 'fama'); closing it calls KF.partida.irAInicio. Two-player games, host or guest, go straight back to 'START GAME' as before.
- 2026-10-16 11:35 · Entering the table: points above 0 and, with 10 entries, strictly above the tenth; on a tie the entry already there stays ahead. Games started from a perfect count with their points.
- 2026-10-16 11:35 · Name: up to 8 characters from the game font (A-Z, 0-9 and space, no leading or double spaces), pre-filled with the last name used (killerflies.salonFama.ultimoNombre); an empty name is saved as 'PLAYER'. Keyboard: typing writes, Backspace deletes, Enter saves. Touch screen: an on-screen keyboard drawn in the game (A-Z, 0-9, SPACE, DEL, END), chosen over the phone's own keyboard because the game blocks touch defaults and opening the system keyboard is unreliable, above all in the installed app on iPhone.
- 2026-10-16 11:35 · Table: 'HALL OF FAME' with columns NAME, WAVE and POINTS and the place number, the new entry in yellow, 'NO SCORES YET' if empty; it is shown after every one-player game, whether it got in or not. It ignores keys and taps for 0.5 s, then any key or tap returns to 'START GAME'. The game is dimmed behind it.
- 2026-10-16 11:35 · Storage: one table for every difficulty, in localStorage under killerflies.salonFama as JSON [{nombre, oleada, puntos}], at most 10, best first; entries that make no sense are ignored. Without storage the new entry is shown but not kept.
- 2026-10-16 11:35 · Code in js/salon-fama.js (KF.salonFama: abrir, entra, confirmar, lista, tecla, toque), loaded after js/partida.js and saved for offline play (sw.js); test tools/comprobar-salon-fama.mjs in the "Pruebas" workflow.
- 2026-10-20 17:48 · Validated by the owner: the node becomes stable.

## Requirements
- 2026-10-05 10:15 · At the end of the game, if the score is within the last 10 best, ask for the player's name.
- 2026-10-05 10:15 · At the end of the game, show the 'hall of fame' of the top 10 scores, with the player's name, level reached and points
- 2026-10-05 10:16 · draft: When the game ends, if the points make the top 10 saved in the browser, ask for the player's name (with the keyboard and on mobile) and save it with the points and the wave reached; then show the 'hall of fame' with the 10 best scores (name, wave reached and points) before returning to 'START GAME'.
- 2026-10-16 11:28 · Pasa a desarrollo
- 2026-10-16 11:31 · Ok!
- 2026-10-20 17:48 · Validado
