---
title: Accelerometer control
status: idea
depends_on: [jugador, architecture]
threads:
  - Accelerometer control | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi9zLchRuiqrBNaJM9zRS8pR
---
## Summary
Idea under debate: on a phone, move the player's ship by tilting the device (accelerometer) instead of sliding a finger. Points to debate: the browser gives the tilt over HTTPS (GitHub Pages already is) and iPhone asks for permission once, after a tap; the ship would keep the inertia of jugador/inercia and a short tap would still fire; the neutral angle would be calibrated to how the player holds the phone when the game starts; the speed would grow with the tilt, from 0 px/s with the phone level to 120 px/s at full tilt (full tilt at about 30°, proposed; up to 3° the ship does not move); the top speed of every control (arrows, finger and tilt) would rise to 120 px/s, so that none is easier than the others; pending: whether tilt and finger coexist without choosing a mode (proposed: yes, and while a finger slides or an arrow is pressed the tilt is ignored).

## Decisions
- 2026-10-13 14:15 · Created in the lab as an idea under debate.
- 2026-10-13 14:17 · Speed with tilt: proportional to the tilt, from 0 to 120 px/s; if the idea is carried out, the arrows and the finger also rise from 90 to 120 px/s (jugador/inercia), so that every control has the same top speed.
- 2026-10-13 14:18 · Dead zone: up to 3° of tilt the ship does not move.

## Requirements
- 2026-10-13 14:10 · idea: Control the player's ship by tilting the phone (accelerometer) instead of sliding a finger.
- 2026-10-13 14:16 · Bueno, podemos hacer que según el % de inclinación, la velocidad sea más o menos rápida, desde 0 px/s a 120 px/ ?
- 2026-10-13 14:18 · [answered 2026-10-13 14:17] question: Top speed with tilt: (A) 120 px/s, faster than the 90 px/s of the arrows and the finger, which jugador decided so that no control is easier than the others; (B) 90 px/s, the same as the other controls; (C) 120 px/s for every control. Recommended: B. Full tilt would be about 30°, with a dead zone of about 3° so that the ship stays still with the phone almost level.
- 2026-10-13 14:17 · C
- 2026-10-13 14:17 · answer: top speed with tilt → C, 120 px/s for every control.
- 2026-10-13 14:18 · Ok, 3 grados equivale a 0 movimiento.
- 2026-10-13 14:18 · Hace falta escoger el modo de control ? Quizá pueden convivir los dos ?
- 2026-10-13 14:19 · question: Tilt and finger together: (A) both always active, and while a finger slides or an arrow is pressed the tilt is ignored; (B) the player chooses one mode in the menu. Recommended: A, with the risk that holding the phone at an angle while playing with the finger moves the ship when the finger is lifted (calibrating the centre at the start of the game limits it).
