---
title: 21st-century ships
depends_on: [enemigos]
threads:
  - Less pixelated ships | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi78ZNHwzRnK9ZGpD1boPKcb
  - 21st-century ships | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiLhC4qt67cPrzNnZtpQV8tk
---
## Summary
The seven enemy ships and the player's as "21st-century ships" with a retro flavour: drawn by code with smooth strokes, metallic gradients, highlights and lights, at four times the resolution of the logical screen, with the same colours, on-screen sizes and silhouette for each type. Bombs, shots, explosions, stars and texts stay pixelated.

## Decisions
- 2026-10-05 11:45 · Created as a draft child of Graphics, the node that owns all the sprites (js/graficos.js).
- 2026-10-05 13:00 · Sprites based on sources/KF1.JPG and sources/KF2.JPG, in js/graficos.js, which also provides each sprite pre-coloured (KF.graficos.SPRITES_NAVE, SPRITE_JUGADOR, SPRITE_DISPARO, SPRITE_BOMBA, SPRITES_EXPLOSION_JUGADOR, SPRITES_EXPLOSION_NAVE); the other parts only use them. The ships (the seven alien ones and the player's) are drawn by code with strokes and gradients at KF.RESOLUCION (4) times the resolution of the logical screen and look smoothed; everything else stays as pixel maps. Sprites are measured in logical pixels and can be drawn centred and rotated to any angle (used by diving ships).
- 2026-10-05 13:00 · Alien ships of 11×9 logical pixels, "21st-century" style: oval hull with a metallic gradient that narrows into a pointed tail, two antennae with lit tips, arms with the tips pointing up, glowing eyes and swept-back wings under the arms with an illuminated edge. Colours: blue (light-blue body, blue wings), purple (purple body and wings), red (red body, light-blue wings), green (green body, white eyes, dark-green wings), orange (orange body, dark eyes, reddish wings) and cyan (light-cyan body, dark eyes, pink wings). The yellow one (mothership), 11×10: bright orange dome with a reflection and eyes, yellow hull with white trim and lights, dark-blue fins on the sides and a stinger tail. No wing-flapping in the formation.
- 2026-10-05 13:00 · Player ship of 13×13 logical pixels: red arrow-shaped nose with a reflection and three columns (fuselage and two engines) of white metallic hull with a lit light-blue interior, joined by crossbars and with glowing nozzles. Shot: yellow line of 1×4. Bombs: white line of 2×6. Player explosion in three phases (red, yellow and white, with light-blue debris); alien ships' explosion in four phases, a flash that opens into a ring of sparks.
- 2026-10-05 13:01 · Validated by the owner: becomes stable.

## Requirements
- 2026-10-05 11:43 · draft: Improve the design of the enemy ships so they are not so pixelated with a retro flavour. Let's say we are going to turn them into 21st-century ships
- 2026-10-05 11:44 · draft: Redesign the seven enemy ships so they don't look so pixelated, turning them into "21st-century ships" with a retro flavour: more resolution and detail than the 224×288 logical screen, keeping their colours, on-screen sizes and the silhouette of each type.
- 2026-10-05 12:50 · Improve the design of the enemy ships and the player's so they are not so pixelated with a retro flavour. Let's say we are going to turn them into 21st-century ships
- 2026-10-05 12:56 · A (ships drawn with smooth strokes, metallic gradients, highlights and glowing eyes)
