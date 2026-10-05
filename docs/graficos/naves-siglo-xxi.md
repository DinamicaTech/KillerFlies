---
title: Naves del siglo XXI
status: draft
depends_on: [enemigos]
threads:
  - Naves menos pixeladas | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi78ZNHwzRnK9ZGpD1boPKcb
  - Naves del siglo XXI | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiLhC4qt67cPrzNnZtpQV8tk
---
## Summary
Las siete naves enemigas y la del jugador como "naves del siglo XXI" con aroma retro: dibujadas por código con trazos suaves, degradados metálicos, brillos y luces, a cuatro veces la resolución de la pantalla lógica, con los mismos colores, tamaños en pantalla y silueta de cada tipo. Bombas, disparos, explosiones, estrellas y textos siguen pixelados. Pendiente de que el dueño lo valide jugando.

## Decisions
- 2026-10-05 11:45 · Creado como draft hijo de Gráficos, el nodo dueño de todos los sprites (js/graficos.js).
- 2026-10-05 13:00 · Sprites a partir de sources/KF1.JPG y sources/KF2.JPG, en js/graficos.js, que también da cada sprite ya coloreado (KF.graficos.SPRITES_NAVE, SPRITE_JUGADOR, SPRITE_DISPARO, SPRITE_BOMBA, SPRITES_EXPLOSION_JUGADOR, SPRITES_EXPLOSION_NAVE); las demás partes solo los usan. Las naves (las siete alienígenas y la del jugador) se dibujan por código con trazos y degradados a KF.RESOLUCION (4) veces la resolución de la pantalla lógica y se ven suavizadas; todo lo demás sigue como mapas de píxeles. Los sprites miden en píxeles lógicos y se pueden dibujar centrados y girados a cualquier ángulo (lo usan las naves en picado).
- 2026-10-05 13:00 · Naves alienígenas de 11×9 píxeles lógicos, estilo "siglo XXI": casco ovalado con degradado metálico que se estrecha en una cola en punta, dos antenas con la punta encendida, brazos con las puntas hacia arriba, ojos luminosos y alas en flecha bajo los brazos con el borde iluminado. Colores: azul (cuerpo celeste, alas azules), lila (cuerpo y alas lila), roja (cuerpo rojo, alas azul claro), verde (cuerpo verde, ojos blancos, alas verde oscuro), naranja (cuerpo naranja, ojos oscuros, alas rojizas) y cian (cuerpo cian claro, ojos oscuros, alas rosa). La amarilla (nodriza), de 11×10: cúpula naranja brillante con reflejo y ojos, casco amarillo con ribete blanco y luces, aletas azul oscuro a los lados y cola en aguijón. Sin aleteo en la formación.
- 2026-10-05 13:00 · Nave del jugador de 13×13 píxeles lógicos: morro rojo en flecha con reflejo y tres columnas (fuselaje y dos motores) de casco blanco metálico con el interior celeste encendido, unidas por travesaños y con toberas que brillan. Disparo: línea amarilla de 1×4. Bombas: línea blanca de 2×6. Explosión del jugador en tres fases (rojo, amarillo y blanco, con restos celestes); explosión de las naves alienígenas en cuatro fases, un destello que se abre en un anillo de chispas.

## Requirements
- 2026-10-05 11:43 · draft: Mejorar el diseño de las naves enemigas para que no estén tan pixeladas con aroma a retro. Digamos que vamos a convertirlas en naves del siglo XXI
- 2026-10-05 11:44 · draft: Rediseñar las siete naves enemigas para que no se vean tan pixeladas, convirtiéndolas en "naves del siglo XXI" con aroma retro: más resolución y detalle que la pantalla lógica de 224×288, manteniendo sus colores, tamaños en pantalla y la silueta de cada tipo.
- 2026-10-05 12:50 · Mejorar el diseño de las naves enemigas y la del jugador para que no estén tan pixeladas con aroma a retro. Digamos que vamos a convertirlas en naves del siglo XXI
- 2026-10-05 12:56 · A (naves dibujadas con trazos suaves, degradados metálicos, brillos y ojos luminosos)
