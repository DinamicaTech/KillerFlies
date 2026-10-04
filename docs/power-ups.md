---
title: Power-ups
status: draft
depends_on: [jugador, enemigos, enemigos/formacion, enemigos/ataque, graficos, sonido, partida]
threads:
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
---
## Summary
Power-ups aleatorios, en js/powerups.js: al destruir fuera de la formación una amarilla y sus dos rojas de escolta cae, a la mitad de velocidad que una bomba, una cápsula que parpadea (igual para todos los poderes y sin puntos). Si la nave del jugador la recoge, obtiene un poder al azar, todos con la misma probabilidad: disparo acelerado, disparo profundo, bomba, aniquilación (un solo uso), slow fire (un power-down) o disparo triple. Dura hasta acabar la oleada, el nuevo sustituye al anterior y se pierde si destruyen la nave. Para probarlos, Mayúsculas+1…6 da cada poder con el teclado.

## Decisions
- 2026-10-04 10:48 · Creada en el laboratorio como idea.
- 2026-10-04 10:48 · Solo cae el power-up cuando se destruyen las tres naves (amarilla y sus dos rojas) mientras están en picado.
- 2026-10-04 10:48 · Aniquilación es de un solo uso: el siguiente disparo destruye todas las naves enemigas y el poder se acaba. El resto de poderes dura hasta acabar la oleada.
- 2026-10-04 10:48 · Los poderes no se acumulan: el nuevo sustituye al anterior.
- 2026-10-04 10:48 · El power-down no se distingue en pantalla de los power-ups antes de recogerlo.
- 2026-10-04 10:49 · El poder se pierde si destruyen la nave del jugador.
- 2026-10-04 10:50 · Todos los poderes (incluido el power-down) salen con la misma probabilidad.
- 2026-10-04 10:50 · El power-up cae como una cápsula que parpadea, con el mismo aspecto para todos los poderes.
- 2026-10-04 10:50 · Con el disparo triple, los tres proyectiles cuentan como un único disparo activo.
- 2026-10-04 10:50 · Recoger el power-up no da puntos.
- 2026-10-04 10:52 · Sale del laboratorio: ejecutada, como nodo de primer nivel power-ups (antes creative-lab/power-ups).
- 2026-10-04 10:52 · Cuándo cae: Ataque avisa (KF.ataque.alDestruirEscolta) cuando la amarilla y sus dos rojas de escolta son destruidas las tres mientras están fuera de la formación (saliendo, en picado o volviendo), por disparo o por choque; la cápsula sale donde cae la última. Una nave que ya ha vuelto a su hueco no cuenta, y una amarilla con una sola roja de escolta no suelta nada.
- 2026-10-04 10:52 · [replaced by 2026-10-04 11:24] Cápsula: de 5×7 píxeles, parpadea entre azul y rosa cada 0,15 segundos y cae a la velocidad de las bombas (que sube con la oleada). Se recoge al tocar la nave del jugador; si no, sale por abajo.
- 2026-10-04 10:52 · Poderes: acelerado, hasta tres disparos en pantalla; profundo, el disparo no se detiene y destruye todas las naves que toca; bomba, el disparo es un rombo naranja que al dar en una nave explota y destruye las naves total o parcialmente dentro de un círculo de 55 píxeles de diámetro (5 anchos de nave), con una onda que se abre; aniquilación, el siguiente disparo no lanza proyectil, destruye todas las naves vivas (en formación y en picado) y el poder se acaba; slow fire, el disparo sube a 150 píxeles por segundo en lugar de 300; triple, tres proyectiles paralelos separados 6 píxeles que cuentan como un solo disparo (no se vuelve a disparar hasta que desaparecen los tres).
- 2026-10-04 10:52 · Las naves destruidas por la bomba, la aniquilación o el disparo profundo dan sus puntos, como cualquier disparo.
- 2026-10-04 10:52 · Fin del poder: se pierde al explotar la nave del jugador y al empezar cada oleada o partida (formación nueva), junto con las cápsulas que estén cayendo.
- 2026-10-04 11:24 · Cápsula: de 5×7 píxeles, parpadea entre azul y rosa cada 0,15 segundos y cae a la mitad de la velocidad de las bombas (55 píxeles por segundo en la primera oleada, y sube con ella como las bombas). Se recoge al tocar la nave del jugador; si no, sale por abajo.
- 2026-10-04 11:24 · Puerta trasera para probar los poderes, solo con teclado: con la nave en juego, Mayúsculas+1…6 da el poder de ese número (1 disparo acelerado, 2 profundo, 3 bomba, 4 aniquilación, 5 slow fire, 6 triple), como si se hubiera recogido una cápsula. No se usa Ctrl+1…6 porque Chrome lo reserva para cambiar de pestaña.

