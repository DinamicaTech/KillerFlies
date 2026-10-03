---
title: Ataque
depends_on: [enemigos, enemigos/formacion, jugador, graficos, architecture]
threads:
  - Nuevo proyecto | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Ataques en picado | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFJ5MweEGxxYP7n8Day6kv9
---
## Summary
Los ataques en picado: una nave (o una amarilla con su escolta de rojas) deja la formación con una pequeña parábola, gira, baja hacia el jugador soltando bombas y, si no choca, sale por abajo, reaparece arriba y vuelve a su sitio. Empiezan uno o dos ataques a la vez y son más con cada oleada. La amarilla sale con las dos rojas de debajo (o las más próximas). Una nave en picado que choca con el jugador lo hace explotar y se destruye; el disparo del jugador también la alcanza.

## Decisions
- 2026-10-03 18:22 · Creado en la carga de requisitos inicial.
- 2026-10-03 18:40 · El borde del § 6 es el inferior: la nave en picado que sale por abajo reaparece por arriba y vuelve a su hueco en la formación.
- 2026-10-03 18:40 · Ritmo de ataques: uno o dos ataques a la vez al principio, y más con cada oleada.
- 2026-10-03 18:40 · Orden: este nodo se implementa después de enemigos/formacion y jugador, que siguen en borrador sin código; hasta entonces sigue como draft.
- 2026-10-03 19:05 · Salida: la nave deja su hueco con media vuelta hacia arriba de 12 píxeles de radio en 0,8 segundos, hacia el lado de la pantalla en que está, y gira 180° mientras la hace.
- 2026-10-03 19:05 · Picado: baja a 70 píxeles por segundo; mientras está por encima del jugador se desvía hacia él (hasta 55 píxeles por segundo en horizontal) con una oscilación suave que hace irregular la trayectoria, y orienta los cañones hacia él. Una vez pasado el jugador sigue recto.
- 2026-10-03 19:05 · Bombas: cada nave suelta al azar entre una y el máximo de su tipo (azul 2, lila 3, roja y amarilla 4), separadas al menos 0,3 segundos, solo mientras baja entre la altura 90 y 60 píxeles por encima del jugador. Caen a 110 píxeles por segundo conservando la velocidad horizontal que llevaba la nave al soltarlas.
- 2026-10-03 19:05 · Escolta: al atacar una amarilla salen con ella las dos rojas vivas en su hueco más próximas a su columna (las de debajo si están, si no las más cercanas; una si solo queda una). Hacen su propia parábola y luego bajan en paralelo debajo de ella, una a cada lado, con su orientación. Si la amarilla es destruida, siguen el picado por su cuenta.
- 2026-10-03 19:05 · Vuelta: la nave que sale por abajo reaparece arriba sobre su hueco, baja hasta él siguiendo el vaivén de la formación, se endereza en los últimos 60 píxeles y vuelve a la formación.
- 2026-10-03 19:05 · Ritmo: el primer ataque llega a los 2 segundos y luego cada 1,5 a 3 segundos (un 10% menos por oleada); a la vez caben 1 + número de oleada ataques, hasta 6 (la amarilla con su escolta cuenta como uno). Las amarillas se eligen el triple de a menudo que el resto. No empieza ningún ataque mientras la nave del jugador está explotando. Partida indicará el número de oleada (KF.ataque.oleada) y un multiplicador de velocidad del picado y las bombas (KF.ataque.factorVelocidad); de momento es la oleada 1 a velocidad normal.
- 2026-10-03 19:05 · Choques: una bomba o una nave en picado que toca la nave del jugador la hace explotar; la nave alienígena que choca se destruye, como en el arcade. El disparo del jugador también destruye las naves en picado. Los puntos quedan para Marcador y el zumbido para Sonido.
- 2026-10-03 19:05 · Código en js/ataque.js; el sprite de la bomba y el dibujo girado de las naves en js/graficos.js.
- 2026-10-03 19:02 · Validado por el owner: los ataques en picado quedan implementados y el nodo pasa a estable.

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 4: ataques aleatorios en picado con trayectoria suavemente irregular hacia el jugador, soltando bombas que conservan la inercia horizontal de la nave; máximo de bombas: azul 2, lila 3, roja y amarilla 4.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 5: la amarilla ataca escoltada por dos rojas (o una si no quedan más) que van en paralelo debajo de ella como escudo.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 6: una nave en picado que llega al borde de la pantalla reaparece por arriba y vuelve a su posición en la formación.
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 7: al salir, pequeña parábola ascendente durante la que la nave gira 180°, y luego se orienta (cañones) hacia la nave del jugador.
- 2026-10-03 18:22 · draft: Implementar los ataques en picado según sources/KillerFlies.txt §§ 4 a 7, con las capturas sources/KF1.JPG (amarilla con escolta) y sources/KF2.JPG (lila con bombas) como referencia.
- 2026-10-03 18:40 · 1.A (§ 6: borde inferior; sale por abajo, reaparece arriba y vuelve a su sitio)
- 2026-10-03 18:40 · 2.A (empezar con uno o dos ataques a la vez y aumentar con cada oleada)
- 2026-10-03 18:40 · 3.A (hacer antes Formación y Jugador, cada uno en su hilo, y retomar este después)
- 2026-10-03 18:54 · Sí, la escolta las dos naves rojas debajo, si no hay, las más próximas
