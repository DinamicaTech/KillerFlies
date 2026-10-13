// Pausa de la partida: la tecla P o el botón II de arriba (en pantallas
// táctiles) la paran y la reanudan; en pausa, cualquier pulsación corta
// reanuda, sin disparar. Se pausa sola al ocultarse la pestaña (cambio de
// pestaña, ventana minimizada o móvil bloqueado) y nunca se reanuda sola.
// Mientras dura, todo se congela (KF.detenido), el sonido se calla y se ve
// 'PAUSA' en el centro. Al reanudar, la posición del móvil vuelve a ser el
// centro de la inclinación.
// En la partida a dos la pausa es de los dos: cada mensaje de js/red.js
// lleva quién ha pausado (z) y un número de versión (zv) que crece con cada
// cambio, y gana el más nuevo; en empate, el del anfitrión. Solo reanuda
// quien pausó, salvo que el otro ya no esté.
KF.pausa = {
  COLOR: '#ffff40',
  COLOR_BOTON: '#808080',
  ESCALA_TEXTO: 2,
  BOTON_ZONA: 16,          // píxeles a cada lado del centro y desde arriba que cuentan como tocar II
  enPausa: true,           // se actualiza también con la partida en pausa

  activa: false,
  quien: 0,                // número del jugador que ha pausado
  version: 0,              // crece con cada cambio de pausa, para la partida a dos
  tactil: false,           // la pantalla es táctil: se ve el botón II

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
    var texto = KF.red.activa() ? 'PAUSA J' + this.quien : 'PAUSA';
    p.escribirCentrado(ctx, this.LETRAS, texto, medio, e);
    if (this.puedeReanudar()) {
      p.escribirCentrado(ctx, this.LETRAS_AYUDA, this.tactil ? 'P O TOCA PARA SEGUIR' : 'P PARA SEGUIR', medio + 24, 1);
    }
  }
};

(function () {
  var z = KF.pausa;
  z.LETRAS = KF.graficos.crearFuente(z.COLOR);
  z.LETRAS_AYUDA = KF.graficos.crearFuente(z.COLOR_BOTON);
  z.tactil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  window.addEventListener('keydown', function (e) {
    if (e.code === 'KeyP' && !e.repeat) z.alternar();
  });
  // Tocar II pausa; en pausa, cualquier toque reanuda. Ninguno de los dos dispara.
  KF.alPulsarCorto(function () {
    z.tactil = true;
    if (z.activa) {
      KF.tactil.disparar = false;
      z.reanudar();
    } else if (KF.partida.estado === 'jugando' && z.enBoton(KF.ultimoToque)) {
      KF.tactil.disparar = false;
      z.pausar();
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) z.pausar();
  });
})();

// Después de Red, para que 'PAUSA' quede encima de todo.
KF.registrar(KF.pausa);
