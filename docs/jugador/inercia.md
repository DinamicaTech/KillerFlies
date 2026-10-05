---
title: Inertia
depends_on: []
threads:
  - Draft stack in Player | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Inertia | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi8cTexby62CUgP4AmUMNEoh
---
## Summary
The player ship no longer moves at a fixed speed: it accelerates to its top speed of 90 pixels per second in 0.2 seconds and brakes to a stop in 0.15 seconds, with the arrows and when sliding a finger.

## Decisions
- 2026-10-05 11:51 · Created as a child draft of Player, one of the six to test Claude Visual Project's box stacking.
- 2026-10-05 12:45 · Movement with inertia: the ship moves at 90 pixels per second at most; with an arrow pressed it accelerates from standstill to that speed in 0.2 seconds (450 pixels per second every second) and when it is released it brakes to a stop in 0.15 seconds (600 pixels per second every second). If you switch arrows, it first brakes to a stop and then accelerates toward the other side. It does not leave the screen: on reaching the edge it stops dead. Its center stays 24 pixels from the bottom edge. When sliding a finger it accelerates the same way toward the target the finger marks and starts braking in time to stop exactly on it, without overshooting or exceeding 90 pixels per second. On appearing, on exploding and on being removed, the ship is left stopped. Timings proposed by Claude and accepted by the owner, to be adjusted after trying it. Code in js/jugador.js (KF.jugador.vx, ACELERACION, FRENADO, acercarVelocidad).
- 2026-10-05 12:46 · Validated by the owner: inertia is implemented and the node becomes stable.

## Requirements
- 2026-10-05 11:51 · draft: Make the player ship accelerate and brake smoothly instead of moving at a fixed speed.
