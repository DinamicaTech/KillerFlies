---
title: Player accounts
depends_on: [mejoras, partida, partida/empezar-tras-perfect, marcador/hall-of-fame, architecture]
threads:
  - Monedas y tienda de mejoras | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
Phase 5 of the upgrades: player profiles, in js/perfiles.js (KF.perfiles), used by js/monedas.js, js/perfect.js, js/partida.js, js/salon-fama.js and js/tienda.js. Each difficulty has its own profiles, up to 4, and each profile its own coins, upgrades and perfects (partida/empezar-tras-perfect). The data saved before there were profiles is the first profile of each difficulty, PLAYER.
In the start menu, under the difficulty, the line '< PLAYER >' shows the active profile of the marked difficulty: with the line marked (down arrow) the left and right arrows go through its profiles and, after the last one and while there are fewer than 4, '< NEW PROFILE >'; on a touch screen a tap marks the line and a tap on it when marked goes to the next. Starting a one-player game with '< NEW PROFILE >' shown asks for its name with the hall of fame keyboard (up to 8 letters, digits or spaces; empty gives 'PLAYER n'; Escape cancels) and leaves the new, empty profile active. The active profile of each difficulty is remembered. The hall of fame is still one table for all, with the name pre-filled with the profile's; the shop shows the profile's name next to the balance; `?monedas=N` adds to the active profiles. In a two-player game each player plays with their own device's active profile, in the host's difficulty (mejoras/dos-jugadores).
Tests: tools/comprobar-perfiles.mjs in the "Pruebas" workflow (plus the updated perfect and hall of fame tests).
**Acceptance:** in the menu go down to '< PLAYER >', press right to '< NEW PROFILE >', press Enter, type a name and save: the new profile is active with 0 coins and no perfects; buy something with it, go back to PLAYER and see its coins, upgrades and perfects untouched; change the difficulty and see that difficulty's own profiles. Validated by the owner.

## Decisions
- 2026-10-21 20:22 · Created as a draft when the upgrades idea left the lab in phases.
- 2026-10-22 11:21 · Built as in the Summary, with the owner's answers to the breakdown: up to 4 profiles per difficulty, shown for the difficulty marked in the menu; one hall of fame table with the profile's name pre-filled; perfects per profile; `?monedas=N` for the active profile; no change in two-player games. Deleting a profile is left pending, in the draft child mejoras/cuentas/borrar-perfil.
- 2026-10-22 11:21 · Storage: killerflies.perfiles keeps the profiles of each difficulty ({ LEVEL: { activo, lista: [{ id, nombre }] } }); profile 0 (PLAYER) keeps the old keys, killerflies.cuenta.default and killerflies.perfect.<LEVEL>, and profile n uses killerflies.cuenta.<n> and killerflies.perfect.<LEVEL>.<n>, so nothing saved before is lost. Choosing a name that already exists in that difficulty activates that profile instead of creating another.
- 2026-10-24 10:38 · Validated by the owner: passes from draft to stable.
- 2026-10-24 10:58 · Derived from mejoras/dos-jugadores: in a two-player game each player uses the active profile of their own device in the host's difficulty, and the guest saves its coins in that profile.

## Requirements
- 2026-10-21 20:22 · draft: Allow several player accounts, each with its own coins and upgrades (mejoras), so that, for example, one account tries speed upgrades and another fire rate; the coins are already saved under one key per account (killerflies.cuenta.<name>).
- 2026-10-22 11:07 · adelante con el resto de mejoras y multi-perfil de jugador
- 2026-10-22 11:12 · answer: maximum of profiles → Ok a 4 perfiles, que podrían ser por dificultad (al seleccionar dificultad se muestran los perfiles de esa dificultad)
- 2026-10-22 11:12 · answer: deleting a profile → Pendiente
- 2026-10-22 11:12 · answer: one hall of fame with the profile's name pre-filled → Ok
- 2026-10-22 11:12 · answer: perfects per profile → OK
- 2026-10-22 11:12 · answer: `?monedas=N` for the active profile → Ok
- 2026-10-22 11:12 · answer: no change in two-player games → Ok de momento
- 2026-10-24 10:38 · answer: validation of the player profiles → Están ok
