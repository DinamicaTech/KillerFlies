---
title: Arquitectura
depends_on: []
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
---
## Summary
Decisiones técnicas que condicionan todo el juego: se juega en el navegador, en JavaScript sin compilación, con gráficos y sonidos generados por código, récords guardados en el navegador, solo teclado y ejecución local. La base común del juego (index.html, pantalla, bucle de juego y teclado) está en js/base.js.

## Decisions
- 2026-10-03 18:20 · Plataforma: navegador web, dibujando sobre un HTML5 Canvas. Motivo: funciona en cualquier equipo sin instalar nada y basta para un arcade 2D.
- 2026-10-03 18:20 · Lenguaje: JavaScript sin paso de compilación ni dependencias; se juega abriendo `index.html` con doble clic. Motivo: la forma más simple de ejecutarlo y mantenerlo. Por eso el código va en scripts clásicos (no módulos ES), que funcionan abriendo el fichero desde el disco.
- 2026-10-03 18:20 · Récords (oleada máxima y puntos máximos): se guardan en el almacenamiento local del navegador (localStorage); un jugador por navegador, sin nombres ni servidor. Motivo: cubre el "por ese jugador" de los requisitos sin infraestructura.
- 2026-10-03 18:20 · Gráficos y sonido: sprites pixel-art definidos en el código y efectos de sonido sintetizados con Web Audio; sin ficheros de imagen ni de sonido. Motivo: nada que cargar ni licenciar, y el estilo arcade se reproduce bien así.
- 2026-10-03 18:20 · Despliegue: solo local, sin publicación en la web.
- 2026-10-03 18:20 · Controles: solo teclado, como piden los requisitos.
- 2026-10-03 18:44 · Base del juego: index.html carga scripts clásicos de js/ que comparten el objeto global KF. js/base.js crea la pantalla lógica de 224×288 escalada a la ventana, guarda las teclas pulsadas en KF.teclas y ejecuta el bucle de juego; cada parte del juego se añade con KF.registrar({ actualizar(dt), dibujar(ctx) }) y se ejecuta en el orden de registro.

## Requirements
- 2026-10-03 18:19 · Q1. A (plataforma: navegador web, HTML5 Canvas)
- 2026-10-03 18:19 · Q2. A (JavaScript sin compilación, se abre index.html)
- 2026-10-03 18:19 · Q3. A (récords guardados en el navegador, un jugador por navegador)
- 2026-10-03 18:19 · Q4. A (sprites y sonidos generados por código)
- 2026-10-03 18:19 · Q5. A (solo local)
- 2026-10-03 18:19 · Q6. A (solo teclado)
- 2026-10-03 18:44 · Derived from enemigos/formacion: proporcionar la base del juego: index.html, pantalla, bucle de juego y lectura del teclado.
