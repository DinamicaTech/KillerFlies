---
title: Multijugador
status: idea
depends_on: [partida, jugador, marcador, architecture]
threads:
  - Multijugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCdzad965rbX54ikJ7MVK26
---
## Summary
Idea en debate: dos jugadores a la vez, en la misma partida, cada uno con su terminal (en línea). La comunicación es suficientemente rápida: conexión directa entre navegadores (WebRTC), un terminal anfitrión que manda en los enemigos, y la nave del otro se muestra con un retraso de unas centésimas que no se nota a la velocidad de este juego. Quedan abiertas las preguntas de su Requirements.
Formas posibles, de menos a más coste: por turnos en el mismo dispositivo (como el Galaxian original, cada jugador con su marcador y se alternan al perder una nave); cooperativo con dos naves a la vez en la misma pantalla (difícil de controlar en el móvil y obliga a cambiar jugador, ataque y power-ups); o en línea, cada jugador en su dispositivo (necesita un servidor o un servicio externo, y rompe la decisión de arquitectura de no tener servidor, porque GitHub Pages solo sirve ficheros estáticos).

## Decisions
- 2026-10-04 12:06 · Creada en el laboratorio como idea.
- 2026-10-04 12:09 · Forma preferida: en línea, cada jugador en su dispositivo.
- 2026-10-05 10:07 · Dos jugadores a la vez en la misma partida, cada uno con su terminal.
- 2026-10-05 10:07 · Viabilidad de la comunicación: sí es posible. Con conexión directa entre navegadores (WebRTC) un mensaje tarda unos 5 a 20 ms en la misma red y unos 30 a 100 ms por internet. Un terminal hace de anfitrión y decide los enemigos, las bombas y los impactos; cada terminal envía 30 a 60 veces por segundo solo la posición y los disparos de su nave, y la nave del otro se dibuja suavizada. Galaxian es lento comparado con ese retraso, así que el juego fluye. Riesgo: en algunas redes (sobre todo datos móviles) la conexión directa falla y hace falta un servidor de reenvío (TURN), que añade algo de retraso y puede tener coste. Recomendación: comprobarlo con un prototipo pequeño antes de decidir.

## Requirements
- 2026-10-04 12:00 · idea: Opción de juego multijugador en Killer Flies.
- 2026-10-04 12:09 · Lo ideal sería en línea.
- 2026-10-04 12:09 · question: Modo de juego en línea: A) cooperativo, todos en la misma partida contra la misma formación; B) competitivo, cada uno su partida con las mismas oleadas y gana quien hace más puntos; C) versus, los jugadores pueden dañarse. Recomendado A, el más fiel al espíritu del juego.
- 2026-10-04 12:09 · [answered 2026-10-05 10:07] question: Número de jugadores por partida: A) 2; B) hasta 4. Recomendado A: con más naves la pantalla de 224 píxeles se queda pequeña.
- 2026-10-04 12:09 · question: Cómo se juntan los jugadores: A) uno crea una sala y comparte un enlace o código con su amigo; B) emparejamiento automático con desconocidos; C) ambos. Recomendado A, no necesita lista de jugadores ni moderación.
- 2026-10-04 12:09 · question: Conexión: A) directa entre navegadores (WebRTC) con un servicio gratuito externo solo para presentarse; B) servicio en tiempo real de terceros (por ejemplo Firebase); C) servidor propio. Recomendado A: el juego sigue en GitHub Pages y casi no hay infraestructura. Cualquiera de ellas cambia la decisión de arquitectura de no tener servidor.
- 2026-10-04 12:09 · question: Identidad de los jugadores: A) sin cuentas, cada uno escribe un nombre corto al entrar; B) sin nombre, Jugador 1 y Jugador 2; C) cuentas con registro. Recomendado A.
- 2026-10-04 12:09 · question: Vidas y puntos en cooperativo: A) cada jugador tiene sus 3 naves y su marcador, y la partida acaba cuando no le quedan naves a nadie; B) naves y puntos compartidos. Recomendado A.
- 2026-10-04 12:09 · question: Power-ups en cooperativo: A) el poder es solo para quien recoge la cápsula; B) se aplica a todos. Recomendado A.
- 2026-10-04 12:09 · question: Si un jugador se desconecta: A) el otro sigue solo; B) se pausa y se espera un tiempo a que vuelva; C) se acaba la partida. Recomendado B, con A si no vuelve en 30 segundos.
- 2026-10-04 12:09 · question: Récords: A) siguen siendo locales de cada navegador, separados para partidas en línea; B) tabla de récords en línea compartida por todos. Recomendado A: B necesita guardar datos en un servidor.
- 2026-10-04 12:09 · question: Juego cruzado móvil y ordenador: A) se puede jugar uno con el móvil y otro con el ordenador; B) solo entre dispositivos del mismo tipo. Recomendado A, ya que el juego funciona igual en ambos.
- 2026-10-04 12:09 · question: Coste del servicio en línea: A) tiene que caber en un plan gratuito; B) se acepta un pequeño coste mensual. Recomendado A, suficiente para partidas entre amigos.
- 2026-10-05 10:07 · La idea sería jugar dos jugadores de forma simultánea, cada uno con su terminal.
- 2026-10-05 10:07 · answer: número de jugadores → 2, de forma simultánea, cada uno con su terminal.
