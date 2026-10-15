// El ciclo de la partida: pantalla 'START GAME' con su menú (1 jugador, crear
// una partida a dos o unirse a una), oleadas sucesivas un 5% más rápidas cada
// una (bloque, picados y bombas), tres naves por jugador (una en juego y dos
// de recambio) y 'GAME OVER' al perder la última, que se queda hasta que se
// pulsa una tecla. En la partida a dos (js/red.js) el anfitrión mueve el
// juego y el invitado recibe su estado; cada jugador tiene sus naves y sus
// puntos, y la partida acaba cuando a ninguno le quedan naves. Tras ella, el
// menú ofrece además 'PLAY AGAIN' mientras los dos sigan conectados.
KF.partida = {
  NAVES_RECAMBIO: 2,       // naves de recambio al empezar la partida
  MAXIMO_RECAMBIO: 5,      // tope de naves de recambio (power-up vida extra)
  AUMENTO_OLEADA: 1.05,    // cada oleada va un 5% más rápida que la anterior
  ESPERA_OLEADA: 2,        // segundos entre destruir la última nave y la oleada siguiente
  ESPERA_RECAMBIO: 2,      // segundos mínimos entre explotar y salir la nave de recambio
  ESPERA_FIN: 1,           // segundos de 'GAME OVER' antes de atender las teclas,
                           // para no saltarlo sin querer al disparar
  ESCALA_TEXTO: 2,         // los mensajes, al doble del tamaño de la fuente
  COLOR_INICIO: '#ffff40',
  COLOR_FIN: '#f02828',
  COLOR_OPCION: '#808080',
  // Opciones del menú de inicio, debajo de 'START GAME'; tras una partida a
  // dos, con los dos aún conectados, 'PLAY AGAIN' va la primera.
  OPCIONES: ['1 PLAYER', 'CREATE GAME', 'JOIN GAME'],
  OTRA_PARTIDA: 'PLAY AGAIN',
  SEPARACION_OPCIONES: 16, // píxeles entre una opción y la siguiente

  estado: 'inicio',        // 'inicio' | 'jugando' | 'fin'; mientras se prepara
                           // una partida a dos, js/red.js muestra la sala
  oleada: 1,
  esperaOleada: 0,         // segundos desde que se destruyó la última nave
  tiempoFin: 0,            // segundos desde 'GAME OVER'
  opcion: 0,               // opción elegida en el menú de inicio

  // Pantalla de inicio: la formación de la primera oleada se mueve detrás
  // del texto, sin ataques porque no hay naves de jugador.
  irAInicio: function () {
    this.estado = 'inicio';
    this.opcion = 0;
    for (var i = 0; i < KF.jugadores.length; i++) KF.jugadores[i].retirar();
    KF.marcador.cambiarModo(!!KF.companero);
    this.ponerOleada(1);
  },

  // Empieza la partida, a uno o (con KF.companero) a dos: cada jugador con
  // sus puntos a cero, sus naves de recambio y su nave en juego. También
  // desde la pausa (RESTART, js/pausa.js), dejando atrás la partida a medias.
  empezar: function () {
    this.estado = 'jugando';
    KF.inclinacion.calibrar();
    KF.marcador.cambiarModo(!!KF.companero);
    this.ponerOleada(1);
    for (var i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i];
      j.retirar();
      j.disparos = [];
      j.puntos = 0;
      j.recambio = this.NAVES_RECAMBIO;
      j.aparecer();
    }
  },

  // Formación nueva, la que toca a la oleada n, con su velocidad; Ataque deja
  // atrás los ataques de la anterior al ver la formación nueva.
  ponerOleada: function (n) {
    var factor = Math.pow(this.AUMENTO_OLEADA, n - 1);
    this.oleada = n;
    this.esperaOleada = 0;
    KF.formacion.reiniciar(KF.formacion.VELOCIDAD_INICIAL * factor, n);
    KF.ataque.oleada = n;
    KF.ataque.factorVelocidad = factor;
    KF.marcador.ponerOleada(n);
  },

  // Una nave de recambio más para ese jugador (power-up vida extra), hasta el tope.
  sumarRecambio: function (jugador) {
    if (jugador.recambio < this.MAXIMO_RECAMBIO) jugador.recambio++;
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
    // En el invitado, el estado de la partida llega del anfitrión.
    if (this.estado !== 'jugando' || KF.red.invitado) return;

    // Nave perdida: tras la explosión, si al jugador le quedan de recambio
    // sale otra. Si no hay otra nave en juego, espera a que las naves en
    // picado vuelvan a la formación y no queden bombas; a dos, con el
    // compañero jugando, sale en cuanto pasa la espera.
    for (var i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i];
      if (j.estado !== 'explotando' || j.tiempoExplosion < this.ESPERA_RECAMBIO) continue;
      if (j.recambio === 0) {
        j.retirar();
        continue;
      }
      var acompanado = KF.navesVivas().length > 0;
      if (acompanado || (!KF.ataque.atacantes.length && !KF.ataque.bombas.length)) {
        j.recambio--;
        j.aparecer();
        if (!acompanado) KF.ataque.tregua();
      }
    }

    // Sin naves de ningún jugador (ni explotando), se acaba la partida.
    var enJuego = KF.jugadores.some(function (n) { return n.estado !== 'ausente'; });
    if (!enJuego) {
      this.estado = 'fin';
      this.tiempoFin = 0;
      return;
    }

    // Oleada destruida: la siguiente llega poco después, con alguna nave en juego.
    if (KF.navesVivas().length && !this.quedanNaves()) {
      this.esperaOleada += dt;
      if (this.esperaOleada >= this.ESPERA_OLEADA) this.ponerOleada(this.oleada + 1);
    }
  },

  // Opciones del menú de inicio ahora mismo.
  opciones: function () {
    return KF.red.fase === 'menu' ? [this.OTRA_PARTIDA].concat(this.OPCIONES) : this.OPCIONES;
  },

  // La opción elegida del menú de inicio. Cualquiera salvo 'PLAY AGAIN' deja
  // la conexión con el otro jugador, si la había.
  elegir: function () {
    var opcion = this.opciones()[this.opcion];
    if (opcion === this.OTRA_PARTIDA) KF.red.elegirOtra();
    else if (opcion === 'CREATE GAME') KF.red.crear();
    else if (opcion === 'JOIN GAME') KF.red.pedirCodigo();
    else {
      KF.red.cerrar();
      this.empezar();
    }
  },

  // Cualquier tecla o pulsación corta elige la opción del menú de inicio y
  // vuelve a él desde 'GAME OVER' (a dos, sin cortar la conexión si sigue).
  pulsar: function () {
    if (this.estado === 'inicio' && !KF.red.activa()) this.elegir();
    else if (this.estado === 'fin' && this.tiempoFin >= this.ESPERA_FIN) {
      if (KF.red.fase === 'jugando') KF.red.alMenu();
      else KF.red.cerrar();
      this.irAInicio();
    }
  },

  // Altura (borde superior) de la opción i del menú de inicio.
  alturaOpcion: function (i) {
    return KF.ALTO / 2 + 20 + i * this.SEPARACION_OPCIONES;
  },

  // Opción del menú en el punto (x, y) de la pantalla lógica, o -1.
  opcionEn: function (p) {
    for (var i = 0; i < this.opciones().length; i++) {
      var y = this.alturaOpcion(i);
      if (p.y >= y - 5 && p.y < y + KF.graficos.FUENTE_ALTO + 5) return i;
    }
    return -1;
  },

  escribirCentrado: function (ctx, letras, texto, y, escala) {
    var g = KF.graficos;
    var x = (KF.ANCHO - g.anchoTexto(texto, escala)) / 2;
    g.escribir(ctx, letras, texto, x, y, escala);
  },

  dibujar: function (ctx) {
    var e = this.ESCALA_TEXTO, medio = (KF.ALTO - KF.graficos.FUENTE_ALTO * e) / 2;
    if (this.estado === 'inicio' && !KF.red.activa()) {
      this.escribirCentrado(ctx, this.LETRAS_INICIO, 'START GAME', medio, e);
      var opciones = this.opciones();
      for (var i = 0; i < opciones.length; i++) {
        var letras = i === this.opcion ? this.LETRAS_INICIO : this.LETRAS_OPCION;
        this.escribirCentrado(ctx, letras, opciones[i], this.alturaOpcion(i), 1);
      }
    } else if (this.estado === 'fin') {
      this.escribirCentrado(ctx, this.LETRAS_FIN, 'GAME OVER', medio, e);
    }
  }
};

