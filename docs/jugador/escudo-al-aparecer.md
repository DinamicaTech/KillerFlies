---
title: Escudo al aparecer
depends_on: []
threads:
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Escudo al aparecer | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiF2yKDQhz2dpj7kMYn4YEgz
---
## Summary
Al aparecer, la nave del jugador parpadea dos segundos y mientras tanto es invulnerable; la nave alienígena que choca con ella se destruye y la bomba desaparece.

## Decisions
- 2026-10-05 11:51 · Creado como draft hijo de Jugador, uno de los seis para probar el apilado de cajas de Claude Visual Project.
- 2026-10-05 12:12 · Escudo: cada vez que Partida hace aparecer la nave (KF.jugador.aparecer), durante 2 segundos parpadea (0,1 segundos visible y 0,1 invisible) y KF.jugador.explotar no tiene efecto; se mueve y dispara con normalidad. La nave alienígena en picado que choca con ella se destruye igualmente (y da sus puntos) y la bomba que la toca desaparece. Código en js/jugador.js (KF.jugador.escudo); Ataque y Partida no cambian.
- 2026-10-05 12:12 · Validado por el owner: el nodo pasa a estable.

## Requirements
- 2026-10-05 11:51 · draft: Al aparecer, la nave del jugador parpadea dos segundos y durante ese tiempo es invulnerable.
- 2026-10-05 12:09 · Mejor que se destruya la nave enemiga
