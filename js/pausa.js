// Pausa de la partida: la tecla P o el botón II de arriba (en pantallas
// táctiles) la paran y la reanudan; en pausa, cualquier pulsación corta
// reanuda, sin disparar. Se pausa sola al ocultarse la pestaña (cambio de
// pestaña, ventana minimizada o móvil bloqueado) y nunca se reanuda sola.
// Mientras dura, todo se congela (KF.detenido), el sonido se calla y se ve
// 'PAUSED' en el centro, con dos opciones debajo: CONTINUE (marcada) y
// RESTART, que empieza una partida nueva en la oleada 1. Las flechas arriba y
// abajo cambian de opción y Enter o espacio la eligen; P reanuda siempre. En
// la pantalla táctil, tocar una opción la elige y tocar en otro sitio elige
// la marcada. Al reanudar, la posición del móvil vuelve a ser el centro de la
// inclinación.
// En la partida a dos la pausa es de los dos: cada mensaje de js/red.js
// lleva quién ha pausado (z) y un número de versión (zv) que crece con cada
// cambio, y gana el más nuevo; en empate, el del anfitrión. Solo ve y elige
// las opciones quien pausó, salvo que el otro ya no esté; RESTART empieza
// otra partida para los dos, como 'PLAY AGAIN' (js/red.js).
KF.pausa = {
  COLOR: '#ffff40',
  COLOR_BOTON: '#808080',
  ESCALA_TEXTO: 2,
  BOTON_ZONA: 16,          // píxeles a cada lado del centro y desde arriba que cuentan como tocar II
  OPCIONES: ['CONTINUE', 'RESTART'],
  SEPARACION_OPCIONES: 16, // píxeles entre una opción y la siguiente
  enPausa: true,           // se actualiza también con la partida en pausa

  activa: false,
  quien: 0,                // número del jugador que ha pausado
  version: 0,              // crece con cada cambio de pausa, para la partida a dos
  tactil: false,           // la pantalla es táctil: se ve el botón II
  opcion: 0,               // opción marcada: 0 CONTINUE, 1 RESTART
  teclaElegir: null,       // Enter o espacio pulsado en pausa, que elige al soltarlo

  // Solo se pausa jugando, y no mientras se espera al otro jugador.
  sePuede: function () {
    return !this.activa && KF.partida.estado === 'jugando' && KF.red.fase !== 'pausa';
  },

  // Reanuda quien pausó; si ya no hay partida a dos, cualquiera.
  puedeReanudar: function () {
    return this.activa && (!KF.red.activa() || this.quien === KF.jugador.numero);
  },

  pausar: function () {
    if (!this.sePuede()) return;
    this.poner(true, KF.jugador.numero, this.version + 1);
    KF.red.enviarYa();
  },

  reanudar: function () {
    if (!this.puedeReanudar()) return;
    this.poner(false, 0, this.version + 1);
    KF.red.enviarYa();
  },

  poner: function (activa, quien, version) {
    var antes = this.activa;
    if (activa && !antes) {
      this.opcion = 0;
      this.teclaElegir = null;
    }
    this.activa = activa;
    this.quien = quien;
    this.version = version;
    if (antes && !activa) {
      // Lo que se haya tocado o deslizado durante la pausa no cuenta, y el
      // móvil se coge ahora como se tenga.
      KF.tactil.dx = 0;
      KF.tactil.disparar = false;
      KF.inclinacion.calibrar();
    }
    KF.sonido.ajustarSilencio();
  },

  // Partida a dos: estado de pausa recibido del otro dispositivo.
  recibir: function (quien, version, delAnfitrion) {
    if (version === undefined) return;
    if (version > this.version || (version === this.version && delAnfitrion && quien !== this.quien)) {
      this.poner(!!quien, quien, version);
    }
  },

  // RESTART: partida nueva en la oleada 1; a dos, para los dos.
  reiniciar: function () {
    if (!this.puedeReanudar()) return;
    if (KF.red.activa()) {
      KF.red.reiniciar();
      return;
    }
    this.poner(false, 0, this.version + 1);
    // El anfitrión que seguía solo empieza la nueva como partida a uno.
    if (KF.red.fase === 'solo') KF.red.cerrar();
    KF.partida.empezar();
  },

  elegir: function () {
    if (this.opcion === 1) this.reiniciar();
    else this.reanudar();
  },

  alternar: function () {
    if (this.activa) this.reanudar();
    else this.pausar();
  },

  // Fuera de la partida (o si se va el jugador que pausó) no hay pausa.
  actualizar: function () {
    if (!this.activa) return;
    var sigue = KF.partida.estado === 'jugando' && KF.red.fase !== 'error';
    if (sigue && KF.red.fase === 'solo' && this.quien !== KF.jugador.numero) sigue = false;
    if (!sigue) this.poner(false, 0, this.version + 1);
  },

  // Altura (borde superior) de la opción i, debajo de 'PAUSED'.
  alturaOpcion: function (i) {
    return (KF.ALTO - KF.graficos.FUENTE_ALTO * this.ESCALA_TEXTO) / 2 + 24 + i * this.SEPARACION_OPCIONES;
  },

  // Opción en el punto (x, y) de la pantalla lógica, o -1.
  opcionEn: function (p) {
    if (!p) return -1;
    for (var i = 0; i < this.OPCIONES.length; i++) {
      var y = this.alturaOpcion(i);
      if (p.y >= y - 5 && p.y < y + KF.graficos.FUENTE_ALTO + 5) return i;
    }
    return -1;
  },

  enBoton: function (p) {
    return p && Math.abs(p.x - KF.ANCHO / 2) <= this.BOTON_ZONA && p.y <= this.BOTON_ZONA + 4;
  },

  dibujar: function (ctx) {
    if (KF.partida.estado !== 'jugando') return;
    if (this.tactil && !this.activa) {
      ctx.fillStyle = this.COLOR_BOTON;
      ctx.fillRect(KF.ANCHO / 2 - 3, 4, 2, 7);
      ctx.fillRect(KF.ANCHO / 2 + 1, 4, 2, 7);
    }
    // Esperando al otro jugador, manda el aviso de js/red.js.
    if (!this.activa || KF.red.fase === 'pausa') return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, KF.ANCHO, KF.ALTO);
    var p = KF.partida, e = this.ESCALA_TEXTO, medio = (KF.ALTO - KF.graficos.FUENTE_ALTO * e) / 2;
    var texto = KF.red.activa() ? 'PAUSED P' + this.quien : 'PAUSED';
    p.escribirCentrado(ctx, this.LETRAS, texto, medio, e);
    if (this.puedeReanudar()) {
      for (var i = 0; i < this.OPCIONES.length; i++) {
        var letras = i === this.opcion ? this.LETRAS : this.LETRAS_AYUDA;
        p.escribirCentrado(ctx, letras, this.OPCIONES[i], this.alturaOpcion(i), 1);
      }
    }
  }
};