(function () {
  var p = KF.partida;
  p.LETRAS_INICIO = KF.graficos.crearFuente(p.COLOR_INICIO);
  p.LETRAS_FIN = KF.graficos.crearFuente(p.COLOR_FIN);
  p.LETRAS_OPCION = KF.graficos.crearFuente(p.COLOR_OPCION);
  window.addEventListener('keydown', function (e) {
    if (e.repeat) return;
    // Con la partida a dos en marcha (sala, conexión, pausa), las teclas son
    // para ella, salvo en 'GAME OVER'.
    if (p.estado !== 'fin' && KF.red.activa()) { KF.red.tecla(); return; }
    // En el menú de inicio, las flechas arriba y abajo cambian de opción.
    if (p.estado === 'inicio' && !KF.red.activa() && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
      var n = p.opciones().length;
      p.opcion = (p.opcion + (e.code === 'ArrowUp' ? n - 1 : 1)) % n;
      return;
    }
    p.pulsar();
  });
  // La pulsación corta que empieza la partida no dispara. En el menú, tocar
  // una opción la elige; tocar en otro sitio elige la marcada.
  KF.alPulsarCorto(function () {
    var antes = p.estado;
    if (antes !== 'fin' && KF.red.activa()) {
      if (antes !== 'jugando') KF.tactil.disparar = false;
      KF.red.toque(KF.ultimoToque);
      return;
    }
    if (antes === 'inicio' && !KF.red.activa() && KF.ultimoToque) {
      var i = p.opcionEn(KF.ultimoToque);
      if (i >= 0) p.opcion = i;
    }
    p.pulsar();
    if (p.estado !== antes || antes === 'inicio') KF.tactil.disparar = false;
  });
  p.irAInicio();
})();

// Después del marcador, para que los mensajes queden encima de todo.
KF.registrar(KF.partida);
