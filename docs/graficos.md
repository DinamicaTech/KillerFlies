---
title: Gráficos
depends_on: [architecture, enemigos]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Gráficos | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiDr96WsqVT3NCseBCYwgNre
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Formaciones por oleada | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
El aspecto visual del juego: la pantalla, el fondo y los sprites pixel-art de todas las naves, bombas, disparos y explosiones, tomando como referencia las capturas del arcade. Todo está en js/graficos.js: un fondo de estrellas de colores que bajan y parpadean, los sprites ya coloreados que usan las demás partes del juego y la fuente pixel-art de los textos.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:44 · [replaced by 2026-10-03 19:08] Pantalla vertical como el arcade, de 224×288 píxeles lógicos escalada a la ventana. Fondo negro por ahora; el fondo de estrellas de las capturas queda pendiente en este nodo.
- 2026-10-03 18:44 · [replaced by 2026-10-03 19:08] Sprites provisionales de las cuatro naves alienígenas en formación, definidos como mapas de píxeles en js/graficos.js; este nodo los afinará a partir de las capturas.
- 2026-10-03 18:46 · [replaced by 2026-10-03 19:08] Sprites provisionales de la nave del jugador (blanca con detalles rojos y azules), su disparo (línea amarilla) y su explosión en tres fases, como mapas de píxeles en js/graficos.js; este nodo los afinará a partir de las capturas.
- 2026-10-03 19:05 · [replaced by 2026-10-03 19:08] Dibujo girado: las naves se pueden dibujar centradas y giradas a cualquier ángulo (lo usan las naves en picado). Sprite provisional de la bomba: línea blanca vertical de 1×5 píxeles, en js/graficos.js.
- 2026-10-03 19:10 · [replaced by 2026-10-03 19:08] Sprite provisional de la explosión de las naves alienígenas, en tres fases (roja, amarilla y blanca), como mapas de píxeles en js/graficos.js; este nodo lo afinará.
- 2026-10-03 19:08 · Pantalla vertical como el arcade, de 224×288 píxeles lógicos escalada a la ventana, con fondo de estrellas: 70 puntos de colores (sobre todo blancos) que bajan a 12 píxeles por segundo y parpadean, cada uno con su ritmo. Se dibuja detrás de todo.
- 2026-10-03 19:08 · Sprites a partir de sources/KF1.JPG y sources/KF2.JPG, como mapas de píxeles en js/graficos.js, que también da cada sprite ya coloreado (KF.graficos.SPRITES_NAVE, SPRITE_JUGADOR, SPRITE_DISPARO, SPRITE_BOMBA, SPRITES_EXPLOSION_JUGADOR, SPRITES_EXPLOSION_NAVE); las demás partes solo los usan. Las naves se pueden dibujar centradas y giradas a cualquier ángulo (lo usan las naves en picado).
- 2026-10-03 19:08 · Naves alienígenas de 11 píxeles de ancho, con dos antenas, brazos con las puntas hacia arriba, ojos y alas bajo los brazos: azul (cuerpo celeste, alas azules), lila (cuerpo y alas lila), roja (cuerpo rojo, alas azul claro). La amarilla (nodriza) tiene cúpula naranja, cuerpo amarillo con bordes blancos, alas azul oscuro y cola. Sin aleteo en la formación (el dueño aceptó la recomendación).
- 2026-10-03 19:08 · Nave del jugador de 13×13 píxeles: cúpula roja y tres columnas blancas rellenas de celeste. Disparo: línea amarilla de 1×4. Bombas: línea blanca de 2×6. Explosión del jugador en tres fases (rojo, amarillo y blanco, con restos celestes); explosión de las naves alienígenas en cuatro fases, un destello que se abre en un anillo de chispas.
- 2026-10-03 19:11 · Validado por el dueño: pasa a estable.
- 2026-10-03 19:18 · Fuente: una sola fuente pixel-art de 5×7 para todos los textos, con cifras, barra, letras de la A a la Z y espacio, en js/graficos.js (KF.graficos.crearFuente(color), escribir y anchoTexto, con escala para agrandarla). Viene de la fuente de cifras que tenía el marcador.
- 2026-10-04 10:52 · Power-ups: cápsula de 5×7 (dos sprites, azul con franja amarilla y rosa con franja blanca, para el parpadeo; KF.graficos.SPRITES_CAPSULA), bomba del jugador como un rombo naranja de 3×3 (SPRITE_BOMBA_JUGADOR) y la onda de su explosión, un círculo amarillo y naranja que se abre y se apaga (dibujarOnda).
- 2026-10-04 12:05 · Naves nuevas: verde (cuerpo verde, ojos blancos, alas verde oscuro), naranja (cuerpo naranja, ojos oscuros, alas rojizas) y cian (cuerpo cian claro, ojos oscuros, alas rosa), con el mismo dibujo de 11 píxeles que la azul, la lila y la roja.
- 2026-10-05 12:05 · Destello del cañón de la nave del jugador al disparar: estrella de 5×3 blanca con centro amarillo (KF.graficos.SPRITE_DESTELLO), para jugador/destello-disparo.
- 2026-10-05 12:23 · Colores de los fragmentos de la explosión del jugador: los mismos rojo, amarillo, blanco y celeste de su explosión (KF.graficos.COLORES_FRAGMENTOS), para jugador/explosion-fragmentos.

## Requirements
- 2026-10-03 18:13 · Adjunto dos capturas como referencia visual. En la primera, una formación de nave amarilla y dos rojas desciende para atacar. En la segunda, una nave lila desciende hacia la nave del jugador mientras dos bombas (líneas blancas verticales algo gruesas) van cayendo.
- 2026-10-03 18:22 · draft: Dibujar la pantalla y los sprites pixel-art (nave del jugador, cuatro naves alienígenas, disparo, bombas, explosión) a partir de sources/KF1.JPG y sources/KF2.JPG.
- 2026-10-03 18:40 · Derived from enemigos/ataque: las naves alienígenas se dibujan rotadas a cualquier ángulo (giro de 180° al salir y orientación hacia el jugador en el picado).
- 2026-10-03 18:42 · 2. A (pantalla vertical como el arcade, escalada a la ventana, fondo negro por ahora; las estrellas quedan para Gráficos)
- 2026-10-03 18:44 · Derived from enemigos/formacion: sprites de las cuatro naves alienígenas en formación.
- 2026-10-03 18:42 · Derived from jugador: sprites de la nave del jugador, su disparo y su explosión.
- 2026-10-03 19:05 · Derived from enemigos/ataque: sprite de la bomba de las naves alienígenas.
- 2026-10-03 19:10 · Derived from enemigos: sprite provisional de la explosión de las naves alienígenas.
- 2026-10-03 19:18 · Derived from partida: fuente pixel-art de letras y cifras para los textos.
- 2026-10-04 10:52 · Derived from power-ups: dibujo de la cápsula que parpadea y de la explosión de la bomba.
- 2026-10-04 12:05 · Derived from enemigos/formacion: los sprites de las naves verde, naranja y cian.
- 2026-10-05 12:05 · Derived from jugador/destello-disparo: sprite del destello del cañón (SPRITE_DESTELLO).
