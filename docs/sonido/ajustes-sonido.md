---
title: Sound settings
depends_on: [sonido, partida/pausa, graficos]
threads:
  - 2026-10-13 17:07 · Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - 2026-10-16 10:58 · Sound settings | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiA9ciq65uYqnPkDkSENqCxN
---
## Summary
The player sets the volume of the music and of the sound effects separately, in the pause menu: 'MUSIC 100%' and 'SOUNDS 100%' between 'CONTINUE' and 'RESTART'. Each goes 100%, 75%, 50%, 25% or OFF; choosing it (Enter, space or a tap) lowers it one step and from OFF goes back to 100%, and the left and right arrows lower or raise it without wrapping. MUSIC is the background music and the wave-start tune; SOUNDS is everything else (shot, explosions, attack sound, power-up). Both are remembered in the browser; with nothing saved they are at 100%. In js/sonido.js (KF.sonido.niveles, cambiarVolumen) with one gain per group; the menu is in js/pausa.js. Tested by tools/comprobar-sonido.mjs on every pull request. Validated by the owner.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 10:58 · Leaves the lab: executed. It is now the node sonido/ajustes-sonido, a child of Sound, which owns the volumes; the menu belongs to partida/pausa.
- 2026-10-16 10:58 · Groups: MUSIC is the background music and the wave-start tune; SOUNDS is the shot, the explosions, the attack sound and the power-up. Each group has its own gain between each sound's gain and the general one, so the balance between the sounds of a group is kept.
- 2026-10-16 10:58 · Levels: 100%, 75%, 50%, 25% and OFF. Choosing MUSIC or SOUNDS in the pause menu (Enter or space on release, or a tap on it) lowers it one step, wrapping from OFF to 100%, and keeps the game paused; the left arrow lowers and the right arrow raises, stopping at OFF and 100%. The menu shows the level next to each option ('MUSIC 75%', 'SOUNDS OFF').
- 2026-10-16 10:58 · The levels are saved in the browser (localStorage keys killerflies.musica and killerflies.sonidos, as a percentage) as soon as they change; with nothing saved, or an unknown value, the group is at 100%.
- 2026-10-16 10:58 · The change is heard on resuming, because the audio is silent while paused; no sample sound is played in the menu.
- 2026-10-16 10:58 · Two-player game: each device has its own settings, and only the player who paused sees the menu; the other player can pause later to change theirs.
- 2026-10-16 10:58 · Tested by tools/comprobar-sonido.mjs, run by the "Pruebas" workflow (routing of each sound to its group, the menu texts, Enter, the arrows, the taps, saving and reading the levels), and in the browser (Playwright: the menu with MUSIC 50% and SOUNDS OFF, and P resuming). Pending the owner's test on real devices.
- 2026-10-16 11:09 · Validated by the owner ("Ok, funciona").

## Requirements
- 2026-10-13 17:06 · idea: Let the player mute or lower the music and the sound effects separately.
- 2026-10-16 10:53 · Se puede aprovechar la pantalla de Pause para mutear música y sonidos.
- 2026-10-16 10:53 · Puedes pasarlo a producción
- 2026-10-16 10:55 · Ok con todo
- 2026-10-16 11:09 · Ok, funciona
