// El ciclo de la partida: pantalla 'START GAME' que espera cualquier tecla
// (o una pulsación corta en la pantalla táctil),
// oleadas sucesivas un 5% más rápidas cada una (bloque, picados y bombas),
// tres naves del jugador (una en juego y dos de recambio) y 'GAME OVER' al
// perder la última, que se queda hasta que se pulsa una tecla.
KF.partida = {
  NAVES_RECAMBIO: 2,       // naves de recambio al empezar la partida
  AUMENTO_OLEADA: 1.05,    // cada oleada va un 5% más rápida que la anterior
  ESPERA_OLEADA: 2,        // segundos entre destruir la última nave y la oleada siguiente
  ESPERA_RECAMBIO: 2,      // segundos mínimos entre explotar y salir la nave de recambio
  ESPERA_FIN: 1,           // segundos de 'GAME OVER' antes de atender las teclas,
                           // para no saltarlo sin querer al disparar
  ESCALA_TEXTO: 2,         // los mensajes, al doble del tamaño de la fuente
  COLOR_INICIO: '#ffff40',
  COLOR_FIN: '#f02828',

  estado: 'inicio',        // 'inicio' | 'jugando' | 'fin'
  oleada: 1,
  recambio: 0,             // naves de recambio que quedan
  esperaOleada: 0,         // segundos desde que se destruyó la última nave
  tiempoFin: 0,            // segundos desde 'GAME OVER'

  // Pantalla de inicio: la formación de la primera oleada se mueve detrás
  // del texto, sin ataques porque la nave del jugador no está.
  irAInicio: function () {
    this.estado = 'inicio';
    KF.jugador.retirar();
    this.ponerOleada(1);
  },

  empezar: function () {
    this.estado = 'jugando';
    this.recambio = this.NAVES_RECAMBIO;
    KF.marcador.reiniciarPuntos();
    KF.marcador.ponerRecambio(this.recambio);
    this.ponerOleada(1);
    KF.jugador.aparecer();
  },

  // Formación nueva con la velocidad de la oleada n; Ataque deja atrás los
  // ataques de la anterior al ver la formación nueva.
  ponerOleada: function (n) {
    var factor = Math.pow(this.AUMENTO_OLEADA, n - 1);
    this.oleada = n;
    this.esperaOleada = 0;
    KF.formacion.reiniciar(KF.formacion.VELOCIDAD_INICIAL * factor);
    KF.ataque.oleada = n;
    KF.ataque.factorVelocidad = factor;
    KF.marcador.ponerOleada(n);
  },

  quedanNaves: function () {
    var naves = KF.formacion.naves;
    for (var i = 0; i < naves.length; i++) {
      if (naves[i].viva) return true;
    }
    return false;
  },

  actualizar: function (dt) {
    if (this.estado === 'fin') this.tiempoFin += dt;
    if (this.estado !== 'jugando') return;
    var j = KF.jugador;

    // Nave perdida: tras la explosión, si quedan de recambio sale una cuando
    // las naves en picado han vuelto a la formación y no quedan bombas.
    if (j.estado === 'explotando' && j.tiempoExplosion >= this.ESPERA_RECAMBIO) {
      if (this.recambio === 0) {
        this.estado = 'fin';
        this.tiempoFin = 0;
        j.retirar();
        return;
      }
      if (!KF.ataque.atacantes.length && !KF.ataque.bombas.length) {
        this.recambio--;
        KF.marcador.ponerRecambio(this.recambio);
        j.aparecer();
        KF.ataque.tregua();
      }
    }

    // Oleada destruida: la siguiente llega poco después, con la nave en juego.
    if (j.estado === 'viva' && !this.quedanNaves()) {
      this.esperaOleada += dt;
      if (this.esperaOleada >= this.ESPERA_OLEADA) this.ponerOleada(this.oleada + 1);
    }
  },

  // Cualquier tecla o pulsación corta empieza la partida en la pantalla de inicio y vuelve a
  // ella desde 'GAME OVER'.
  pulsar: function () {
    if (this.estado === 'inicio') this.empezar();
    else if (this.estado === 'fin' && this.tiempoFin >= this.ESPERA_FIN) this.irAInicio();
  },

  escribirCentrado: function (ctx, letras, texto) {
    var g = KF.graficos, e = this.ESCALA_TEXTO;
    var x = (KF.ANCHO - g.anchoTexto(texto, e)) / 2;
    var y = (KF.ALTO - g.FUENTE_ALTO * e) / 2;
    g.escribir(ctx, letras, texto, x, y, e);
  },

  dibujar: function (ctx) {
    if (this.estado === 'inicio') this.escribirCentrado(ctx, this.LETRAS_INICIO, 'START GAME');
    else if (this.estado === 'fin') this.escribirCentrado(ctx, this.LETRAS_FIN, 'GAME OVER');
  }
};

(function () {
  var p = KF.partida;
  p.LETRAS_INICIO = KF.graficos.crearFuente(p.COLOR_INICIO);
  p.LETRAS_FIN = KF.graficos.crearFuente(p.COLOR_FIN);
  window.addEventListener('keydown', function (e) {
    if (!e.repeat) p.pulsar();
  });
  // La pulsación corta que empieza la partida no dispara.
  KF.alPulsarCorto(function () {
    var antes = p.estado;
    p.pulsar();
    if (p.estado !== antes) KF.tactil.disparar = false;
  });
  p.irAInicio();
})();

// Después del marcador, para que los mensajes queden encima de todo.
KF.registrar(KF.partida);
