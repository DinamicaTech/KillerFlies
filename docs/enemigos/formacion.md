---
title: Formación
depends_on: [enemigos, architecture, graficos, enemigos/ataque, partida]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Formaciones por oleada | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
El bloque de naves alienígenas en la parte superior de la pantalla: su distribución en una rejilla de 6 filas por 10 columnas, distinta en cada oleada, y su desplazamiento horizontal de un extremo a otro. Hay seis formaciones (Clásica, Uve, Rombo, Columnas, Ajedrez y Fortaleza) que cambian la forma y la mezcla de los siete tipos de nave; la oleada 1 es la clásica del arcade y desde la 7 se repiten en orden la 2 a la 6. El bloque da la vuelta cuando la nave viva más extrema toca el borde y empieza recorriendo la pantalla en unos 4 segundos; cada nave conserva su hueco para volver a él tras un ataque.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:44 · [replaced by 2026-10-03 18:47] Distribución: 46 naves en una rejilla de 10 columnas por 6 filas (de arriba abajo: 2 amarillas en las columnas 3 y 7, sobre las rojas 2 y 6; 6 rojas en las columnas 2 a 7; 8 lilas en las columnas 1 a 8; tres filas de 10 azules). Cada nave guarda su fila y columna, y la formación da la posición de su hueco en cada instante.
- 2026-10-03 18:44 · Vuelta del bloque: cuando el hueco más extremo de las naves que quedan vivas toca el borde de la pantalla; al destruir columnas laterales el bloque recorre más espacio, como en el arcade.
- 2026-10-03 18:44 · Velocidad inicial del vaivén: unos 4 segundos de un extremo a otro con el bloque completo (16 píxeles por segundo en la pantalla de 224 de ancho). Es un valor que Partida sube al empezar cada oleada.
- 2026-10-03 18:44 · [replaced by 2026-10-04 12:05] Código en js/formacion.js; la formación se reinicia con sus 46 naves al empezar una oleada.
- 2026-10-03 18:47 · [replaced by 2026-10-04 12:05] Distribución: 46 naves en una rejilla de 10 columnas por 6 filas (de arriba abajo: 2 amarillas en las columnas 3 y 6, sobre las rojas 2 y 5, simétricas como en el arcade; 6 rojas en las columnas 2 a 7; 8 lilas en las columnas 1 a 8; tres filas de 10 azules). Cada nave guarda su fila y columna, y la formación da la posición de su hueco en cada instante.
- 2026-10-03 18:46 · Impacto del disparo del jugador: la formación comprueba si un rectángulo toca alguna nave viva en su hueco (zona de 11×8 píxeles centrada en él); si es así, esa nave desaparece y se informa al disparo, que se libera. Los puntos quedan para Marcador y las naves en picado para enemigos/ataque.
- 2026-10-04 12:05 · Formaciones por oleada: cada oleada tiene su formación en la rejilla de 10 columnas por 6 filas, de arriba abajo (A amarilla, R roja, L lila, B azul, V verde, N naranja, C cian, · vacío). 1 Clásica, 46 naves: ···A··A··· / ··RRRRRR·· / ·LLLLLLLL· / tres filas de 10 B (amarillas sobre las rojas 2 y 5, como el arcade). 2 Uve, 30 naves: ····AA···· / ···RRRR··· / ··LLVVLL·· / ·BBVVVVBB· / BBV····VBB / BV······VB. 3 Rombo, 28 naves: ····AA···· / ···RNNR··· / ··LRNNRL·· / ·BLLBBLLB· / ··BBNNBB·· / ····BB····. 4 Columnas, 38 naves: ·A······A· / RRR·CC·RRR / LLL·CC·LLL / BBB·CC·BBB / BBB····BBB / BBB····BBB. 5 Ajedrez, 26 naves: ··A····A·· / ·R·R··R·R· / C·V·NN·V·C / ·L·L··L·L· / B·V·BB·V·B / ·B·N··N·B·. 6 Fortaleza, 46 naves: ···A··A··· / ··RRCCRR·· / ·NLLLLLLN· / VVBBBBBBVV / CBBNBBNBBC / BBBBBBBBBB. Desde la oleada 7 se repiten en orden la 2 a la 6. Cada nave guarda su fila y columna, y la formación da la posición de su hueco en cada instante.
- 2026-10-04 12:05 · Todas las formaciones tienen amarillas con rojas cerca, para que la amarilla pueda salir con dos rojas de escolta y soltar el power-up.
- 2026-10-04 12:05 · Código en js/formacion.js (KF.formacion.FORMACIONES, formacionDeOleada); al empezar una oleada, Partida reinicia la formación con la de esa oleada (KF.formacion.reiniciar(velocidad, oleada)).

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 2: oleadas de naves en un bloque de 6 filas por 10 columnas arriba; de abajo arriba, tres filas de 10 azules, una de 8 lilas alineadas con las 8 azules centrales, una de 6 rojas alineadas con las 6 lilas centrales y una de 2 amarillas sobre las rojas 2 y 6.
- 2026-10-03 18:13 · El bloque de naves se va desplazando horizontalmente de un extremo a otro de la pantalla.
- 2026-10-03 18:22 · draft: Implementar la formación de 46 naves según la distribución de sources/KillerFlies.txt § 2 y su vaivén horizontal de un extremo a otro de la pantalla, conservando el hueco de cada nave para que vuelva a él tras un ataque.
- 2026-10-03 18:42 · 3. A (el bloque da la vuelta cuando la nave que queda más a un lado toca el borde, como en el arcade)
- 2026-10-03 18:42 · 4. A (vaivén lento como el arcade, unos 4 segundos de un extremo a otro)
- 2026-10-03 18:47 · B (amarillas sobre las rojas 2 y 5, como el arcade, en lugar de la 2 y la 6)
- 2026-10-03 18:42 · Derived from jugador: indicar si el disparo del jugador toca una nave de la formación; esa nave desaparece y el disparo se libera.
- 2026-10-04 11:57 · Vamos a hacer que cada nivel tenga una formación y composición de enemigos diferentes, añadiendo más tipos de enemigos con ataques diferentes
