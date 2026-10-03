---
title: Ataque
depends_on: [enemigos, enemigos/formacion, jugador]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Ataques en picado | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFJ5MweEGxxYP7n8Day6kv9
---
## Summary
Los ataques en picado: una nave (o una amarilla con su escolta de rojas) deja la formación con una pequeña parábola, gira, baja hacia el jugador soltando bombas y, si no choca, sale por abajo, reaparece arriba y vuelve a su sitio. Empiezan uno o dos ataques a la vez y son más con cada oleada.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:40 · El borde del § 6 es el inferior: la nave en picado que sale por abajo reaparece por arriba y vuelve a su hueco en la formación.
- 2026-10-03 18:40 · Ritmo de ataques: uno o dos ataques a la vez al principio, y más con cada oleada.
- 2026-10-03 18:40 · Orden: este nodo se implementa después de enemigos/formacion y jugador, que siguen en borrador sin código; hasta entonces sigue como draft.

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 4: ataques aleatorios en picado con trayectoria suavemente irregular hacia el jugador, soltando bombas que conservan la inercia horizontal de la nave; máximo de bombas: azul 2, lila 3, roja y amarilla 4.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 5: la amarilla ataca escoltada por dos rojas (o una si no quedan más) que van en paralelo debajo de ella como escudo.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 6: una nave en picado que llega al borde de la pantalla reaparece por arriba y vuelve a su posición en la formación.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 7: al salir, pequeña parábola ascendente durante la que la nave gira 180°, y luego se orienta (cañones) hacia la nave del jugador.
- 2026-10-03 18:22 · draft: Implementar los ataques en picado según sources/KillerFlies.txt §§ 4 a 7, con las capturas sources/KF1.JPG (amarilla con escolta) y sources/KF2.JPG (lila con bombas) como referencia.
- 2026-10-03 18:40 · 1.A (§ 6: borde inferior; sale por abajo, reaparece arriba y vuelve a su sitio)
- 2026-10-03 18:40 · 2.A (empezar con uno o dos ataques a la vez y aumentar con cada oleada)
- 2026-10-03 18:40 · 3.A (hacer antes Formación y Jugador, cada uno en su hilo, y retomar este después)
