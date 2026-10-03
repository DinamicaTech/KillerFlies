---
title: Ataque
depends_on: [enemigos, enemigos/formacion, jugador]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
---
## Summary
Los ataques en picado: una nave (o una amarilla con su escolta de rojas) deja la formación con una pequeña parábola, gira, baja hacia el jugador soltando bombas y, si no choca, reaparece arriba y vuelve a su sitio.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 4: ataques aleatorios en picado con trayectoria suavemente irregular hacia el jugador, soltando bombas que conservan la inercia horizontal de la nave; máximo de bombas: azul 2, lila 3, roja y amarilla 4.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 5: la amarilla ataca escoltada por dos rojas (o una si no quedan más) que van en paralelo debajo de ella como escudo.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 6: una nave en picado que llega al borde de la pantalla reaparece por arriba y vuelve a su posición en la formación.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 7: al salir, pequeña parábola ascendente durante la que la nave gira 180°, y luego se orienta (cañones) hacia la nave del jugador.
- 2026-10-03 18:22 · draft: Implementar los ataques en picado según sources/KillerFlies.txt §§ 4 a 7, con las capturas sources/KF1.JPG (amarilla con escolta) y sources/KF2.JPG (lila con bombas) como referencia.
- 2026-10-03 18:22 · question: § 6 dice "llegue a la parte superior de la pantalla"; ¿quiere decir la inferior? A) inferior: sale por abajo, reaparece arriba y vuelve a su sitio (recomendado) B) superior, tal cual.
- 2026-10-03 18:22 · question: ¿Cuántos ataques a la vez y con qué frecuencia? A) empezar con uno o dos a la vez y aumentar con cada oleada (recomendado) B) un ritmo fijo.
