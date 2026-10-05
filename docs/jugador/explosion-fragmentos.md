---
title: Explosion with fragments
depends_on: []
threads:
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Explosion with fragments | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi84jLToNjHSuRTTfkLNAWVf
---
## Summary
When it explodes, the player ship throws out 16 fragments of 1 or 2 pixels in the colors of its explosion, which scatter from its center, slowing down a little, and fade out within one second. Validated by the owner.

## Decisions
- 2026-10-05 11:51 · Created as a child draft of Player, one of the six to test Claude Visual Project's box stacking.
- 2026-10-05 12:23 · Fragments: when it explodes, the ship throws out 16 square fragments of 1 or 2 pixels from its center, in random directions, at between 30 and 90 pixels per second; they lose half their speed every second and fade out gradually until they disappear after 1 second. Each one has one of the explosion's colors (red, yellow, white or light blue). They are drawn on top of the three-phase explosion, which does not change, they damage nothing and they finish their path even if Game brings out the spare ship or the game ends. Code in js/jugador.js (KF.jugador.fragmentos, lanzarFragmentos, moverFragmentos); the colors are KF.graficos.COLORES_FRAGMENTOS.
- 2026-10-05 12:25 · Validated by the owner: becomes stable.

## Requirements
- 2026-10-05 11:51 · draft: Make the player ship's explosion throw out fragments that scatter and fade out.
