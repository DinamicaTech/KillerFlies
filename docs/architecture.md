---
title: Arquitectura
depends_on: [jugador, partida, sonido]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Formación enemiga | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Publicar el juego | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi7f7vB8ExRUNtPFeuee9tYu
  - Controles táctiles | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiXH1tXPjNtyfwDxWQKAi9AZ
---
## Summary
Decisiones técnicas que condicionan todo el juego: se juega en el navegador, en JavaScript sin compilación, con gráficos y sonidos generados por código, récords guardados en el navegador, controles de teclado o de pantalla táctil (deslizar el dedo y pulsación corta) y publicado en GitHub Pages (https://dinamicatech.github.io/KillerFlies/), aunque sigue funcionando abriendo index.html en local. La base común del juego (index.html, pantalla, bucle de juego, teclado y pantalla táctil) está en js/base.js.

## Decisions
- 2026-10-03 18:20 · Plataforma: navegador web, dibujando sobre un HTML5 Canvas. Motivo: funciona en cualquier equipo sin instalar nada y basta para un arcade 2D.
- 2026-10-03 18:20 · Lenguaje: JavaScript sin paso de compilación ni dependencias; se juega abriendo `index.html` con doble clic. Motivo: la forma más simple de ejecutarlo y mantenerlo. Por eso el código va en scripts clásicos (no módulos ES), que funcionan abriendo el fichero desde el disco.
- 2026-10-03 18:20 · Récords (oleada máxima y puntos máximos): se guardan en el almacenamiento local del navegador (localStorage); un jugador por navegador, sin nombres ni servidor. Motivo: cubre el "por ese jugador" de los requisitos sin infraestructura.
- 2026-10-03 18:20 · Gráficos y sonido: sprites pixel-art definidos en el código y efectos de sonido sintetizados con Web Audio; sin ficheros de imagen ni de sonido. Motivo: nada que cargar ni licenciar, y el estilo arcade se reproduce bien así.
- 2026-10-03 18:20 · [replaced by 2026-10-03 19:30] Despliegue: solo local, sin publicación en la web.
- 2026-10-03 18:20 · [replaced by 2026-10-04 10:16] Controles: solo teclado, como piden los requisitos.
- 2026-10-03 18:44 · [replaced by 2026-10-04 10:16] Base del juego: index.html carga scripts clásicos de js/ que comparten el objeto global KF. js/base.js crea la pantalla lógica de 224×288 escalada a la ventana, guarda las teclas pulsadas en KF.teclas y ejecuta el bucle de juego; cada parte del juego se añade con KF.registrar({ actualizar(dt), dibujar(ctx) }) y se ejecuta en el orden de registro.
- 2026-10-03 19:30 · Despliegue: el juego se publica en GitHub Pages desde la raíz de la rama main y se juega en https://dinamicatech.github.io/KillerFlies/; cualquiera con el enlace puede jugar y los récords se guardan en el navegador de cada jugador. También sigue funcionando abriendo index.html en local. Motivo: el dueño quiere dar acceso al juego desde un enlace.
- 2026-10-04 10:16 · Controles: teclado o pantalla táctil, para poder jugar en un smartphone. Con el teclado, flechas y espacio (Jugador). En la pantalla táctil se toca en cualquier parte: deslizar el dedo mueve la nave y una pulsación corta (tocar y soltar en menos de 0,25 segundos, moviendo el dedo menos de 10 píxeles reales) dispara, empieza la partida en 'START GAME' y sale de 'GAME OVER'. Cada dedo cuenta por separado, así que se puede mover con uno y disparar con otro. La página no hace zoom, ni se desplaza ni selecciona texto al tocarla.
- 2026-10-04 10:16 · Base del juego: index.html carga scripts clásicos de js/ que comparten el objeto global KF. js/base.js crea la pantalla lógica de 224×288 escalada a la ventana, guarda las teclas pulsadas en KF.teclas, lee la pantalla táctil y ejecuta el bucle de juego; cada parte del juego se añade con KF.registrar({ actualizar(dt), dibujar(ctx) }) y se ejecuta en el orden de registro. De la pantalla táctil da KF.tactil.dx (desplazamiento horizontal del dedo en píxeles de la pantalla lógica, pendiente de aplicar), KF.tactil.disparar (se ha hecho una pulsación corta) y KF.alPulsarCorto(funcion), que llama a esa función con cada pulsación corta.

## Requirements
- 2026-10-03 18:19 · Q1. A (plataforma: navegador web, HTML5 Canvas)
- 2026-10-03 18:19 · Q2. A (JavaScript sin compilación, se abre index.html)
- 2026-10-03 18:19 · Q3. A (récords guardados en el navegador, un jugador por navegador)
- 2026-10-03 18:19 · Q4. A (sprites y sonidos generados por código)
- 2026-10-03 18:19 · Q5. A (solo local)
- 2026-10-03 18:19 · Q6. A (solo teclado)
- 2026-10-03 18:44 · Derived from enemigos/formacion: proporcionar la base del juego: index.html, pantalla, bucle de juego y lectura del teclado.
- 2026-10-03 19:28 · Puedes subir el proyecto a GitHub y marcarlo como no borrador y dar acceso al index.html ?
- 2026-10-04 10:12 · Hacer compatibles los controles con un smartphone. Deslizar con el dedo para mover, pulsación corta para disparar. Pulsación corta para poder iniciar la partida.
