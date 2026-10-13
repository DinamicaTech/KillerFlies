---
title: Accelerometer control
status: idea
depends_on: [jugador, architecture]
threads:
  - Accelerometer control | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi9zLchRuiqrBNaJM9zRS8pR
---
## Summary
Idea under debate: on a phone, move the player's ship by tilting the device (accelerometer) instead of sliding a finger. Points to debate: the browser gives the tilt over HTTPS (GitHub Pages already is) and iPhone asks for permission once, after a tap; the ship would keep the inertia of jugador/inercia and a short tap would still fire; the neutral angle would be calibrated to how the player holds the phone when the game starts; the speed would grow with the tilt, from 0 px/s with the phone level to 120 px/s at full tilt (pending: whether to go above the 90 px/s of the arrows, and how many degrees count as full tilt); it would likely be an option next to finger control, chosen by each player on their own phone (also in multijugador).

## Decisions
- 2026-10-13 14:15 · Created in the lab as an idea under debate.

## Requirements
- 2026-10-13 14:10 · idea: Control the player's ship by tilting the phone (accelerometer) instead of sliding a finger.
- 2026-10-13 14:16 · Bueno, podemos hacer que según el % de inclinación, la velocidad sea más o menos rápida, desde 0 px/s a 120 px/ ?
- 2026-10-13 14:18 · question: Top speed with tilt: (A) 120 px/s, faster than the 90 px/s of the arrows and the finger, which jugador decided so that no control is easier than the others; (B) 90 px/s, the same as the other controls; (C) 120 px/s for every control. Recommended: B. Full tilt would be about 30°, with a dead zone of about 3° so that the ship stays still with the phone almost level.
