// Base del juego: pantalla, teclado, pantalla táctil y bucle de juego.
// Todo el juego vive en el objeto global KF. Cada parte del juego se registra
// con KF.registrar({ actualizar(dt), dibujar(ctx) }) y el bucle la llama en
// el orden de registro.
var KF = {
  // Pantalla lógica vertical, como el arcade; se escala a la ventana.
  ANCHO: 224,
  ALTO: 288,

  sistemas: [],
  // Teclas mantenidas pulsadas, por código (event.code), p. ej. KF.teclas.ArrowLeft.
  teclas: {},
  // Pantalla táctil: desplazamiento horizontal del dedo (en píxeles de la
  // pantalla lógica) pendiente de aplicar y disparo pedido con una pulsación
  // corta. Los recoge y los pone a cero quien los usa (Jugador).
  tactil: { dx: 0, disparar: false },
  // Funciones a llamar con cada pulsación corta (KF.alPulsarCorto).
  pulsacionesCortas: [],
  escala: 1,

  // Pulsación corta: tocar y soltar en poco tiempo casi sin mover el dedo.
  PULSACION_CORTA_SEGUNDOS: 0.25,
  PULSACION_CORTA_MOVIMIENTO: 10,   // píxeles reales de la pantalla del móvil

  registrar: function (sistema) {
    this.sistemas.push(sistema);
  },

  alPulsarCorto: function (funcion) {
    this.pulsacionesCortas.push(funcion);
  },

  iniciar: function () {
    var canvas = document.getElementById('pantalla');
    canvas.width = this.ANCHO;
    canvas.height = this.ALTO;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    var ajustar = function () {
      var escala = KF.escala = Math.min(window.innerWidth / KF.ANCHO, window.innerHeight / KF.ALTO);
      canvas.style.width = Math.floor(KF.ANCHO * escala) + 'px';
      canvas.style.height = Math.floor(KF.ALTO * escala) + 'px';
    };
    window.addEventListener('resize', ajustar);
    ajustar();

    var teclasDelJuego = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];
    window.addEventListener('keydown', function (e) {
      KF.teclas[e.code] = true;
      if (teclasDelJuego.indexOf(e.code) >= 0) e.preventDefault();
    });
    window.addEventListener('keyup', function (e) {
      KF.teclas[e.code] = false;
    });
    window.addEventListener('blur', function () {
      KF.teclas = {};
    });

    this.iniciarTactil();

    var anterior = null;
    var paso = function (ahora) {
      // dt en segundos, acotado para que una pestaña en segundo plano no provoque saltos.
      var dt = anterior === null ? 0 : Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;
      KF.paso(dt);
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  },

  // Cada dedo cuenta por separado: al deslizarlo, su desplazamiento horizontal
  // se suma a KF.tactil.dx; si se suelta pronto y casi sin moverlo, es una
  // pulsación corta. Se puede tocar en cualquier parte de la pantalla, y la
  // página no hace zoom ni se desplaza.
  iniciarTactil: function () {
    var dedos = {};
    var opciones = { passive: false };
    document.addEventListener('touchstart', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        dedos[t.identifier] = { x: t.clientX, y: t.clientY, x0: t.clientX, y0: t.clientY, inicio: performance.now() };
      }
    }, opciones);
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i], d = dedos[t.identifier];
        if (!d) continue;
        KF.tactil.dx += (t.clientX - d.x) / KF.escala;
        d.x = t.clientX;
        d.y = t.clientY;
      }
    }, opciones);
    var soltar = function (e, cancelado) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i], d = dedos[t.identifier];
        if (!d) continue;
        delete dedos[t.identifier];
        var segundos = (performance.now() - d.inicio) / 1000;
        var movimiento = Math.max(Math.abs(t.clientX - d.x0), Math.abs(t.clientY - d.y0));
        if (!cancelado && segundos < KF.PULSACION_CORTA_SEGUNDOS && movimiento < KF.PULSACION_CORTA_MOVIMIENTO) {
          KF.tactil.disparar = true;
          for (var j = 0; j < KF.pulsacionesCortas.length; j++) KF.pulsacionesCortas[j]();
        }
      }
    };
    document.addEventListener('touchend', function (e) { soltar(e, false); }, opciones);
    document.addEventListener('touchcancel', function (e) { soltar(e, true); }, opciones);
  },

  paso: function (dt) {
    var i;
    for (i = 0; i < this.sistemas.length; i++) {
      if (this.sistemas[i].actualizar) this.sistemas[i].actualizar(dt);
    }
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.ANCHO, this.ALTO);
    for (i = 0; i < this.sistemas.length; i++) {
      if (this.sistemas[i].dibujar) this.sistemas[i].dibujar(this.ctx);
    }
  }
};
