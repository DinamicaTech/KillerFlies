---
title: Accelerometer control
status: draft
depends_on: [architecture, partida, multijugador]
threads:
  - Accelerometer control | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi9zLchRuiqrBNaJM9zRS8pR
---
## Summary
On a phone, the player's ship also moves by tilting the device sideways: up to 3° of tilt it stays still, and from there its speed grows with the tilt up to 120 pixels per second at 30°, with the same inertia as the other controls (jugador/inercia). Tilt and finger work together without choosing a mode: while an arrow is pressed or a finger is sliding (or the ship is still reaching where the finger took it), the tilt is ignored. The position of the phone when the game starts, or when it resumes after a pause (partida/pausa), counts as the centre. Architecture reads the sensor (KF.inclinacion in js/base.js; on iPhone it asks for permission with the first short tap); Game calibrates the centre on starting and, in a two-player game, the guest calibrates it when its game starts. It came from the creative lab.

## Decisions
- 2026-10-13 14:15 · Created in the lab as an idea under debate.
- 2026-10-13 14:17 · [replaced by 2026-10-13 14:25] Speed with tilt: proportional to the tilt, from 0 to 120 px/s; if the idea is carried out, the arrows and the finger also rise from 90 to 120 px/s (jugador/inercia), so that every control has the same top speed.
- 2026-10-13 14:18 · Dead zone: up to 3° of tilt the ship does not move.
- 2026-10-13 14:22 · Tilt and finger coexist without choosing a mode (option A): while an arrow is pressed or a finger slides, the tilt is ignored.
- 2026-10-13 14:22 · Leaves the lab: executed, it is now the node jugador/accelerometer-control.
- 2026-10-13 14:25 · Top speed: 120 pixels per second only for the phone controls (finger and tilt); the arrows stay at 90 pixels per second, because on a PC the game is easier (jugador/inercia).
- 2026-10-13 14:28 · Tilt movement: with no arrow pressed and no finger target, the desired speed is 0 up to 3° of tilt from the centre and grows in proportion up to 120 pixels per second at 30° (and beyond), toward the side the phone is tilted; the inertia of jugador/inercia takes the ship to that speed. The tilt is the sideways one as the screen is seen, whatever way the phone is turned. Code in js/jugador.js (VELOCIDAD_MOVIL, INCLINACION_MINIMA, INCLINACION_MAXIMA); the sensor is read in js/base.js (KF.inclinacion). Pending the owner's test on a phone.
- 2026-10-13 17:16 · On resuming a paused game, the current position of the phone becomes the centre of the tilt again (partida/pausa calls KF.inclinacion.calibrar), because after unlocking the phone the player may hold it differently.

## Requirements
- 2026-10-13 14:10 · idea: Control the player's ship by tilting the phone (accelerometer) instead of sliding a finger.
- 2026-10-13 14:16 · Bueno, podemos hacer que según el % de inclinación, la velocidad sea más o menos rápida, desde 0 px/s a 120 px/ ?
- 2026-10-13 14:18 · [answered 2026-10-13 14:17] question: Top speed with tilt: (A) 120 px/s, faster than the 90 px/s of the arrows and the finger, which jugador decided so that no control is easier than the others; (B) 90 px/s, the same as the other controls; (C) 120 px/s for every control. Recommended: B. Full tilt would be about 30°, with a dead zone of about 3° so that the ship stays still with the phone almost level.
- 2026-10-13 14:17 · C
- 2026-10-13 14:17 · answer: top speed with tilt → C, 120 px/s for every control.
- 2026-10-13 14:18 · Ok, 3 grados equivale a 0 movimiento.
- 2026-10-13 14:18 · Hace falta escoger el modo de control ? Quizá pueden convivir los dos ?
- 2026-10-13 14:19 · [answered 2026-10-13 14:22] question: Tilt and finger together: (A) both always active, and while a finger slides or an arrow is pressed the tilt is ignored; (B) the player chooses one mode in the menu. Recommended: A, with the risk that holding the phone at an angle while playing with the finger moves the ship when the finger is lifted (calibrating the centre at the start of the game limits it).
- 2026-10-13 14:22 · Ok, opción A.
- 2026-10-13 14:22 · answer: tilt and finger together → A, both always active; arrows and finger have priority.
- 2026-10-13 14:22 · No pasa nada si se hace algo más fácil (120px/s) en el móvil ya que es bastante difícil superar pantallas.
- 2026-10-13 14:22 · Pasamos de idea a producción.
- 2026-10-13 14:25 · Solo los del móvil, en PC el nivel de dificultad es más bajo, por lo que lo mantenemos a 90 px/s
- 2026-10-13 17:16 · Derived from partida/pausa: on resuming a paused game, the position of the phone counts as the centre of the tilt.
