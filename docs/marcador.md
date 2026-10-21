---
title: Scoreboard
depends_on: [enemigos, partida, architecture, jugador]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Scoreboard | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiEmsD9WvmtQFinsch84vnYn
  - Coins and upgrade shop | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
The on-screen information: current and best wave at the top left ('CHALLENGE' during the challenge wave, partida/oleada-desafio), points and high score at the top right, and the spare ships at the bottom right; in a two-player game, the points of P1 and P2 in their ship's colour at the top right and each player's spare ships at the bottom (P1 left, P2 right). While a combo multiplier is active (marcador/combos), 'X2' to 'X4' is shown under the points (in a two-player game, to the left of each player's points). High scores are saved in the browser as soon as they are beaten. It shows the values Game gives it (wave, spare ships, game start), with the font from Graphics. The 'hall of fame' (asking for the name on entering the top 10 and showing the 10 best at the end of a one-player game) is the child node `marcador/hall-of-fame`.
In a one-player game the coins of the current difficulty (mejoras) are shown at the bottom left: a coin and its balance.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:18] Format: at the top left "wave/best wave" (e.g. "1/3") and at the top right "points/best points" (e.g. "350/1230"), 4 pixels from the edge, in white with a 5×7 pixel-art font drawn in code (digits and the slash only).
- 2026-10-03 19:10 · Spare ships: drawn at the bottom right, against the bottom edge below the player ship's strip, with the same drawing as the player ship; Graphics may give them a smaller drawing.
- 2026-10-03 19:10 · High scores: the best wave and the best points are saved in the browser's local storage as soon as they are beaten, so they are not lost if the tab is closed mid-game. If the browser does not allow saving, they last only while the page is open.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:18] Split with Game: Game tells the scoreboard the current wave, the spare ships left and when a game starts (points go back to zero); the scoreboard only shows them and updates the high scores. Until Game exists: wave 1 and two fixed spare ships.
- 2026-10-03 19:12 · [replaced by marcador/combos 2026-10-16 08:42] Points: each alien ship destroyed, by the shot or by colliding with the player, adds its points (blue 10, purple 20, red 30, yellow 50); the scoreboard subscribes to Enemies' ship-destroyed notification.
- 2026-10-03 19:10 · [replaced by 2026-10-13 07:12] Code in js/marcador.js (KF.marcador: sumarPuntos, reiniciarPuntos, ponerOleada, ponerRecambio), drawn on top of everything else.
- 2026-10-03 19:11 · Validated by the owner: the scoreboard is implemented and the node becomes stable.
- 2026-10-03 19:18 · Format: at the top left "wave/best wave" (e.g. "1/3") and at the top right "points/best points" (e.g. "350/1230"), 4 pixels from the edge, in white with the 5×7 pixel-art font from Graphics.
- 2026-10-03 19:18 · [replaced by 2026-10-13 07:12] Split with Game: Game tells the scoreboard the current wave, the spare ships left and when a game starts (points go back to zero); the scoreboard only shows them and updates the high scores.
- 2026-10-05 10:55 · The hall of fame draft moves to its own child node, `marcador/hall-of-fame`, and Scoreboard goes back to stable: each draft is its own node (CVP rules version 8).
- 2026-10-13 07:12 · [replaced by 2026-10-15 07:40] Two players: at the top right 'J1 points' above 'J2 points', each in the colour of its ship's nose, and at the bottom each player's spare ships with its ship's drawing, J1 from the left and J2 from the right. Points belong to each player ship (KF.Nave.puntos) and go to whoever destroyed the alien ship. High scores of two-player games are kept apart (killerflies.dos.*) and count the points of this device's player; they are not shown on screen, only the best wave.
- 2026-10-13 07:12 · Split with Game: Game tells the scoreboard the current wave and when a game starts (one or two players, for the high scores); each player ship carries its spare ships and points, and the scoreboard only shows them and updates the high scores.
- 2026-10-13 07:12 · Code in js/marcador.js (KF.marcador: cambiarModo, ponerOleada), drawn on top of everything else; points and spare ships are read from the player ships.
- 2026-10-15 07:40 · Two players: at the top right 'P1 points' above 'P2 points' (the players' on-screen names in English, multijugador), each in the colour of its ship's nose, and at the bottom each player's spare ships with its ship's drawing, P1 from the left and P2 from the right. Points belong to each player ship (KF.Nave.puntos) and go to whoever destroyed the alien ship. High scores of two-player games are kept apart (killerflies.dos.*) and count the points of this device's player; they are not shown on screen, only the best wave.
- 2026-10-15 08:55 · During the challenge wave the top left shows 'CHALLENGE' instead of the wave.
- 2026-10-16 08:42 · Points: each alien ship destroyed, by the shot or by colliding with the player, adds its points (blue 10, purple 20, red 30, yellow 50, green 40, orange 60, cyan 80) times the combo multiplier of the player who destroyed it (marcador/combos, js/combos.js, which subscribes to Enemies' ship-destroyed notification).
- 2026-10-16 11:35 · The hall of fame is built in its child node marcador/hall-of-fame (js/salon-fama.js); it keeps its own table, apart from the high scores shown here.
- 2026-10-21 20:22 · Derived from mejoras: In a one-player game the coins of the current difficulty (mejoras) are shown at the bottom left: a coin and its balance.

## Requirements
- 2026-10-03 18:13 · At the top left the wave number + "/" + the highest wave number reached by that player will be shown. At the top right, the points earned + "/" + the highest points earned by that player will be shown.
- 2026-10-03 18:13 · It has two spare ships (which appear tiny at the very bottom right)
- 2026-10-03 18:22 · Derived from enemigos: add up the points of each destroyed ship (blue 10, purple 20, red 30, yellow 50).
- 2026-10-03 18:22 · draft: Implement the scoreboard: wave/best wave at the top left, points/best points at the top right, small spare ships at the bottom right, and save the bests in the browser.
- 2026-10-03 19:10 · Derived from enemigos: also add the points of the ship that collides with the player; each destroyed ship is signalled with KF.enemigos.alDestruir.
- 2026-10-03 19:18 · Derived from partida: use the font from Graphics.
- 2026-10-13 07:12 · Derived from multijugador: show the points and spare ships of both players in a two-player game.
- 2026-10-15 07:40 · Derived from multijugador: show the players as P1 and P2 on screen.
- 2026-10-15 08:55 · Derived from partida/oleada-desafio: show 'CHALLENGE' instead of the wave during the challenge wave.
- 2026-10-16 08:42 · Derived from marcador/combos: multiply the points by the combo of whoever destroys the ship and show the multiplier under the points while it is active.
- 2026-10-21 20:22 · Derived from mejoras: show the coin balance of the current difficulty at the bottom left in one-player games.
