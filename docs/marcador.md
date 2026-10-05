---
title: Scoreboard
depends_on: [enemigos, partida, architecture, jugador]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Scoreboard | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiEmsD9WvmtQFinsch84vnYn
---
## Summary
The on-screen information: current and best wave at the top left, points and high score at the top right, and the spare ships at the bottom right. High scores are saved in the browser as soon as they are beaten. It shows the values Game gives it (wave, spare ships, game start), with the font from Graphics. The 'hall of fame' (asking for the name on entering the top 10 and showing the best at the end of the game) is pending in the child draft `marcador/hall-of-fame`.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:18] Format: at the top left "wave/best wave" (e.g. "1/3") and at the top right "points/best points" (e.g. "350/1230"), 4 pixels from the edge, in white with a 5×7 pixel-art font drawn in code (digits and the slash only).
- 2026-10-03 19:10 · Spare ships: drawn at the bottom right, against the bottom edge below the player ship's strip, with the same drawing as the player ship; Graphics may give them a smaller drawing.
- 2026-10-03 19:10 · High scores: the best wave and the best points are saved in the browser's local storage as soon as they are beaten, so they are not lost if the tab is closed mid-game. If the browser does not allow saving, they last only while the page is open.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:18] Split with Game: Game tells the scoreboard the current wave, the spare ships left and when a game starts (points go back to zero); the scoreboard only shows them and updates the high scores. Until Game exists: wave 1 and two fixed spare ships.
- 2026-10-03 19:12 · Points: each alien ship destroyed, by the shot or by colliding with the player, adds its points (blue 10, purple 20, red 30, yellow 50); the scoreboard subscribes to Enemies' ship-destroyed notification.
- 2026-10-03 19:10 · Code in js/marcador.js (KF.marcador: sumarPuntos, reiniciarPuntos, ponerOleada, ponerRecambio), drawn on top of everything else.
- 2026-10-03 19:11 · Validated by the owner: the scoreboard is implemented and the node becomes stable.
- 2026-10-03 19:18 · Format: at the top left "wave/best wave" (e.g. "1/3") and at the top right "points/best points" (e.g. "350/1230"), 4 pixels from the edge, in white with the 5×7 pixel-art font from Graphics.
- 2026-10-03 19:18 · Split with Game: Game tells the scoreboard the current wave, the spare ships left and when a game starts (points go back to zero); the scoreboard only shows them and updates the high scores.
- 2026-10-05 10:55 · The hall of fame draft moves to its own child node, `marcador/hall-of-fame`, and Scoreboard goes back to stable: each draft is its own node (CVP rules version 8).

## Requirements
- 2026-10-03 18:13 · At the top left the wave number + "/" + the highest wave number reached by that player will be shown. At the top right, the points earned + "/" + the highest points earned by that player will be shown.
- 2026-10-03 18:13 · It has two spare ships (which appear tiny at the very bottom right)
- 2026-10-03 18:22 · Derived from enemigos: add up the points of each destroyed ship (blue 10, purple 20, red 30, yellow 50).
- 2026-10-03 18:22 · draft: Implement the scoreboard: wave/best wave at the top left, points/best points at the top right, small spare ships at the bottom right, and save the bests in the browser.
- 2026-10-03 19:10 · Derived from enemigos: also add the points of the ship that collides with the player; each destroyed ship is signalled with KF.enemigos.alDestruir.
- 2026-10-03 19:18 · Derived from partida: use the font from Graphics.
