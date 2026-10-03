---
title: Jugador
depends_on: [enemigos/formacion, graficos, architecture]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Nave del jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi8uEd3vf7FBd7b8W9rNHB1b
---
## Summary
La nave que controla el jugador en la parte inferior de la pantalla: se mueve en horizontal con las flechas, dispara con el espacio de uno en uno (el disparo se libera al dar en una nave o salir por arriba) y explota si la alcanza una nave o una bomba. Mientras Partida no gestione las naves de recambio, reaparece sola tras explotar.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:46 · [replaced by 2026-10-03 18:49] Teclas: flecha izquierda y flecha derecha para moverse, barra espaciadora para disparar (opción A de la pregunta, recomendada, a falta de que el owner la confirme). Mantener pulsado el espacio dispara de nuevo en cuanto se libera el disparo.
- 2026-10-03 18:46 · Movimiento: la nave se mueve a 90 píxeles por segundo (unos 2,5 segundos de lado a lado) y no sale de la pantalla; su centro está a 24 píxeles del borde inferior, dejando sitio debajo para las naves de recambio.
- 2026-10-03 18:46 · Disparo: uno solo en pantalla, sube a 300 píxeles por segundo y se libera al tocar una nave de la formación (que lo comprueba y destruye esa nave) o al salir por arriba. Si la nave explota, el disparo ya lanzado sigue su camino.
- 2026-10-03 18:46 · Explosión: la nave expone su rectángulo de choque y una orden de explotar, que llamará quien detecte el choque con una nave alienígena o una bomba (enemigos/ataque). La explosión dura tres fases de 0,15 segundos y mientras tanto la nave no se mueve ni dispara.
- 2026-10-03 18:46 · Provisional hasta que Partida gestione las naves de recambio y el GAME OVER: dos segundos después de explotar la nave reaparece en el centro.
- 2026-10-03 18:46 · Código en js/jugador.js; los dibujos de la nave, el disparo y la explosión, provisionales, están en js/graficos.js.
- 2026-10-03 18:49 · Teclas: flecha izquierda y flecha derecha para moverse, barra espaciadora para disparar, confirmado por el owner. Mantener pulsado el espacio dispara de nuevo en cuanto se libera el disparo.
- 2026-10-03 18:50 · Validado por el owner: la nave del jugador queda implementada y el nodo pasa a estable.

## Requirements
- 2026-10-03 18:13 · La nave que controla el jugador está en la parte inferior de la pantalla y solo se puede mover horizontalmente mientras dispara.
- 2026-10-03 18:13 · Hasta que el disparo no da en un blanco o llega a la parte superior de la pantalla, no se puede volver a disparar.
- 2026-10-03 18:13 · Si alguna nave alienígena o una bomba choca contra la nave del jugador, esta explota.
- 2026-10-03 18:22 · draft: Implementar la nave del jugador: movimiento horizontal con el teclado en la parte inferior, un único disparo en pantalla que se libera al impactar o salir por arriba, y explosión al chocar con una nave alienígena o una bomba.
- 2026-10-03 18:48 · Flechas + espacio
