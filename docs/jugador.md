---
title: Player
depends_on: [enemigos/formacion, graficos, architecture]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Player ship | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi8uEd3vf7FBd7b8W9rNHB1b
  - Touch controls | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
---
## Summary
The ship the player controls at the bottom of the screen: it moves horizontally with the arrow keys or by sliding a finger, fires with the space bar or a short tap on the touch screen, one shot at a time (the shot is freed when it hits a ship, in formation or diving, or when it leaves through the top; the active power-up changes this), and explodes if a ship or a bomb hits it. It does not respawn by itself: Game makes it appear in the center when the game starts and with each spare ship, and outside a game it is not there. When it appears it blinks for two seconds and is invulnerable meanwhile (jugador/escudo-al-aparecer). When it fires, the cannon gives a brief flash (jugador/destello-disparo). When it explodes it throws out fragments that scatter and fade out (jugador/explosion-fragmentos). It accelerates and brakes smoothly, at 90 pixels per second at most (jugador/inercia). While it moves, a small flame flickers under it (jugador/estela-motor). Improvement pending in a child draft: shake on death.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:46 · [replaced by 2026-10-03 18:49] Keys: left arrow and right arrow to move, space bar to fire (option A of the question, recommended, pending the owner's confirmation). Holding the space bar fires again as soon as the shot is freed.
- 2026-10-03 18:46 · [replaced by jugador/inercia 2026-10-05 12:45] Movement: the ship moves at 90 pixels per second (about 2.5 seconds from side to side) and does not leave the screen; its center is 24 pixels from the bottom edge, leaving room below for the spare ships.
- 2026-10-03 18:46 · Shot: only one on screen, it rises at 300 pixels per second and is freed when it touches a formation ship (which checks it and destroys that ship) or when it leaves through the top. If the ship explodes, the shot already fired continues on its way.
- 2026-10-03 18:46 · Explosion: the ship exposes its collision rectangle and an explode command, which will be called by whoever detects the collision with an alien ship or a bomb (enemigos/ataque). The explosion lasts three phases of 0.15 seconds and meanwhile the ship neither moves nor fires.
- 2026-10-03 18:46 · [replaced by 2026-10-03 19:18] Provisional until Game manages the spare ships and the GAME OVER: two seconds after exploding, the ship reappears in the center.
- 2026-10-03 18:46 · Code in js/jugador.js; the provisional drawings of the ship, the shot and the explosion are in js/graficos.js.
- 2026-10-03 18:49 · [replaced by 2026-10-04 10:16] Keys: left arrow and right arrow to move, space bar to fire, confirmed by the owner. Holding the space bar fires again as soon as the shot is freed.
- 2026-10-03 18:50 · Validated by the owner: the player ship is implemented and the node becomes stable.
- 2026-10-03 19:05 · The shot also hits diving ships: besides the formation, it is checked against enemigos/ataque, which destroys the ship hit.
- 2026-10-03 19:18 · Appearance: the ship does not respawn by itself after exploding. Game makes it appear in the center (KF.jugador.aparecer) when the game starts and with each spare ship, and removes it (KF.jugador.retirar) when it ends; while it is not there, it does not move, does not fire and cannot be hit.
- 2026-10-04 10:16 · Controls: left arrow and right arrow or sliding a finger to move; space bar or a short tap on the touch screen to fire. Holding the space bar fires again as soon as the shot is freed. When sliding a finger, the ship heads to where the finger's horizontal displacement takes it (without leaving the screen), but never faster than its normal speed of 90 pixels per second, so that it is not easier than with the arrows; if the finger is lifted, it finishes getting there. Pressing an arrow cancels that target. A short tap fires if there is no shot on screen; if there is one, it is not saved for later. Whatever is requested with the finger while the ship is not in play is discarded.
- 2026-10-04 10:52 · Firing with power-ups: the ship fires according to KF.powerups.activo: up to three shots at once (rapid), a shot that does not stop when it hits a ship (deep), a bomb that explodes when it hits a ship (bomb), the destruction of all ships without firing a projectile (annihilation), a shot at 150 pixels per second (slow fire) or three parallel projectiles that count as one (triple). The shots in flight are in KF.jugador.disparos and KF.jugador.salvas counts each time it fires.
- 2026-10-04 11:30 · With rapid fire, each press of the space bar (not counting the repeat while holding it) or each tap fires a single shot; without it, holding the space bar keeps firing as soon as the shot is freed.
- 2026-10-05 11:51 · Six child drafts to test Claude Visual Project's box stacking: jugador/escudo-al-aparecer, jugador/estela-motor, jugador/inercia, jugador/destello-disparo, jugador/explosion-fragmentos and jugador/temblor-al-morir. They are independent of each other.

## Requirements
- 2026-10-03 18:13 · The ship the player controls is at the bottom of the screen and can only move horizontally while it fires.
- 2026-10-03 18:13 · Until the shot hits a target or reaches the top of the screen, you cannot fire again.
- 2026-10-03 18:13 · If any alien ship or a bomb collides with the player ship, it explodes.
- 2026-10-03 18:22 · draft: Implement the player ship: horizontal movement with the keyboard at the bottom, a single shot on screen that is freed when it hits or leaves through the top, and explosion when colliding with an alien ship or a bomb.
- 2026-10-03 18:48 · Arrows + space
- 2026-10-03 18:54 · Yes, of course, it attacks a ship whether it is in formation or not.
- 2026-10-03 19:05 · Derived from enemigos/ataque: the shot also destroys the ships that are diving.
- 2026-10-03 19:18 · Derived from partida: the ship no longer respawns by itself; Game makes it appear and outside a game it is not there.
- 2026-10-04 10:16 · Derived from architecture: move the ship by sliding a finger and fire with a short tap.
- 2026-10-04 10:52 · Derived from power-ups: the shot changes according to the active power (up to three shots, goes through, bomb, annihilation, half speed, triple).
- 2026-10-04 11:30 · Derived from power-ups: with rapid fire, a single shot per press.