(function () {
  var z = KF.pausa;
  z.LETRAS = KF.graficos.crearFuente(z.COLOR);
  z.LETRAS_AYUDA = KF.graficos.crearFuente(z.COLOR_BOTON);
  z.tactil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  window.addEventListener('keydown', function (e) {
    if (e.repeat) return;
    if (e.code === 'KeyP') { z.alternar(); return; }
    if (!z.activa || !z.puedeReanudar()) return;
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      z.opcion = (z.opcion + 1) % z.OPCIONES.length;
    } else if (e.code === 'Enter' || e.code === 'Space') {
      z.teclaElegir = e.code;
    }
  });
  // Enter o espacio eligen al soltarlos, para que el espacio no dispare al
  // seguir la partida.
  window.addEventListener('keyup', function (e) {
    if (e.code !== z.teclaElegir) return;
    z.teclaElegir = null;
    KF.jugador.pulsacion = false;
    if (z.activa && z.puedeReanudar()) z.elegir();
  });
  // Tocar II pausa; en pausa, tocar una opción la elige y tocar en otro sitio
  // elige la marcada. Ninguno de los toques dispara.
  KF.alPulsarCorto(function () {
    z.tactil = true;
    if (z.activa) {
      KF.tactil.disparar = false;
      if (!z.puedeReanudar()) return;
      var i = z.opcionEn(KF.ultimoToque);
      if (i >= 0) z.opcion = i;
      z.elegir();
    } else if (KF.partida.estado === 'jugando' && z.enBoton(KF.ultimoToque)) {
      KF.tactil.disparar = false;
      z.pausar();
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) z.pausar();
  });
})();

// Después de Red, para que 'PAUSED' quede encima de todo.
KF.registrar(KF.pausa);
