---
title: Power-ups
status: idea
depends_on: [creative-lab]
threads:
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
---
## Summary
Idea en debate: al destruir en pleno picado una amarilla y sus dos rojas de escolta, cae un power-up aleatorio como si fuese una bomba; si el jugador lo recoge, tiene ese poder hasta acabar la oleada. Un poder nuevo sustituye al anterior. Entre ellos hay un power-down (slow fire) que no se distingue de los demás antes de recogerlo: es parte de la gracia.

## Decisions
- 2026-10-04 10:48 · Creada en el laboratorio como idea.
- 2026-10-04 10:48 · Solo cae el power-up cuando se destruyen las tres naves (amarilla y sus dos rojas) mientras están en picado.
- 2026-10-04 10:48 · Aniquilación es de un solo uso: el siguiente disparo destruye todas las naves enemigas y el poder se acaba. El resto de poderes dura hasta acabar la oleada.
- 2026-10-04 10:48 · Los poderes no se acumulan: el nuevo sustituye al anterior.
- 2026-10-04 10:48 · El power-down no se distingue en pantalla de los power-ups antes de recogerlo.

## Requirements
- 2026-10-04 10:46 · idea: Al destruir en picado una amarilla con sus dos rojas de escolta, cae un power-up aleatorio como si fuese una bomba; si el jugador lo recoge, obtiene ese poder hasta acabar la oleada. Posibles: disparo acelerado (hasta tres disparos activos en lugar de uno), disparo profundo (el disparo atraviesa y destruye todas las naves de su recorrido), bomba (al chocar con una nave explota y destruye las naves total o parcialmente dentro de un círculo de cinco anchos de nave), aniquilación (al disparar se destruyen todas las naves enemigas), slow fire (power-down: el disparo va a la mitad de velocidad) y disparo triple (tres proyectiles paralelos).
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
