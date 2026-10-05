---
title: Sonidos con más profundidad
status: draft
depends_on: [power-ups, partida]
threads:
  - Sonidos con más profundidad | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiKtDX1VB4yqoMRuygVESB5t
---
## Summary
Pendiente: sustituir los sonidos actuales por otros con más profundidad (más capas, cuerpo y graves) y añadir uno al recoger un power-up y otro al empezar cada oleada.

## Decisions
- 2026-10-05 10:55 · Takes over the draft de sonidos con más profundidad que estaba dentro de `sonido`: pasa a ser su propio nodo hijo (CVP rules versión 8).

## Requirements
- 2026-10-05 10:11 · Draft: Modificar los sonidos por otros con más profundidad
- 2026-10-05 10:16 · Incluimos power-up e inicio de oleada
- 2026-10-05 10:16 · draft: Sustituir los sonidos actuales (disparo, explosiones y zumbido de ataque) por otros con más profundidad (más capas, cuerpo y graves), manteniendo sus momentos y volúmenes relativos, y añadir dos sonidos nuevos con la misma calidad: uno al recoger un power-up y otro al empezar cada oleada.
