---
title: Start after a perfect
status: idea
depends_on: [partida, partida/dificultad, marcador]
threads:
  - Start after a perfect | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiR3R8dKfDYyXxqMJULDEnib
---
## Summary
Idea under debate: when a one-player game clears a main wave without losing any ship (a 'perfect'), the browser remembers it, for that difficulty, and later games can start at the next wave with the points the player had at that moment and the usual 2 spare ships. The start menu lets the player choose wave 1 or any of their perfect starting points for the chosen difficulty.
It would use the browser storage (localStorage) the game already uses for the high scores (js/marcador.js), the difficulty (js/dificultad.js) and the sound volumes (js/sonido.js), so it is remembered only on that browser and device.

## Decisions
- 2026-10-16 11:09 · Created in the creative lab as an idea to debate.
- 2026-10-16 11:09 · Scope agreed while debating: only main waves count (not the challenge wave nor the mothership boss); the perfect starting points are kept per difficulty, so skipping a wave on HARD needs a perfect on HARD; a game started from one has the 2 initial spare ships; the menu offers wave 1 or any perfect starting point; one-player games only.

## Requirements
- 2026-10-16 11:05 · idea: If a player clears a wave perfectly (without losing any ship), in later games they can start directly at the next wave, with starting points equal to the points they had when they made that perfect.
- 2026-10-16 11:05 · Disponemos de algún tipo de persistencia? Me gustaría añadir una opción de que si un jugador pasa un nivel de forma perfecta (sin perder ninguna vida), en siguientes partidas podrá empezar directamente en el siguiente nivel y con la puntuación inicial igual a la conseguida cuando hizo un 'perfect' en el nivel anterior.
- 2026-10-16 11:09 · answer: which levels count → Solo oleadas principales.
- 2026-10-16 11:09 · answer: per difficulty or a single one → Por dificultad y salto de nivel también por dificultad, es decir, para saltarte la primera oleada en nivel hard, hay que hacer un perfect en nivel hard
- 2026-10-16 11:09 · answer: spare ships when starting from a perfect → 2 iniciales
- 2026-10-16 11:09 · answer: choosing the start in the menu → Si en el menú se permite empezar por la 1 o por cualquiera de las 'perfect'
- 2026-10-16 11:09 · answer: only in one-player games → Sí, en partida a uno
