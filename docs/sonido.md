---
title: Sonido
depends_on: [architecture, jugador, enemigos, enemigos/ataque]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Sonido | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi5jiNUVSiXE1749BDZmXrnT
---
## Summary
Los efectos de sonido del juego, sintetizados con Web Audio en js/sonido.js: un "piu" con cada disparo del jugador, un ruido de explosión cada vez que se destruye una nave (más grave y largo si es la del jugador) y un zumbido mientras alguna nave alienígena sale de la formación o baja en picado. El sonido se activa con la primera tecla pulsada.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 19:12 · Disparo: un "piu" de onda cuadrada que cae de agudo a grave en 0,15 segundos, cada vez que sale un disparo de la nave del jugador.
- 2026-10-03 19:12 · Explosión: ruido filtrado que se apaga, cada vez que se destruye una nave, alienígena o del jugador ("una nave" sin distinguir). La de una alienígena dura 0,5 segundos; la del jugador es más grave, fuerte y dura 1,2 segundos. Se engancha al aviso de nave destruida de enemigos (KF.enemigos.alDestruir) y al paso de la nave del jugador a explotando.
- 2026-10-03 19:12 · Zumbido de ataque: suena durante todo el picado, desde que una nave deja su hueco hasta que sale por abajo (no en la vuelta a la formación), y se agrava a medida que la nave más alta de las que atacan desciende. Se apaga cuando no queda ninguna nave saliendo o en picado.
- 2026-10-03 19:12 · Sonido solo observa el juego (disparo, estado del jugador, aviso de nave destruida y atacantes); las demás partes no lo llaman. El audio se pone en marcha con la primera tecla, porque los navegadores no dejan sonar nada antes, y se detiene con la pestaña oculta. Código en js/sonido.js.

## Requirements
- 2026-10-03 18:13 · Hay efectos de sonido: disparos de la nave del jugador; ruido de explosión al resultar destruida una nave; zumbido mientras una nave alienígena abandona la formación para hacer un ataque.
- 2026-10-03 18:22 · draft: Sintetizar los tres efectos de sonido (disparo, explosión y zumbido de ataque) y lanzarlos en sus momentos.
- 2026-10-03 19:07 · B (zumbido durante todo el picado)
