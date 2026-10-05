---
title: Inercia
status: draft
depends_on: []
threads:
  - Stack de drafts en Jugador | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiQXFRhiCN6PbXHTCo4DqvzL
  - Inercia | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi8cTexby62CUgP4AmUMNEoh
---
## Summary
La nave del jugador ya no se mueve a velocidad fija: acelera hasta su velocidad máxima de 90 píxeles por segundo en 0,2 segundos y frena hasta pararse en 0,15 segundos, con las flechas y al deslizar el dedo. Implementado, pendiente de que el dueño lo valide.

## Decisions
- 2026-10-05 11:51 · Creado como draft hijo de Jugador, uno de los seis para probar el apilado de cajas de Claude Visual Project.
- 2026-10-05 12:45 · Movimiento con inercia: la nave se mueve a 90 píxeles por segundo como máximo; con una flecha pulsada acelera desde parada hasta esa velocidad en 0,2 segundos (450 píxeles por segundo cada segundo) y al soltarla frena hasta pararse en 0,15 segundos (600 píxeles por segundo cada segundo). Si se cambia de flecha, primero frena hasta pararse y luego acelera hacia el otro lado. No sale de la pantalla: al llegar al borde se para en seco. Su centro sigue a 24 píxeles del borde inferior. Al deslizar el dedo acelera igual hacia el destino que marca el dedo y empieza a frenar a tiempo para pararse justo en él, sin pasarse ni superar los 90 píxeles por segundo. Al aparecer, al explotar y al retirarse la nave queda parada. Tiempos propuestos por Claude y aceptados por el dueño, a ajustar tras probarlo. Código en js/jugador.js (KF.jugador.vx, ACELERACION, FRENADO, acercarVelocidad).

## Requirements
- 2026-10-05 11:51 · draft: Que la nave del jugador acelere y frene de forma suave en vez de moverse a velocidad fija.
