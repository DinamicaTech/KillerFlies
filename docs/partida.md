---
title: Partida
depends_on: [jugador, enemigos]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
El ciclo de la partida: pantalla de inicio, sucesión de oleadas cada vez más rápidas, pérdida de naves del jugador y fin de partida.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · Cuando todas las naves enemigas hayan sido destruidas, se iniciará una nueva oleada con una velocidad de movimiento incrementada en un 5%.
- 2026-10-03 18:13 · Si alguna nave alienígena o una bomba choca contra la nave del jugador, esta explota. Tiene dos naves de recambio (que aparecen pequeñitas a la derecha abajo del todo) que irá perdiendo cada vez que sea destruido. Cuando la última nave del jugador sea destruido, mensaje 'GAME OVER'
- 2026-10-03 18:13 · Al inicio de la partida, aparece un texto 'START GAME' grande en medio de la pantalla. Pulsando cualquier tecla, comienza la partida.
- 2026-10-03 18:22 · draft: Implementar el ciclo de la partida: pantalla 'START GAME' que empieza con cualquier tecla, oleadas sucesivas con un 5% más de velocidad cada una, tres naves del jugador (una en juego y dos de recambio) y mensaje 'GAME OVER' al perder la última.
- 2026-10-03 18:22 · question: ¿El +5% afecta solo al desplazamiento del bloque o también a los picados y las bombas? A) a todo (recomendado) B) solo al bloque.
- 2026-10-03 18:22 · question: Tras perder una nave, ¿la oleada sigue como estaba? A) sigue, y las naves en picado vuelven a la formación antes de que aparezca la nave de recambio (recomendado) B) se reinicia la oleada.
- 2026-10-03 18:22 · question: Tras 'GAME OVER', ¿qué pasa? A) vuelve a 'START GAME' tras unos segundos (recomendado) B) se queda hasta pulsar una tecla.
