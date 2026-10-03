---
title: Gráficos
depends_on: [architecture]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
El aspecto visual del juego: la pantalla, el fondo y los sprites pixel-art de todas las naves, bombas, disparos y explosiones, tomando como referencia las capturas del arcade.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · Adjunto dos capturas como referencia visual. En la primera, una formación de nave amarilla y dos rojas desciende para atacar. En la segunda, una nave lila desciende hacia la nave del jugador mientras dos bombas (líneas blancas verticales algo gruesas) van cayendo.
- 2026-10-03 18:22 · draft: Dibujar la pantalla y los sprites pixel-art (nave del jugador, cuatro naves alienígenas, disparo, bombas, explosión) a partir de sources/KF1.JPG y sources/KF2.JPG.
- 2026-10-03 18:22 · question: ¿Tamaño y fondo de la pantalla? A) vertical como el arcade, escalada a la ventana, con fondo de estrellas como en las capturas (recomendado) B) ocupar toda la ventana, sin estrellas.
- 2026-10-03 18:40 · Derived from enemigos/ataque: las naves alienígenas se dibujan rotadas a cualquier ángulo (giro de 180° al salir y orientación hacia el jugador en el picado).
