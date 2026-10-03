---
title: Gráficos
depends_on: [architecture]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
---
## Summary
El aspecto visual del juego: la pantalla, el fondo y los sprites pixel-art de todas las naves, bombas, disparos y explosiones, tomando como referencia las capturas del arcade.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:44 · Pantalla vertical como el arcade, de 224×288 píxeles lógicos escalada a la ventana. Fondo negro por ahora; el fondo de estrellas de las capturas queda pendiente en este nodo.
- 2026-10-03 18:44 · Sprites provisionales de las cuatro naves alienígenas en formación, definidos como mapas de píxeles en js/graficos.js; este nodo los afinará a partir de las capturas.
- 2026-10-03 18:46 · Sprites provisionales de la nave del jugador (blanca con detalles rojos y azules), su disparo (línea amarilla) y su explosión en tres fases, como mapas de píxeles en js/graficos.js; este nodo los afinará a partir de las capturas.

## Requirements
- 2026-10-03 18:13 · Adjunto dos capturas como referencia visual. En la primera, una formación de nave amarilla y dos rojas desciende para atacar. En la segunda, una nave lila desciende hacia la nave del jugador mientras dos bombas (líneas blancas verticales algo gruesas) van cayendo.
- 2026-10-03 18:22 · draft: Dibujar la pantalla y los sprites pixel-art (nave del jugador, cuatro naves alienígenas, disparo, bombas, explosión) a partir de sources/KF1.JPG y sources/KF2.JPG.
- 2026-10-03 18:40 · Derived from enemigos/ataque: las naves alienígenas se dibujan rotadas a cualquier ángulo (giro de 180° al salir y orientación hacia el jugador en el picado).
- 2026-10-03 18:42 · 2. A (pantalla vertical como el arcade, escalada a la ventana, fondo negro por ahora; las estrellas quedan para Gráficos)
- 2026-10-03 18:44 · Derived from enemigos/formacion: sprites de las cuatro naves alienígenas en formación.
- 2026-10-03 18:42 · Derived from jugador: sprites de la nave del jugador, su disparo y su explosión.
