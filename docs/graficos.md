---
title: Graphics
depends_on: [architecture, enemigos]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Enemy formation | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Graphics | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiDr96WsqVT3NCseBCYwgNre
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
  - Coins and upgrade shop | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
The game's visual look: the screen, the background and the sprites of all ships, bombs, shots and explosions, using the arcade screenshots as reference. Everything is in js/graficos.js: a background of coloured stars that drift down and twinkle, the pre-coloured sprites the other parts of the game use (the ships drawn in detail at a higher resolution, as "21st-century ships", the mothership boss among them; everything else in pixel art) and the pixel-art font for the texts.
It also has the spinning silver coin, the little pilot (two walking steps), the shop with its striped awning and the red slow fire capsule (mejoras).
And the support ship of the WINGMAN upgrade: the player 1 ship, smaller, with a green interior.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:44 · [replaced by 2026-10-03 19:08] Vertical screen like the arcade, 224×288 logical pixels scaled to the window. Black background for now; the star background from the screenshots remains pending in this node.
- 2026-10-03 18:44 · [replaced by 2026-10-03 19:08] Provisional sprites of the four alien ships in formation, defined as pixel maps in js/graficos.js; this node will refine them from the screenshots.
- 2026-10-03 18:46 · [replaced by 2026-10-03 19:08] Provisional sprites of the player ship (white with red and blue details), its shot (yellow line) and its explosion in three phases, as pixel maps in js/graficos.js; this node will refine them from the screenshots.
- 2026-10-03 19:05 · [replaced by 2026-10-03 19:08] Rotated drawing: ships can be drawn centred and rotated to any angle (used by diving ships). Provisional bomb sprite: vertical white line of 1×5 pixels, in js/graficos.js.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:08] Provisional sprite of the alien ships' explosion, in three phases (red, yellow and white), as pixel maps in js/graficos.js; this node will refine it.
- 2026-10-03 19:08 · Vertical screen like the arcade, 224×288 logical pixels scaled to the window, with a star background: 70 coloured dots (mostly white) that move down at 12 pixels per second and twinkle, each at its own rhythm. It is drawn behind everything.
- 2026-10-03 19:08 · [replaced by graficos/naves-siglo-xxi 2026-10-05 13:00] Sprites based on sources/KF1.JPG and sources/KF2.JPG, as pixel maps in js/graficos.js, which also provides each sprite pre-coloured (KF.graficos.SPRITES_NAVE, SPRITE_JUGADOR, SPRITE_DISPARO, SPRITE_BOMBA, SPRITES_EXPLOSION_JUGADOR, SPRITES_EXPLOSION_NAVE); the other parts only use them. Ships can be drawn centred and rotated to any angle (used by diving ships).
- 2026-10-03 19:08 · [replaced by graficos/naves-siglo-xxi 2026-10-05 13:00] Alien ships 11 pixels wide, with two antennae, arms with the tips pointing up, eyes and wings under the arms: blue (light-blue body, blue wings), purple (purple body and wings), red (red body, light-blue wings). The yellow one (mothership) has an orange dome, yellow body with white edges, dark-blue wings and a tail. No wing-flapping in the formation (the owner accepted the recommendation).
- 2026-10-03 19:08 · [replaced by graficos/naves-siglo-xxi 2026-10-05 13:00] Player ship of 13×13 pixels: red dome and three white columns filled with light blue. Shot: yellow line of 1×4. Bombs: white line of 2×6. Player explosion in three phases (red, yellow and white, with light-blue debris); alien ships' explosion in four phases, a flash that opens into a ring of sparks.
- 2026-10-03 19:11 · Validated by the owner: becomes stable.
- 2026-10-03 19:18 · [replaced by 2026-10-16 10:41] Font: a single 5×7 pixel-art font for all texts, with digits, slash, letters A to Z and space, in js/graficos.js (KF.graficos.crearFuente(color), escribir and anchoTexto, with a scale to enlarge it). It comes from the digit font the scoreboard had.
- 2026-10-04 10:52 · Power-ups: 5×7 capsule (two sprites, blue with a yellow stripe and pink with a white stripe, for the blinking; KF.graficos.SPRITES_CAPSULA), player bomb as a 3×3 orange diamond (SPRITE_BOMBA_JUGADOR) and the wave of its explosion, a yellow and orange circle that expands and fades out (dibujarOnda).
- 2026-10-04 12:05 · [replaced by graficos/naves-siglo-xxi 2026-10-05 13:00] New ships: green (green body, white eyes, dark-green wings), orange (orange body, dark eyes, reddish wings) and cyan (light-cyan body, dark eyes, pink wings), with the same 11-pixel drawing as the blue, purple and red ones.
- 2026-10-05 12:05 · Muzzle flash of the player ship's cannon when shooting: 5×3 white star with a yellow centre (KF.graficos.SPRITE_DESTELLO), for jugador/destello-disparo.
- 2026-10-05 12:23 · Colours of the player explosion fragments: the same red, yellow, white and light blue as its explosion (KF.graficos.COLORES_FRAGMENTOS), for jugador/explosion-fragmentos.
- 2026-10-05 12:43 · Engine flame of the player ship: two 3×3 shapes, orange with a yellow tip, that alternate to flicker (KF.graficos.SPRITES_LLAMA), for jugador/estela-motor.
- 2026-10-13 07:12 · Two players: SPRITES_JUGADOR has the J1 ship (red nose, light-blue interior) and the J2 ship (green nose, amber interior); COLORES_JUGADOR gives each player's colour for the scoreboard texts.
- 2026-10-16 10:30 · The mothership boss (enemigos/jefe) is drawn by code in the 21st-century ships style (dibujarJefe): a purple saucer with swept wings, a cyan dome with red eyes, three cannons and a row of lights; SPRITE_JEFE and a white silhouette, SPRITE_JEFE_BLANCO, for the flash of each hit.
- 2026-10-16 10:41 · [replaced by 2026-10-16 10:58] Font: a single 5×7 pixel-art font for all texts, with digits, slash, '<' and '>', letters A to Z and space, in js/graficos.js (KF.graficos.crearFuente(color), escribir and anchoTexto, with a scale to enlarge it). It comes from the digit font the scoreboard had; '<' and '>' frame the difficulty line of the start menu (partida/dificultad).
- 2026-10-16 10:58 · Font: a single 5×7 pixel-art font for all texts, with digits, slash, '%', '<' and '>', letters A to Z and space, in js/graficos.js (KF.graficos.crearFuente(color), escribir and anchoTexto, with a scale to enlarge it). It comes from the digit font the scoreboard had; '<' and '>' frame the difficulty line of the start menu (partida/dificultad) and '%' shows the volumes in the pause menu (sonido/ajustes-sonido).
- 2026-10-20 17:56 · Player ship with each power-up, for power-ups/aspecto-nave: dibujarJugador(ctx, palette, power) changes the interior colour (INTERIOR_PODER) and adds a detail per power, keeping the 13×13 size and the player's nose colour; KF.graficos.SPRITES_JUGADOR_PODER[player][power] holds them for both players. Rapid: yellow interior and two swept fins at the sides. Deep: violet interior and a long violet cannon through the nose. Bomb: orange interior and an orange diamond under the nose. Annihilation: white interior. Slow fire: dull grey interior and unlit nozzles. Triple: green interior and a cannon on the tip of each side engine. Extra life has no look of its own.
- 2026-10-21 20:22 · Derived from mejoras: It also has the spinning silver coin, the little pilot (two walking steps), the shop with its striped awning and the red slow fire capsule (mejoras).
- 2026-10-22 11:15 · Derived from mejoras/skins: it also has the sprites of the two skins (SKIN BLUE, SKIN GOLD) with every power-up variant, the blue engine flame (TRAIL), the plasma explosions and fragments (BLAST) and the nebula star colours (STARS), which the starfield uses while STARS is on.

