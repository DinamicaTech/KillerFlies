---
title: Upgrades in the two-player game
status: draft
depends_on: [mejoras, multijugador, partida/pausa, enemigos/ataque, power-ups, jugador, mejoras/cuentas]
threads:
  - Monedas y tienda de mejoras | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
Phase 6 of the upgrades: coins and upgrades in the two-player game (multijugador), built and pending the owner's validation.
- Profile: each player plays with the active profile (mejoras/cuentas) of their own device, in the host's difficulty.
- Coins: each player has their own 5 per wave, only those still missing for them, so they drop from different enemies for each one; the last of each player drops from the last enemy, the two side by side. Each coin belongs to a ship and only that ship picks it up; on each screen the other player's coins are drawn at 40% opacity, like their ship. The host moves every coin: the guest tells it, in each message, how many it still misses in the wave and in its challenge, and receives in each snapshot the coins its ship has picked up (the total and the last 10), which it saves in its profile at once, so a disconnection takes nothing away. If the guest leaves, its falling coins disappear.
- Ship upgrades go with the ship of whoever bought them: SPEED, FIRE, SHIELD, WINGMAN, SHIPS, KEEP POWER and MAGNET (the magnet pulls your coins and the capsules toward your ship). Each ship shows its player's skin and TRAIL flame on both screens. A shield or support ship bought during the game reaches that ship at once, as in one-player games.
- World upgrades BOMBS, YELLOW and ESCORT change the enemies, shared by both, so they use the average of both players' levels, rounded down; ESCORT, bought once, counts only when both have it.
- RED SLOW, BLAST and STARS only change the screen of whoever bought them.
- The challenge wave still appears after every wave; its coins drop only for a player who owns BONUS.
- The player who pauses can open SHOP from the pause menu; the other player keeps seeing PAUSED. What is bought applies at once or with the next ship, as in one-player games.
- Still no perfects and no hall of fame in two-player games.
In the code: KF.tienda.nivelDe(nave, id) gives the level of a ship's upgrade (this device's for its own ship, the other player's for theirs), KF.tienda.nivelJuego(id) the average for the world upgrades and KF.tienda.nivel(id) this device's own; the levels travel in every message (js/red.js). Coins carry their owner (dueno, the ship number) in js/monedas.js. Tested by tools/comprobar-dos-jugadores.mjs, which simulates both devices.
**Acceptance:** play a two-player game with different profiles: each player sees their coins and the other's as ghosts, cannot pick up the other's, and at the end each profile has its own coins; buy SPEED on only one device and only that ship goes faster; each ship shows its own skin on both screens.

## Decisions
- 2026-10-21 20:22 · Created as a draft when the upgrades idea left the lab in phases.
- 2026-10-24 10:58 · Built as in the Summary, with the owner's OK to the eight points of the breakdown (each own profile in the host's difficulty; own coins with the other's as ghosts; ship upgrades with their ship; the average for BOMBS, YELLOW and ESCORT; RED SLOW, BLAST and STARS only on the buyer's screen; the challenge always, with coins only for BONUS owners; SHOP for whoever pauses; no perfects or hall of fame).
- 2026-10-24 10:58 · Messages (multijugador): each one carries the sender's upgrade levels in force (u, in the order of the shop's list); the guest's also carries [wave, missing coins in it, missing in its challenge] (mo), sent only once it knows the host's difficulty from a snapshot; the snapshot carries the falling coins with their owner (mn), the guest's picked-up coins as [total, last 10] (mr), each ship's shield and support ships, and which capsule is the slow fire one (for RED SLOW). The host plans the guest's coins when its first message of the wave arrives, among the enemies not yet destroyed.
- 2026-10-24 10:58 · Tested in two browsers with a local PeerJS server: the host received the guest's upgrades and the guest's ship got its shield and two support ships; the guest played in the host's difficulty; a cleared wave dropped 2 coins for the host and 5 for the guest, with the host's shown as ghosts on the guest; the guest's ship picked up its 5 and the guest's profile saved them; the guest paused and opened SHOP. Pending the owner's test on real devices.

## Requirements
- 2026-10-21 20:22 · draft: In the two-player game (multijugador), let each player collect their own coins and use their account's upgrades: each coin drops twice, a normal one for you and a 'ghost' one for the other player, which you cannot pick up.
- 2026-10-24 10:46 · answer: each player uses their own active profile, in the host's difficulty → Ok
- 2026-10-24 10:46 · answer: each player has their own coins, the other's shown as ghosts and not collectable, saved at once → Ok
- 2026-10-24 10:46 · answer: SPEED, FIRE, SHIELD, WINGMAN, SHIPS, KEEP POWER and MAGNET go with the ship of whoever bought them; skins and TRAIL show on both screens → Ok
- 2026-10-24 10:46 · answer: BOMBS, YELLOW and ESCORT use the average of both levels, rounded down → Ok
- 2026-10-24 10:46 · answer: RED SLOW, BLAST and STARS only change your own screen → Ok
- 2026-10-24 10:46 · answer: the challenge wave always appears in two-player games, its coins only for whoever owns BONUS → Ok
- 2026-10-24 10:46 · answer: the player who pauses can open SHOP → Ok
- 2026-10-24 10:46 · answer: still no perfects or hall of fame in two-player games → Ok
