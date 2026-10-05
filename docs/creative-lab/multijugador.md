---
title: Multiplayer
status: idea
depends_on: [partida, jugador, marcador, architecture]
threads:
  - Multiplayer | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCdzad965rbX54ikJ7MVK26
---
## Summary
Idea under debate: two players at once, in the same game, each with their own device (online). Communication is fast enough: a direct connection between browsers (WebRTC), a host device that is in charge of the enemies, and the other player's ship is shown with a delay of a few hundredths of a second that goes unnoticed at this game's speed. The questions in its Requirements remain open.
Possible forms, from least to most cost: turn-based on the same device (like the original Galaxian, each player with their own scoreboard, alternating when a ship is lost); cooperative with two ships at once on the same screen (hard to control on mobile and forces changes to the player, attack and power-ups); or online, each player on their own device (needs a server or an external service, and breaks the architecture decision of having no server, because GitHub Pages only serves static files).

## Decisions
- 2026-10-04 12:06 · Created in the lab as an idea.
- 2026-10-04 12:09 · Preferred form: online, each player on their own device.
- 2026-10-05 10:07 · Two players at once in the same game, each with their own device.
- 2026-10-05 10:07 · Communication feasibility: yes, it is possible. With a direct connection between browsers (WebRTC) a message takes about 5 to 20 ms on the same network and about 30 to 100 ms over the internet. One device acts as host and decides the enemies, the bombs and the hits; each device sends only its ship's position and shots 30 to 60 times per second, and the other player's ship is drawn smoothed. Galaxian is slow compared with that delay, so the game flows. Risk: on some networks (especially mobile data) the direct connection fails and a relay server (TURN) is needed, which adds some delay and may have a cost. Recommendation: check it with a small prototype before deciding.

## Requirements
- 2026-10-04 12:00 · idea: Multiplayer game option in Killer Flies.
- 2026-10-04 12:09 · Ideally it would be online.
- 2026-10-04 12:09 · question: Online game mode: A) cooperative, everyone in the same game against the same formation; B) competitive, each one their own game with the same waves and whoever scores more points wins; C) versus, players can damage each other. Recommended A, the most faithful to the spirit of the game.
- 2026-10-04 12:09 · [answered 2026-10-05 10:07] question: Number of players per game: A) 2; B) up to 4. Recommended A: with more ships the 224-pixel screen becomes too small.
- 2026-10-04 12:09 · question: How players get together: A) one creates a room and shares a link or code with their friend; B) automatic matchmaking with strangers; C) both. Recommended A, it needs no player list or moderation.
- 2026-10-04 12:09 · question: Connection: A) direct between browsers (WebRTC) with a free external service only for the introduction; B) third-party real-time service (for example Firebase); C) own server. Recommended A: the game stays on GitHub Pages and there is almost no infrastructure. Any of them changes the architecture decision of having no server.
- 2026-10-04 12:09 · question: Player identity: A) no accounts, each one types a short name when joining; B) no name, Jugador 1 and Jugador 2 (Player 1 and Player 2); C) accounts with registration. Recommended A.
- 2026-10-04 12:09 · question: Lives and points in cooperative: A) each player has their 3 ships and their scoreboard, and the game ends when nobody has ships left; B) shared ships and points. Recommended A.
- 2026-10-04 12:09 · question: Power-ups in cooperative: A) the power is only for whoever picks up the capsule; B) it applies to everyone. Recommended A.
- 2026-10-04 12:09 · question: If a player disconnects: A) the other continues alone; B) the game pauses and waits a while for them to come back; C) the game ends. Recommended B, with A if they don't come back within 30 seconds.
- 2026-10-04 12:09 · question: High scores: A) they remain local to each browser, separate for online games; B) an online high-score table shared by everyone. Recommended A: B needs to store data on a server.
- 2026-10-04 12:09 · question: Cross-play mobile and computer: A) one can play on mobile and the other on a computer; B) only between devices of the same type. Recommended A, since the game works the same on both.
- 2026-10-04 12:09 · question: Cost of the online service: A) it has to fit in a free plan; B) a small monthly cost is accepted. Recommended A, enough for games between friends.
- 2026-10-05 10:07 · The idea would be to play two players simultaneously, each one with their own terminal.
- 2026-10-05 10:07 · answer: number of players → 2, simultaneously, each one with their own terminal.