## Requirements
- 2026-10-03 18:13 · I attach two screenshots as visual reference. In the first one, a formation of a yellow ship and two red ones descends to attack. In the second one, a purple ship descends towards the player ship while two bombs (somewhat thick vertical white lines) are falling.
- 2026-10-03 18:22 · draft: Draw the screen and the pixel-art sprites (player ship, four alien ships, shot, bombs, explosion) based on sources/KF1.JPG and sources/KF2.JPG.
- 2026-10-03 18:40 · Derived from enemigos/ataque: the alien ships are drawn rotated to any angle (180° turn when leaving and orientation towards the player in the dive).
- 2026-10-03 18:42 · 2. A (vertical screen like the arcade, scaled to the window, black background for now; the stars are left for Graphics)
- 2026-10-03 18:44 · Derived from enemigos/formacion: sprites of the four alien ships in formation.
- 2026-10-03 18:42 · Derived from jugador: sprites of the player ship, its shot and its explosion.
- 2026-10-03 19:05 · Derived from enemigos/ataque: sprite of the alien ships' bomb.
- 2026-10-03 19:10 · Derived from enemigos: provisional sprite of the alien ships' explosion.
- 2026-10-03 19:18 · Derived from partida: pixel-art font of letters and digits for the texts.
- 2026-10-04 10:52 · Derived from power-ups: drawing of the blinking capsule and of the bomb's explosion.
- 2026-10-04 12:05 · Derived from enemigos/formacion: the sprites of the green, orange and cyan ships.
- 2026-10-05 12:05 · Derived from jugador/destello-disparo: sprite of the cannon's muzzle flash (SPRITE_DESTELLO).
- 2026-10-05 12:43 · Derived from jugador/estela-motor: sprites of the engine flame (SPRITES_LLAMA).
- 2026-10-13 07:12 · Derived from multijugador: draw the second player's ship in another colour.
- 2026-10-16 10:30 · Derived from enemigos/jefe: the sprite of the mothership boss and its white version for the hits.
- 2026-10-16 10:41 · Derived from partida/dificultad: the '<' and '>' characters in the font.
- 2026-10-16 10:58 · Derived from sonido/ajustes-sonido: the '%' character in the font.
- 2026-10-20 17:56 · Derived from power-ups/aspecto-nave: one player ship sprite for each power, for both player colours.
- 2026-10-21 20:22 · Derived from mejoras: provide the sprites of the coin, the pilot, the shop and the red slow fire capsule.
- 2026-10-21 21:12 · Derived from mejoras/escudo-y-apoyo: provide the support ship sprite.
- 2026-10-22 11:15 · Derived from mejoras/skins: provide the skin, flame, plasma explosion and star colour variants of the cosmetics.
