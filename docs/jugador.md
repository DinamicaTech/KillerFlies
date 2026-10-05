---
title: Jugador
depends_on: [enemigos/formacion, graficos, architecture]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Nave del jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi8uEd3vf7FBd7b8W9rNHB1b
  - Controles táctiles | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
---
## Summary
La nave que controla el jugador en la parte inferior de la pantalla: se mueve en horizontal con las flechas o deslizando el dedo, dispara con el espacio o con una pulsación corta en la pantalla táctil, de uno en uno (el disparo se libera al dar en una nave, en formación o en picado, o al salir por arriba; el power-up activo lo cambia) y explota si la alcanza una nave o una bomba. No reaparece sola: Partida la hace aparecer en el centro al empezar la partida y con cada nave de recambio, y fuera de la partida no está. Al aparecer parpadea dos segundos y mientras tanto es invulnerable (jugador/escudo-al-aparecer). Al disparar, el cañón da un breve destello (jugador/destello-disparo). Al explotar lanza fragmentos que se dispersan y se apagan (jugador/explosion-fragmentos). Acelera y frena de forma suave, a 90 píxeles por segundo como máximo (jugador/inercia, pendiente de validar). Mientras se mueve, una llamita parpadea bajo ella (jugador/estela-motor, pendiente de validar). Mejora pendiente en un draft hijo: temblor al morir.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:46 · [replaced by 2026-10-03 18:49] Teclas: flecha izquierda y flecha derecha para moverse, barra espaciadora para disparar (opción A de la pregunta, recomendada, a falta de que el owner la confirme). Mantener pulsado el espacio dispara de nuevo en cuanto se libera el disparo.
- 2026-10-03 18:46 · [replaced by jugador/inercia 2026-10-05 12:45] Movimiento: la nave se mueve a 90 píxeles por segundo (unos 2,5 segundos de lado a lado) y no sale de la pantalla; su centro está a 24 píxeles del borde inferior, dejando sitio debajo para las naves de recambio.
- 2026-10-03 18:46 · Disparo: uno solo en pantalla, sube a 300 píxeles por segundo y se libera al tocar una nave de la formación (que lo comprueba y destruye esa nave) o al salir por arriba. Si la nave explota, el disparo ya lanzado sigue su camino.
- 2026-10-03 18:46 · Explosión: la nave expone su rectángulo de choque y una orden de explotar, que llamará quien detecte el choque con una nave alienígena o una bomba (enemigos/ataque). La explosión dura tres fases de 0,15 segundos y mientras tanto la nave no se mueve ni dispara.
- 2026-10-03 18:46 · [replaced by 2026-10-03 19:18] Provisional hasta que Partida gestione las naves de recambio y el GAME OVER: dos segundos después de explotar la nave reaparece en el centro.
- 2026-10-03 18:46 · Código en js/jugador.js; los dibujos de la nave, el disparo y la explosión, provisionales, están en js/graficos.js.
- 2026-10-03 18:49 · [replaced by 2026-10-04 10:16] Teclas: flecha izquierda y flecha derecha para moverse, barra espaciadora para disparar, confirmado por el owner. Mantener pulsado el espacio dispara de nuevo en cuanto se libera el disparo.
- 2026-10-03 18:50 · Validado por el owner: la nave del jugador queda implementada y el nodo pasa a estable.
- 2026-10-03 19:05 · El disparo también alcanza a las naves en picado: además de la formación, se lo comprueba a enemigos/ataque, que destruye la nave alcanzada.
- 2026-10-03 19:18 · Aparición: la nave no reaparece sola tras explotar. Partida la hace aparecer en el centro (KF.jugador.aparecer) al empezar la partida y con cada nave de recambio, y la retira (KF.jugador.retirar) al acabar; mientras no está, no se mueve, no dispara ni se la puede alcanzar.
- 2026-10-04 10:16 · Controles: flecha izquierda y flecha derecha o deslizar el dedo para moverse; barra espaciadora o pulsación corta en la pantalla táctil para disparar. Mantener pulsado el espacio dispara de nuevo en cuanto se libera el disparo. Al deslizar el dedo la nave va hacia donde la lleva el desplazamiento horizontal del dedo (sin salir de la pantalla), pero nunca más rápido que su velocidad normal de 90 píxeles por segundo, para que no sea más fácil que con las flechas; si se suelta el dedo, termina de llegar. Pulsar una flecha cancela ese destino. Una pulsación corta dispara si no hay disparo en pantalla; si lo hay, no se guarda para después. Lo pedido con el dedo mientras la nave no está en juego se descarta.
- 2026-10-04 10:52 · Disparo con power-ups: la nave dispara según KF.powerups.activo: hasta tres disparos a la vez (acelerado), un disparo que no se detiene al dar en una nave (profundo), una bomba que explota al dar en una nave (bomba), la destrucción de todas las naves sin lanzar proyectil (aniquilación), un disparo a 150 píxeles por segundo (slow fire) o tres proyectiles paralelos que cuentan como uno (triple). Los disparos en vuelo están en KF.jugador.disparos y KF.jugador.salvas cuenta cada vez que dispara.
- 2026-10-04 11:30 · Con el disparo acelerado, cada pulsación del espacio (sin contar la repetición al mantenerlo) o cada toque lanza un solo disparo; sin él, mantener pulsado el espacio sigue disparando en cuanto se libera el disparo.
- 2026-10-05 11:51 · Seis drafts hijos para probar el apilado de cajas de Claude Visual Project: jugador/escudo-al-aparecer, jugador/estela-motor, jugador/inercia, jugador/destello-disparo, jugador/explosion-fragmentos y jugador/temblor-al-morir. Son independientes entre sí.

## Requirements
- 2026-10-03 18:13 · La nave que controla el jugador está en la parte inferior de la pantalla y solo se puede mover horizontalmente mientras dispara.
- 2026-10-03 18:13 · Hasta que el disparo no da en un blanco o llega a la parte superior de la pantalla, no se puede volver a disparar.
- 2026-10-03 18:13 · Si alguna nave alienígena o una bomba choca contra la nave del jugador, esta explota.
- 2026-10-03 18:22 · draft: Implementar la nave del jugador: movimiento horizontal con el teclado en la parte inferior, un único disparo en pantalla que se libera al impactar o salir por arriba, y explosión al chocar con una nave alienígena o una bomba.
- 2026-10-03 18:48 · Flechas + espacio
- 2026-10-03 18:54 · Sí, claro, los ataques a una nave esté en formación o no.
- 2026-10-03 19:05 · Derived from enemigos/ataque: el disparo también destruye las naves que están en picado.
- 2026-10-03 19:18 · Derived from partida: la nave ya no reaparece sola; Partida la hace aparecer y fuera de la partida no está.
- 2026-10-04 10:16 · Derived from architecture: mover la nave deslizando el dedo y disparar con una pulsación corta.
- 2026-10-04 10:52 · Derived from power-ups: el disparo cambia según el poder activo (hasta tres disparos, atraviesa, bomba, aniquilación, mitad de velocidad, triple).
- 2026-10-04 11:30 · Derived from power-ups: con el disparo acelerado, un solo disparo por pulsación.
