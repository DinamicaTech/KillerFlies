---
title: Formación
depends_on: [enemigos]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
El bloque de naves alienígenas en la parte superior de la pantalla: su distribución por filas y su desplazamiento horizontal de un extremo a otro.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 2: oleadas de naves en un bloque de 6 filas por 10 columnas arriba; de abajo arriba, tres filas de 10 azules, una de 8 lilas alineadas con las 8 azules centrales, una de 6 rojas alineadas con las 6 lilas centrales y una de 2 amarillas sobre las rojas 2 y 6.
- 2026-10-03 18:13 · El bloque de naves se va desplazando horizontalmente de un extremo a otro de la pantalla.
- 2026-10-03 18:22 · draft: Implementar la formación de 46 naves según la distribución de sources/KillerFlies.txt § 2 y su vaivén horizontal de un extremo a otro de la pantalla, conservando el hueco de cada nave para que vuelva a él tras un ataque.
