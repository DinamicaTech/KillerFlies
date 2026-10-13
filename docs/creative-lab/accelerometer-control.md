---
title: Accelerometer control
status: idea
depends_on: [jugador, architecture]
threads:
  - Accelerometer control | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi9zLchRuiqrBNaJM9zRS8pR
---
## Summary
Idea under debate: on a phone, move the player's ship by tilting the device (accelerometer) instead of sliding a finger. Points to debate: the browser gives the tilt over HTTPS (GitHub Pages already is) and iPhone asks for permission once, after a tap; the ship would keep the 90 px/s limit and the inertia of jugador/inercia so it is not easier than with the arrows, and a short tap would still fire; the neutral angle would be calibrated to how the player holds the phone when the game starts; it would likely be an option next to finger control, chosen by each player on their own phone (also in multijugador).

## Decisions
- 2026-10-13 14:15 · Created in the lab as an idea under debate.

## Requirements
- 2026-10-13 14:10 · idea: Control the player's ship by tilting the phone (accelerometer) instead of sliding a finger.
