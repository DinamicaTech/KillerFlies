---
title: Game
depends_on: [jugador, enemigos, enemigos/formacion, enemigos/ataque, marcador, graficos]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Game cycle | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCY7xaWMqRabakQpAk9ek7y
  - Touch controls | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
The game cycle, in js/partida.js: a 'START GAME' screen with the formation moving behind it and a menu ('1 JUGADOR', 'CREAR PARTIDA', 'UNIRSE'; any key or a short tap starts a one-player game, as before); successive waves, each 5% faster than the previous one in everything (block, dives and bombs); three player ships (one in play and two spares, which the extra life power-up can raise up to five) and 'GAME OVER' on losing the last one, which stays until a key is pressed or a short tap is made and then returns to 'START GAME'. It tells the scoreboard the wave; each player ship carries its spare ships and points. In a two-player game (multijugador) each player has their own ships and the game ends when neither has any. A game can be paused while playing (partida/pausa).

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 19:18 · States: start ('START GAME'), playing and end ('GAME OVER'). The messages are written large (graphics font at double size) in the centre of the screen: 'START GAME' in yellow and 'GAME OVER' in red.
- 2026-10-03 19:18 · [replaced by 2026-10-04 10:16] Start: the formation of the first wave moves behind the text without attacking, because the player ship is not there. Any key starts the game: points at zero, wave 1, two spare ships and the player ship in the centre.
- 2026-10-03 19:18 · [replaced by 2026-10-04 12:05] Waves: two seconds after destroying the last ship of the wave (with the player ship in play) the next one arrives, with the full formation. Each wave is 5% faster than the previous one (cumulative and uncapped) in everything: the block's movement, the dives and the bombs (KF.ataque.factorVelocidad). In addition, Attack launches more attacks, closer together, as the wave number grows (KF.ataque.oleada).
- 2026-10-03 19:18 · [replaced by 2026-10-13 07:12] Lost ships: the wave carries on as it was. At least two seconds after exploding, and once the diving ships have returned to the formation and no bombs are left, the spare ship comes out in the centre, the scoreboard deducts it and the attacks wait two seconds before starting.
- 2026-10-03 19:18 · [replaced by 2026-10-04 10:16] End: on losing the last ship, two seconds after it explodes 'GAME OVER' appears and stays until a key is pressed; then it returns to 'START GAME'. Keys pressed during the first second of 'GAME OVER' do not count, so it is not skipped by accident while shooting.
- 2026-10-03 19:18 · [replaced by marcador 2026-10-13 07:12] Scoreboard: Game gives it the current wave and the spare ships left, and sets the points to zero at the start of each game.
- 2026-10-03 19:18 · Code in js/partida.js (KF.partida), which is drawn on top of everything.
- 2026-10-03 19:20 · Validated by the owner: the game cycle is implemented and the node becomes stable.
- 2026-10-04 10:16 · [replaced by 2026-10-13 07:12] Start: the formation of the first wave moves behind the text without attacking, because the player ship is not there. Any key or a short tap on the touch screen starts the game: points at zero, wave 1, two spare ships and the player ship in the centre. The short tap that starts the game does not shoot.
- 2026-10-04 10:16 · End: on losing the last ship, two seconds after it explodes 'GAME OVER' appears and stays until a key is pressed or a short tap is made; then it returns to 'START GAME'. Keys and taps during the first second of 'GAME OVER' do not count, so it is not skipped by accident while shooting.
- 2026-10-04 11:30 · Extra life: the extra life power-up adds a spare ship (KF.partida.sumarRecambio), up to a maximum of 5, and the scoreboard shows it.
- 2026-10-04 12:05 · Waves: two seconds after destroying the last ship of the wave (with the player ship in play) the next one arrives, with the full formation for that wave (KF.formacion.reiniciar(velocidad, oleada); enemigos/formacion decides which). Each wave is 5% faster than the previous one (cumulative and uncapped) in everything: the block's movement, the dives and the bombs (KF.ataque.factorVelocidad). In addition, Attack launches more attacks, closer together, as the wave number grows (KF.ataque.oleada).
- 2026-10-13 07:12 · Start: the formation of the first wave moves behind the text without attacking, because there are no player ships. Under 'START GAME' there is a menu: '1 JUGADOR' (selected), 'CREAR PARTIDA' and 'UNIRSE' (multijugador). Up and down arrows change the option and any other key chooses it; a short tap on an option chooses it and a tap elsewhere chooses the selected one. The game starts with points at zero, wave 1 and two spare ships for each player, and each player ship in the centre (in a two-player game, one on each side). The short tap that starts the game does not shoot.
- 2026-10-13 07:12 · Lost ships: each player keeps their own spare ships. At least two seconds after a ship explodes, if its player has spares left, the next one comes out: alone, once the diving ships have returned to the formation and no bombs are left, and then attacks wait two seconds; with the other player's ship in play, straight away. A player with no spares is out, and the game ends ('GAME OVER') when no player has a ship in play. The next wave comes with any player ship in play. On the guest of a two-player game the game cycle arrives from the host; from 'GAME OVER' a key or tap on either device closes the connection and returns to 'START GAME'.
- 2026-10-13 14:28 · On starting a game, Game takes the current position of the phone as the centre of the tilt (KF.inclinacion.calibrar, jugador/accelerometer-control).
- 2026-10-13 17:16 · Pause: while playing, the game can be paused with P or the II button and pauses by itself when the page is hidden; it is handled by the child node partida/pausa (js/pausa.js), which ends the pause when the game is no longer being played.

## Requirements
- 2026-10-03 18:13 · When all the enemy ships have been destroyed, a new wave will start with a movement speed increased by 5%.
- 2026-10-03 18:13 · If any alien ship or a bomb collides with the player ship, it explodes. It has two spare ships (which appear tiny at the bottom right) that it will lose each time it is destroyed. When the player's last ship is destroyed, message 'GAME OVER'
- 2026-10-03 18:13 · At the start of the game, a large 'START GAME' text appears in the middle of the screen. Pressing any key, the game begins.
- 2026-10-03 18:22 · draft: Implement the game cycle: 'START GAME' screen that starts with any key, successive waves with 5% more speed each, three player ships (one in play and two spares, which the extra life power-up can raise up to five) and a 'GAME OVER' message on losing the last one.
- 2026-10-03 19:10 · Derived from marcador: tell the scoreboard the current wave and the spare ships left, and set the points to zero at the start of each game.
- 2026-10-03 19:15 · 1. A (the +5% affects everything: block, dives and bombs)
- 2026-10-03 19:15 · 2. A (after losing a ship the wave carries on, and the diving ships return to the formation before the spare one appears)
- 2026-10-03 19:15 · 3. B (after 'GAME OVER' it stays until a key is pressed)
- 2026-10-04 10:16 · Derived from architecture: a short tap starts the game and also exits 'GAME OVER'.
- 2026-10-04 11:30 · Derived from power-ups: add a spare ship with the extra life power-up, up to a maximum of 5.
- 2026-10-04 12:05 · Derived from enemigos/formacion: tell the formation which wave is starting, so it sets its own.
- 2026-10-13 07:12 · Derived from multijugador: offer the two-player game in the start menu and play it with two players, each with their spare ships, until neither has ships.
- 2026-10-13 14:25 · Derived from jugador/accelerometer-control: when the game starts, the position of the phone counts as the centre of the tilt.
- 2026-10-13 17:16 · Derived from partida/pausa: let the game be paused only while playing.
