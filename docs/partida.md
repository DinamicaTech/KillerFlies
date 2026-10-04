---
title: Partida
depends_on: [jugador, enemigos, enemigos/formacion, enemigos/ataque, marcador, graficos]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Ciclo de la partida | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCY7xaWMqRabakQpAk9ek7y
  - Controles táctiles | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
---
## Summary
El ciclo de la partida, en js/partida.js: pantalla 'START GAME' con la formación moviéndose detrás, que empieza con cualquier tecla o una pulsación corta en la pantalla táctil; oleadas sucesivas, cada una un 5% más rápida que la anterior en todo (bloque, picados y bombas); tres naves del jugador (una en juego y dos de recambio, que el power-up vida extra puede subir hasta cinco) y 'GAME OVER' al perder la última, que se queda hasta pulsar una tecla o hacer una pulsación corta y entonces vuelve a 'START GAME'. Avisa al marcador de la oleada, las naves de recambio y el inicio de cada partida.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 19:18 · Estados: inicio ('START GAME'), jugando y fin ('GAME OVER'). Los mensajes se escriben en grande (fuente de gráficos al doble) en el centro de la pantalla: 'START GAME' en amarillo y 'GAME OVER' en rojo.
- 2026-10-03 19:18 · [replaced by 2026-10-04 10:16] Inicio: la formación de la primera oleada se mueve detrás del texto sin atacar, porque la nave del jugador no está. Cualquier tecla empieza la partida: puntos a cero, oleada 1, dos naves de recambio y la nave del jugador en el centro.
- 2026-10-03 19:18 · Oleadas: dos segundos después de destruir la última nave de la oleada (con la nave del jugador en juego) llega la siguiente, con la formación completa. Cada oleada va un 5% más rápida que la anterior (acumulativo y sin tope) en todo: el desplazamiento del bloque, los picados y las bombas (KF.ataque.factorVelocidad). Además, Ataque lanza más ataques y más seguidos con el número de oleada (KF.ataque.oleada).
- 2026-10-03 19:18 · Naves perdidas: la oleada sigue como estaba. Al menos dos segundos después de explotar, y cuando las naves en picado han vuelto a la formación y no quedan bombas, sale la nave de recambio en el centro, el marcador la descuenta y los ataques esperan dos segundos antes de empezar.
- 2026-10-03 19:18 · [replaced by 2026-10-04 10:16] Fin: al perder la última nave, dos segundos después de explotar aparece 'GAME OVER' y se queda hasta pulsar una tecla; entonces vuelve a 'START GAME'. Las teclas del primer segundo de 'GAME OVER' no cuentan, para no saltarlo sin querer al estar disparando.
- 2026-10-03 19:18 · Marcador: Partida le da la oleada en curso, las naves de recambio que quedan y pone los puntos a cero al empezar cada partida.
- 2026-10-03 19:18 · Código en js/partida.js (KF.partida), que se dibuja encima de todo.
- 2026-10-03 19:20 · Validado por el owner: el ciclo de la partida queda implementado y el nodo pasa a estable.
- 2026-10-04 10:16 · Inicio: la formación de la primera oleada se mueve detrás del texto sin atacar, porque la nave del jugador no está. Cualquier tecla o una pulsación corta en la pantalla táctil empieza la partida: puntos a cero, oleada 1, dos naves de recambio y la nave del jugador en el centro. La pulsación corta que empieza la partida no dispara.
- 2026-10-04 10:16 · Fin: al perder la última nave, dos segundos después de explotar aparece 'GAME OVER' y se queda hasta pulsar una tecla o hacer una pulsación corta; entonces vuelve a 'START GAME'. Las teclas y pulsaciones del primer segundo de 'GAME OVER' no cuentan, para no saltarlo sin querer al estar disparando.
- 2026-10-04 11:30 · Vida extra: el power-up vida extra suma una nave de recambio (KF.partida.sumarRecambio), hasta un máximo de 5, y el marcador la muestra.

## Requirements
- 2026-10-03 18:13 · Cuando todas las naves enemigas hayan sido destruidas, se iniciará una nueva oleada con una velocidad de movimiento incrementada en un 5%.
- 2026-10-03 18:13 · Si alguna nave alienígena o una bomba choca contra la nave del jugador, esta explota. Tiene dos naves de recambio (que aparecen pequeñitas a la derecha abajo del todo) que irá perdiendo cada vez que sea destruido. Cuando la última nave del jugador sea destruido, mensaje 'GAME OVER'
- 2026-10-03 18:13 · Al inicio de la partida, aparece un texto 'START GAME' grande en medio de la pantalla. Pulsando cualquier tecla, comienza la partida.
- 2026-10-03 18:22 · draft: Implementar el ciclo de la partida: pantalla 'START GAME' que empieza con cualquier tecla, oleadas sucesivas con un 5% más de velocidad cada una, tres naves del jugador (una en juego y dos de recambio, que el power-up vida extra puede subir hasta cinco) y mensaje 'GAME OVER' al perder la última.
- 2026-10-03 19:10 · Derived from marcador: avisar al marcador de la oleada en curso y de las naves de recambio que quedan, y poner los puntos a cero al empezar cada partida.
- 2026-10-03 19:15 · 1. A (el +5% afecta a todo: bloque, picados y bombas)
- 2026-10-03 19:15 · 2. A (tras perder una nave la oleada sigue, y las naves en picado vuelven a la formación antes de que aparezca la de recambio)
- 2026-10-03 19:15 · 3. B (tras 'GAME OVER' se queda hasta pulsar una tecla)
- 2026-10-04 10:16 · Derived from architecture: una pulsación corta inicia la partida y también sale de 'GAME OVER'.
- 2026-10-04 11:30 · Derived from power-ups: sumar una nave de recambio con el power-up vida extra, hasta un máximo de 5.