## Requirements
- 2026-10-04 10:46 · idea: Al destruir en picado una amarilla con sus dos rojas de escolta, cae un power-up aleatorio como si fuese una bomba (una cápsula que parpadea, igual para todos y con la misma probabilidad; no da puntos); si el jugador lo recoge, obtiene ese poder hasta acabar la oleada. Posibles: disparo acelerado (hasta tres disparos activos en lugar de uno), disparo profundo (el disparo atraviesa y destruye todas las naves de su recorrido), bomba (al chocar con una nave explota y destruye las naves total o parcialmente dentro de un círculo de cinco anchos de nave), aniquilación (al disparar se destruyen todas las naves enemigas), slow fire (power-down: el disparo va a la mitad de velocidad) y disparo triple (tres proyectiles paralelos).
- 2026-10-04 10:46 · Obtener unos 'power up' aleatorios cuando se destruye a una formación de nave amarilla +  dos rojas. Una vez destruidas, el boost cae (como si fuese una bomba), si se recoje, se obtiene el nuevo poder hasta finalizar la oleada.
- 2026-10-04 10:46 · Disparo acelerado: Poder tener hasta tres disparos 'activos' en lugar de solo uno
- 2026-10-04 10:46 · Disparo  profundo: El disparo no se elimina al chocar con una nave, continua su curso destruyendo todas las naves en su recorrido
- 2026-10-04 10:46 · Bomba: En lugar de un disparo, una bomba que cuando choca con una nave enemiga, genera una explosión destruyendo todas las naves que estén total o parcialmente en un círculo del ancho de una nave * 5
- 2026-10-04 10:46 · Aniquilación: Al disparar, se destruyen todas las naves enemigas
- 2026-10-04 10:46 · Slow fire: El disparo del jugador va a la mitad de velocidad (esto sería un power-down)
- 2026-10-04 10:46 · Disparo triple: Al disparar, en lugar de salir un proyectil, se disparan tres proyectiles paralelos
- 2026-10-04 10:48 · answer: ¿cuándo cae el power-up? → Solo cuando se destruyen las tres naves cuando caen en picado
- 2026-10-04 10:48 · answer: ¿aniquilación dura toda la oleada? → Un solo uso de la aniquilación, a fin de cuentas, el power-up se acaba al acabar la oleada
- 2026-10-04 10:48 · answer: ¿se acumulan los poderes? → Sustituyen
- 2026-10-04 10:48 · answer: ¿se distingue el power-down antes de recogerlo? → No, es la gracia ya que te puede tocar un power-down
- 2026-10-04 10:49 · answer: ¿se pierde el power-up si te destruyen la nave? → si
- 2026-10-04 10:50 · answer: ¿misma probabilidad para todos los poderes? → Misma probabilidad, una fiesta del azar :-)
- 2026-10-04 10:50 · answer: ¿cápsula que parpadea, igual para todos? → Sí
- 2026-10-04 10:50 · answer: ¿el disparo triple cuenta como un único disparo activo? → Sí
- 2026-10-04 10:50 · answer: ¿recogerlo da puntos? → No
- 2026-10-04 10:50 · ejecuta la tarea y publica
- 2026-10-04 11:23 · Que el Power-up caiga a un 50% de la velocidad actual.
- 2026-10-04 11:23 · Para poder probar los power-up (tampoco son fáciles de conseguir, está bien equilibrado), poderlos activar por una puerta trasera: Crtrl+1 (primer poder), Ctrl+2 (segundo) .....
- 2026-10-04 11:23 · Solo funcionará con teclado, per me sirve para validar la operativa de cada power up
- 2026-10-04 11:24 · answer: ¿Ctrl+1…6 o Mayúsculas+1…6, ya que Chrome reserva Ctrl+número? → Ok, mayúsculas
