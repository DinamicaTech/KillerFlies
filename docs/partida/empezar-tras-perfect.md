---
title: Start after a perfect
depends_on: [partida, partida/dificultad, partida/pausa, marcador, architecture/app-instalable]
threads:
  - Start after a perfect | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiR3R8dKfDYyXxqMJULDEnib
---
## Summary
In a one-player game, clearing a main wave without losing any ship while it lasts (a 'perfect') saves in the browser, for that difficulty, a starting point: the next wave with the points the player had when its last ship was destroyed (the best points are kept if the perfect is repeated). In the start menu, under the difficulty line, '< FROM WAVE n >' appears when the chosen difficulty has any perfect: it is reached with the down arrow, the left and right arrows go through the saved waves while it is marked, and choosing it starts a one-player game at that wave with those points and 2 spare ships; '1 PLAYER' still starts at wave 1. On a touch screen a tap on the line marks it, a tap on it when marked goes to the next saved wave and a tap elsewhere starts. RESTART in the pause repeats the starting point of the game being left. Code in js/perfect.js (KF.perfect) and js/partida.js; tested by tools/comprobar-perfect.mjs on every pull request. Validated by the owner by playing.

## Decisions
- 2026-10-16 11:09 · Created in the creative lab as an idea to debate.
- 2026-10-16 11:22 · Leaves the lab: executed. Moved from creative-lab/empezar-tras-perfect to partida/empezar-tras-perfect, because the start menu and the waves belong to Game.
- 2026-10-16 11:09 · Scope agreed while debating: only main waves count (not the challenge wave nor the mothership boss); the perfect starting points are kept per difficulty, so skipping a wave on HARD needs a perfect on HARD; a game started from one has the 2 initial spare ships; the menu offers wave 1 or any perfect starting point; one-player games only.

- 2026-10-16 11:22 · Perfect: only main waves count. Game (KF.partida.navePerdida) notes any player ship exploding from the moment a main wave starts (ponerOleada) until its last ship is destroyed; at that moment, in a one-player game with nothing lost, KF.perfect.anotar saves wave n+1 with the player's points. Losing a ship afterwards (in the wait, the mothership or the challenge wave) does not undo it. Only two-player games are excluded.
- 2026-10-16 11:22 · Storage: localStorage key 'killerflies.perfect.<LEVEL>' (EASY, NORMAL or HARD) with a JSON object { "wave": points }; a repeated perfect only replaces a starting point if it has more points. Values that are not a wave above 1 with non-negative points are ignored, and broken data counts as none.
- 2026-10-16 11:22 · Menu: the line '< FROM WAVE n >' goes 16 pixels under the difficulty line, grey, and yellow when marked; it shows the starting point with the highest wave when the menu opens or the difficulty changes. Up and down go through the options and this line; left and right change the saved wave when the line is marked and the difficulty otherwise. Choosing it closes any two-player connection and starts a one-player game.
- 2026-10-16 11:22 · Start from a perfect: the saved wave with its formation and speed, the saved points, 2 spare ships, and the next extra life at the next multiple of 10,000 above those points (no extra lives for the inherited points). The high scores work as usual. RESTART from the pause starts again from the same starting point (KF.partida.inicio); a two-player game always starts at wave 1.
- 2026-10-16 11:22 · Acceptance: tools/comprobar-perfect.mjs (workflow "Pruebas") checks the saving per difficulty, that a lost ship gives no perfect, the best points, the menu line and arrows, the start values and the memory after reopening. Checked by Claude in a headless browser (the menu shows '< FROM WAVE 4 >', choosing it starts at wave 4 with the saved points and 2 spare ships, and clearing that wave saves wave 5). The owner validates it by playing.

- 2026-10-20 17:48 · Validated by the owner by playing: the node becomes stable.
## Requirements
- 2026-10-16 11:05 · idea: If a player clears a wave perfectly (without losing any ship), in later games they can start directly at the next wave, with starting points equal to the points they had when they made that perfect.
- 2026-10-16 11:05 · Disponemos de algún tipo de persistencia? Me gustaría añadir una opción de que si un jugador pasa un nivel de forma perfecta (sin perder ninguna vida), en siguientes partidas podrá empezar directamente en el siguiente nivel y con la puntuación inicial igual a la conseguida cuando hizo un 'perfect' en el nivel anterior.
- 2026-10-16 11:09 · answer: which levels count → Solo oleadas principales.
- 2026-10-16 11:09 · answer: per difficulty or a single one → Por dificultad y salto de nivel también por dificultad, es decir, para saltarte la primera oleada en nivel hard, hay que hacer un perfect en nivel hard
- 2026-10-16 11:09 · answer: spare ships when starting from a perfect → 2 iniciales
- 2026-10-16 11:09 · answer: choosing the start in the menu → Si en el menú se permite empezar por la 1 o por cualquiera de las 'perfect'
- 2026-10-16 11:09 · answer: only in one-player games → Sí, en partida a uno
- 2026-10-16 11:10 · Pásala a desarrollo
- 2026-10-20 17:48 · Validado
