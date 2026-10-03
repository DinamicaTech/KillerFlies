---
title: Marcador
depends_on: [enemigos, partida, architecture, jugador]
status: draft
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Marcador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiEmsD9WvmtQFinsch84vnYn
---
## Summary
La información en pantalla: oleada actual y máxima arriba a la izquierda, puntos y récord arriba a la derecha, y las naves de recambio abajo a la derecha. Los récords se guardan en el navegador en cuanto se superan. Muestra los valores que le da Partida (oleada, naves de recambio, inicio de partida); mientras Partida no exista se ve siempre la oleada 1 y dos naves de recambio.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 19:10 · Formato: arriba a la izquierda "oleada/oleada máxima" (p. ej. "1/3") y arriba a la derecha "puntos/puntos máximos" (p. ej. "350/1230"), a 4 píxeles del borde, en blanco con una fuente pixel-art de 5×7 dibujada por código (solo cifras y la barra).
- 2026-10-03 19:10 · Naves de recambio: se dibujan abajo a la derecha, pegadas al borde inferior bajo la franja de la nave del jugador, con el mismo dibujo que la nave del jugador; Gráficos podrá darles un dibujo más pequeño.
- 2026-10-03 19:10 · Récords: la oleada máxima y los puntos máximos se guardan en el almacenamiento local del navegador en cuanto se superan, así que no se pierden si se cierra la pestaña a media partida. Si el navegador no deja guardar, duran solo mientras la página está abierta.
- 2026-10-03 19:10 · Reparto con Partida: Partida dice al marcador la oleada en curso, las naves de recambio que quedan y cuándo empieza una partida (los puntos vuelven a cero); el marcador solo los muestra y actualiza los récords. Hasta que Partida exista: oleada 1 y dos naves de recambio fijas.
- 2026-10-03 19:10 · Código en js/marcador.js (KF.marcador: sumarPuntos, reiniciarPuntos, ponerOleada, ponerRecambio), que se dibuja encima de todo lo demás.

## Requirements
- 2026-10-03 18:13 · En la parte superior izquierda se mostrará el número de oleada + "/" + número de oleada máxima conseguida por ese jugador. En la parte superior derecha, se mostrarán los puntos conseguidos + "/" + puntos máximos conseguidos por ese jugador.
- 2026-10-03 18:13 · Tiene dos naves de recambio (que aparecen pequeñitas a la derecha abajo del todo)
- 2026-10-03 18:22 · Derived from enemigos: sumar los puntos de cada nave destruida (azul 10, lila 20, roja 30, amarilla 50).
- 2026-10-03 18:22 · draft: Implementar el marcador: oleada/oleada máxima arriba a la izquierda, puntos/puntos máximos arriba a la derecha, naves de recambio pequeñas abajo a la derecha, y guardar los máximos en el navegador.
- 2026-10-03 19:10 · Derived from enemigos: sumar también los puntos de la nave que choca contra el jugador; cada nave destruida se avisa con KF.enemigos.alDestruir.
