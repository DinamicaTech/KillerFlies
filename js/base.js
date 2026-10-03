// Base del juego: pantalla, teclado y bucle de juego.
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

  registrar: function (sistema) {
    this.sistemas.push(sistema);
  },

  iniciar: function () {
    var canvas = document.getElementById('pantalla');
    canvas.width = this.ANCHO;
    canvas.height = this.ALTO;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    var ajustar = function () {
      var escala = Math.min(window.innerWidth / KF.ANCHO, window.innerHeight / KF.ALTO);
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
