---
title: Multiplayer
status: idea
depends_on: [partida, jugador, marcador, architecture]
threads:
  - Multiplayer | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCdzad965rbX54ikJ7MVK26
---
## Summary
Idea under debate: two players at once, in the same game, each with their own device (online). Communication is fast enough: a direct connection between browsers (WebRTC), a host device that is in charge of the enemies, and the other player's ship is shown with a delay of a few hundredths of a second that goes unnoticed at this game's speed.
Technology with the least lag: a WebRTC data channel between the two browsers in unreliable, unordered mode, with a free public introduction service (PeerJS) and public STUN, so the game stays static on GitHub Pages; a free relay (TURN) only as a fallback for networks where the direct link fails. Pairing: the host taps "create game" and shows a 4-letter code and a QR with the game link; the guest scans the QR or types the code. The questions in its Requirements remain open; the next step proposed is a small prototype to measure the real lag.

## Decisions
- 2026-10-04 12:06 · Created in the lab as an idea.
- 2026-10-04 12:09 · Preferred form: online, each player on their own device.
- 2026-10-05 10:07 · Two players at once in the same game, each with their own device.
- 2026-10-05 10:07 · Communication feasibility: yes, it is possible. With a direct connection between browsers (WebRTC) a message takes about 5 to 20 ms on the same network and about 30 to 100 ms over the internet. One device acts as host and decides the enemies, the bombs and the hits; each device sends only its ship's position and shots 30 to 60 times per second, and the other player's ship is drawn smoothed. Galaxian is slow compared with that delay, so the game flows. Risk: on some networks (especially mobile data) the direct connection fails and a relay server (TURN) is needed, which adds some delay and may have a cost. Recommendation: check it with a small prototype before deciding.
- 2026-10-12 15:06 · Technology options weighed for the least lag (the browser cannot open raw network sockets, so the choices are WebRTC or WebSocket):
  - WebRTC data channel, peer to peer, unreliable and unordered (like UDP: a lost message is not resent, the next one replaces it): the fastest, 5 to 20 ms on the same Wi-Fi and 30 to 100 ms over the internet. It only needs a server to introduce the two devices (signaling) and a public STUN server to find each one's address; neither carries game traffic. Recommended.
  - WebSocket relay (for example Cloudflare Durable Objects or PartyKit): every message goes through a server over TCP, so it adds a second leg and a lost packet holds back the following ones; about 40 to 150 ms. Works on every network, but needs a hosted service.
  - Real-time database (Firebase, Supabase): built for app data, not for 30 to 60 updates per second; 100 ms or more and free-plan limits. Discarded for gameplay; possible only for signaling.
  - Local network only: still WebRTC (a browser cannot host a server), so it does not save anything; same Wi-Fi simply gives the lowest numbers.
  - Signaling choices: PeerJS public broker (free, a script from a CDN, no account; no service guarantee, replaceable later by our own free broker); manual exchange of the connection data by QR in both directions (no service at all, but two scans per game); Trystero over public relays (no account, less predictable). Recommended PeerJS.
  - Fallback relay (TURN) for networks where the direct link fails (some mobile data and corporate networks): free plans exist (for example Cloudflare, Metered); it adds a few tens of ms. Add it only if the prototype shows it is needed.
- 2026-10-12 15:06 · Lag handling proposed: the host runs the game (formation, attacks, bombs, hits, power-ups) and sends its state 30 times per second; each device moves its own ship locally at once (no lag on your own controls) and sends its position and shots; the other ship and the enemies are drawn interpolated. The guest's hits are decided by the host, a few hundredths of a second later.
- 2026-10-12 15:06 · Pairing proposed: "create game" on the host shows a 4-letter code and a QR with the link https://dinamicatech.github.io/KillerFlies/?sala=CODE; the guest scans the QR with the camera (opens the game straight into the room) or types the code under "join game". The code is the room name in the introduction service. Works mobile with mobile, computer with mobile, on the same Wi-Fi or over the internet.
- 2026-10-12 15:06 · Architecture impact if executed: the game would load one external library (PeerJS) from a CDN and depend on free external services for the introduction (and TURN if needed); there is still no server of our own and it stays on GitHub Pages. Recommended next step: a small prototype (two ships moving between two devices, showing the measured lag) before deciding.
- 2026-10-13 06:53 · How the guest sees enemies, bombs and the rest (proposed): the host sends a full snapshot of the game 20 to 30 times per second (every 33 to 50 ms; the 5 to 20 ms of the network is travel time, not the sending interval) with every enemy's position and state, bombs, shots, capsule, points, lives and wave; in binary it is under 500 bytes, about 15 KB/s. The guest keeps drawing at 60 frames per second interpolating between the last two snapshots, so it sees the game about 50 to 80 ms behind the host but without jumps; its own ship moves at once. A lost packet does not matter because the next snapshot replaces it; explosions and sounds are triggered on the guest when it sees the change between two snapshots. Discarded: both devices simulating the game and exchanging only events (less data, but any small drift shows each player a different game). The prototype should confirm these figures.

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
- 2026-10-12 15:05 · Weigh technology options with the least lag and how to link two devices to play the same game.
