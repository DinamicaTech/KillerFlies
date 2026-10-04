---
title: Multijugador
status: idea
depends_on: [partida, jugador, marcador, architecture]
threads:
  - Multijugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiCdzad965rbX54ikJ7MVK26
---
## Summary
Idea en debate: añadir una opción para jugar dos o más jugadores a Killer Flies.
El propietario prefiere la forma en línea, cada jugador en su dispositivo; quedan abiertas las preguntas de su Requirements.
Formas posibles, de menos a más coste: por turnos en el mismo dispositivo (como el Galaxian original, cada jugador con su marcador y se alternan al perder una nave); cooperativo con dos naves a la vez en la misma pantalla (difícil de controlar en el móvil y obliga a cambiar jugador, ataque y power-ups); o en línea, cada jugador en su dispositivo (necesita un servidor o un servicio externo, y rompe la decisión de arquitectura de no tener servidor, porque GitHub Pages solo sirve ficheros estáticos).

## Decisions
- 2026-10-04 12:06 · Creada en el laboratorio como idea.
- 2026-10-04 12:09 · Forma preferida: en línea, cada jugador en su dispositivo.

## Requirements
- 2026-10-04 12:00 · idea: Opción de juego multijugador en Killer Flies.
- 2026-10-04 12:09 · Lo ideal sería en línea.
- 2026-10-04 12:09 · question: Modo de juego en línea: A) cooperativo, todos en la misma partida contra la misma formación; B) competitivo, cada uno su partida con las mismas oleadas y gana quien hace más puntos; C) versus, los jugadores pueden dañarse. Recomendado A, el más fiel al espíritu del juego.
- 2026-10-04 12:09 · question: Número de jugadores por partida: A) 2; B) hasta 4. Recomendado A: con más naves la pantalla de 224 píxeles se queda pequeña.
- 2026-10-04 12:09 · question: Cómo se juntan los jugadores: A) uno crea una sala y comparte un enlace o código con su amigo; B) emparejamiento automático con desconocidos; C) ambos. Recomendado A, no necesita lista de jugadores ni moderación.
- 2026-10-04 12:09 · question: Conexión: A) directa entre navegadores (WebRTC) con un servicio gratuito externo solo para presentarse; B) servicio en tiempo real de terceros (por ejemplo Firebase); C) servidor propio. Recomendado A: el juego sigue en GitHub Pages y casi no hay infraestructura. Cualquiera de ellas cambia la decisión de arquitectura de no tener servidor.
- 2026-10-04 12:09 · question: Identidad de los jugadores: A) sin cuentas, cada uno escribe un nombre corto al entrar; B) sin nombre, Jugador 1 y Jugador 2; C) cuentas con registro. Recomendado A.
- 2026-10-04 12:09 · question: Vidas y puntos en cooperativo: A) cada jugador tiene sus 3 naves y su marcador, y la partida acaba cuando no le quedan naves a nadie; B) naves y puntos compartidos. Recomendado A.
- 2026-10-04 12:09 · question: Power-ups en cooperativo: A) el poder es solo para quien recoge la cápsula; B) se aplica a todos. Recomendado A.
- 2026-10-04 12:09 · question: Si un jugador se desconecta: A) el otro sigue solo; B) se pausa y se espera un tiempo a que vuelva; C) se acaba la partida. Recomendado B, con A si no vuelve en 30 segundos.
- 2026-10-04 12:09 · question: Récords: A) siguen siendo locales de cada navegador, separados para partidas en línea; B) tabla de récords en línea compartida por todos. Recomendado A: B necesita guardar datos en un servidor.
- 2026-10-04 12:09 · question: Juego cruzado móvil y ordenador: A) se puede jugar uno con el móvil y otro con el ordenador; B) solo entre dispositivos del mismo tipo. Recomendado A, ya que el juego funciona igual en ambos.
