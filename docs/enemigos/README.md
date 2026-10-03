---
title: Enemigos
depends_on: [graficos]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Tipos de nave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFynq9GYHcEL7zVzxwoVjPM
---
## Summary
Las naves alienígenas: cuatro tipos (azul, lila, roja y amarilla) con sus puntos (10, 20, 30 y 50) y su máximo de bombas por ataque (2, 3, 4 y 4). Una nave muere al recibir un disparo del jugador o al chocar contra él: explota en su sitio y avisa para que se sumen sus puntos. Sus hijos definen la formación y los ataques en picado.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:44 · Tabla de tipos en js/enemigos.js (KF.TIPOS_NAVE): color, puntos, máximo de bombas y sprite de cada tipo.
- 2026-10-03 19:10 · Destrucción: toda nave alienígena muere en un único sitio, KF.enemigos.destruir (js/enemigos.js), tanto por el disparo del jugador (en formación o en picado) como al chocar contra él. Deja en su sitio una explosión de tres fases de 0,1 segundos (dibujo provisional en js/graficos.js) y avisa a quien se apunte con KF.enemigos.alDestruir(fn(nave, motivo)), con motivo 'disparo' o 'choque'.
- 2026-10-03 19:10 · Puntos: la nave destruida da los puntos de su tipo tanto si la alcanza el disparo como si choca contra el jugador, como en el arcade. Sumarlos y mostrarlos queda para Marcador; el ruido de explosión, para Sonido.
- 2026-10-03 19:06 · Validado por el dueño: pasa a estable.

## Requirements
- 2026-10-03 18:13 · Hay cuatro tipos de naves alienígenas (azul, lila, roja y amarilla) que dan 10, 20, 30 y 50 puntos respectivamente al ser destruidas.
- 2026-10-03 18:22 · draft: Definir los cuatro tipos de nave alienígena (azul, lila, roja y amarilla), con sus puntos (10, 20, 30 y 50) y su número máximo de bombas por ataque (2, 3, 4 y 4), y su destrucción al recibir un disparo del jugador.
- 2026-10-03 18:44 · Derived from enemigos/formacion: tabla de los cuatro tipos de nave con su color, puntos y bombas.
- 2026-10-03 19:03 · (A la pregunta «si una nave alienígena choca contigo, ¿da puntos?») Sí
