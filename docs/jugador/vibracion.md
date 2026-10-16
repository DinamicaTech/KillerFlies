---
title: Phone vibration
depends_on: [power-ups, multijugador]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Phone vibration | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiMBmB3srJCYhT8Kqqg12G7w
---
## Summary
On a phone, the device vibrates for 0.4 s when the player's ship explodes and for 0.06 s when it picks up a power-up capsule (any power, the extra life and the slow-fire power-down included). The extra lives from the challenge wave (partida/oleada-desafio) and from points (partida/vida-extra-por-puntos) do not vibrate. Nothing vibrates while the game is paused or the page is hidden, and an explosion blocked by the spawn shield is not an explosion. In a two-player game only the phone of the player it happens to vibrates: each ship counts its own capsules (KF.Nave.capsulas, sent to the guest in the host's snapshot). It uses the browser's vibration API (navigator.vibrate, in js/vibracion.js), which iPhone Safari does not offer, so it only vibrates on Android; on a PC nothing changes. It came from the creative lab.

Acceptance: on an Android phone, losing a ship and picking up a capsule make the phone vibrate (long and short); an extra life from the challenge wave or from points does not.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 09:57 · Leaves the lab: executed, as the node jugador/vibracion. Long vibration (400 ms) on the explosion of this device's ship, short one (60 ms) on each power-up capsule it picks up; not on extra lives from the challenge wave or from points; only on the phone of the player it happens to; Android only, because iPhone Safari has no vibration API.

## Requirements
- 2026-10-13 17:06 · idea: Make the phone vibrate when the player ship is destroyed and when it picks up a power-up.
- 2026-10-16 09:44 · Pasamos a desarrollo
