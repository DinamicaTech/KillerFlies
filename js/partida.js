// El ciclo de la partida: pantalla 'START GAME' con su menú (1 jugador, crear
// una partida a dos o unirse a una), oleadas sucesivas un 5% más rápidas cada
// una (bloque, picados y bombas) con una oleada desafío entre una y otra
// (js/desafio.js) y, tras cada tercera oleada, la nave nodriza jefe antes del
// desafío (js/jefe.js), tres naves por jugador (una en juego y dos
// de recambio) y 'GAME OVER' al perder la última, que se queda hasta que se
// pulsa una tecla. En la partida a dos (js/red.js) el anfitrión mueve el
// juego y el invitado recibe su estado; cada jugador tiene sus naves y sus
// puntos, y la partida acaba cuando a ninguno le quedan naves. Tras ella, el
// menú ofrece además 'PLAY AGAIN' mientras los dos sigan conectados. Bajo las
// opciones, la línea de la dificultad (js/dificultad.js) y, si esa dificultad
// tiene algún perfect, la línea '< FROM WAVE n >' para empezar la partida a
// uno desde él (js/perfect.js).
KF.partida = {
  NAVES_RECAMBIO: 2,       // naves de recambio al empezar la partida
  MAXIMO_RECAMBIO: 5,      // tope de naves de recambio (vidas extra)
  PUNTOS_VIDA_EXTRA: 10000, // cada tantos puntos, una nave de recambio más
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
  SEPARACION_DIFICULTAD: 8, // píxeles de más entre la última opción y la dificultad

  estado: 'inicio',        // 'inicio' | 'jugando' | 'fin'; mientras se prepara
                           // una partida a dos, js/red.js muestra la sala
  oleada: 1,
  esperaOleada: 0,         // segundos desde que se destruyó la última nave
  tiempoFin: 0,            // segundos desde 'GAME OVER'
  opcion: 0,               // opción elegida en el menú de inicio (la siguiente
                           // a la última es la línea '< FROM WAVE n >')
  inicio: null,            // punto de partida de la partida en curso, o null si
                           // empezó en la oleada 1 (lo repite RESTART)
  navePerdida: false,      // se perdió una nave en la oleada principal en curso

  // Pantalla de inicio: la formación de la primera oleada se mueve detrás
  // del texto, sin ataques porque no hay naves de jugador.
  irAInicio: function () {
    this.estado = 'inicio';
    this.opcion = 0;
    KF.dificultad.nivel = KF.dificultad.elegido;
    KF.perfect.marcarUltimo();
    for (var i = 0; i < KF.jugadores.length; i++) KF.jugadores[i].retirar();
    KF.marcador.cambiarModo(!!KF.companero);
    this.ponerOleada(1);
  },

  // Empieza la partida, a uno o (con KF.companero) a dos: cada jugador con
  // sus puntos a cero, sus naves de recambio y su nave en juego. A uno puede
  // empezar desde un perfect (inicio: { oleada, puntos }, js/perfect.js), en esa
  // oleada y con esos puntos; la vida extra siguiente llega en el múltiplo de
  // 10.000 que viene después de ellos. También desde la pausa (RESTART,
  // js/pausa.js), dejando atrás la partida a medias.
  empezar: function (inicio) {
    this.estado = 'jugando';
    this.inicio = inicio && !KF.companero ? inicio : null;
    KF.dificultad.nivel = KF.dificultad.elegido;
    KF.combos.flotantes = [];
    KF.inclinacion.calibrar();
    KF.marcador.cambiarModo(!!KF.companero);
    this.ponerOleada(this.inicio ? this.inicio.oleada : 1);
    var puntos = this.inicio ? this.inicio.puntos : 0;
    for (var i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i];
      j.retirar();
      j.disparos = [];
      j.puntos = puntos;
      j.racha = 0;
      j.recambio = this.NAVES_RECAMBIO;
      j.proximaVida = (Math.floor(puntos / this.PUNTOS_VIDA_EXTRA) + 1) * this.PUNTOS_VIDA_EXTRA;
      j.aparecer();
    }
  },

  // Formación nueva, la que toca a la oleada n, con su velocidad; Ataque deja
  // atrás los ataques de la anterior al ver la formación nueva. La dificultad
  // multiplica la velocidad de todas las oleadas.
  ponerOleada: function (n) {
    var factor = Math.pow(this.AUMENTO_OLEADA, n - 1) * KF.dificultad.factorVelocidad();
    this.oleada = n;
    this.esperaOleada = 0;
    this.navePerdida = false;
    KF.formacion.reiniciar(KF.formacion.VELOCIDAD_INICIAL * factor, n);
    KF.ataque.oleada = n;
    KF.ataque.factorVelocidad = factor;
    KF.marcador.ponerOleada(n);
    KF.desafio.quitar();
    KF.jefe.quitar();
  },

  // Una nave de recambio más para ese jugador (power-up vida extra), hasta el tope.
  sumarRecambio: function (jugador) {
    if (jugador.recambio < this.MAXIMO_RECAMBIO) jugador.recambio++;
  },

  // Vida extra por puntos: cada 10.000 puntos de un jugador, una nave de
  // recambio más (hasta el tope), con el sonido del power-up vida extra (Sonido
  // observa las recogidas). Con el tope lleno no da nada ni suena.
  vidaExtraPorPuntos: function (jugador) {
    while (jugador.puntos >= jugador.proximaVida) {
      jugador.proximaVida += this.PUNTOS_VIDA_EXTRA;
      if (jugador.recambio < this.MAXIMO_RECAMBIO) {
        jugador.recambio++;
        KF.powerups.recogidas++;
      }
    }
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
    // compañero jugando, sale en cuanto pasa la espera. Antes, los puntos
    // ganados pueden haber dado una vida extra.
    for (var i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i];
      this.vidaExtraPorPuntos(j);
      if (j.estado === 'explotando') this.navePerdida = true;
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

    // Mientras dura la oleada desafío (js/desafio.js) o la nave nodriza jefe
    // (js/jefe.js) no llega otra oleada.
    if (KF.desafio.activo || KF.jefe.activo) return;

    // Oleada destruida: poco después, con alguna nave en juego, llega la nave
    // nodriza si la oleada es múltiplo de 3, luego la oleada desafío y, tras
    // ella, la oleada siguiente.
    if (KF.navesVivas().length && !this.quedanNaves()) {
      if (this.esperaOleada === 0) this.anotarPerfect();
      this.esperaOleada += dt;
      if (this.esperaOleada >= this.ESPERA_OLEADA) {
        var j = KF.jefe;
        if (this.oleada % j.CADA === 0 && !j.hecho) j.empezar(this.oleada / j.CADA);
        else if (!KF.desafio.hecho) KF.desafio.empezar();
        else this.ponerOleada(this.oleada + 1);
      }
    }
  },

  // Oleada principal destruida: en la partida a uno, si no se perdió ninguna
  // nave mientras duraba, es un perfect (js/perfect.js).
  anotarPerfect: function () {
    if (this.navePerdida || KF.companero) return;
    KF.perfect.anotar(KF.dificultad.nivel, this.oleada, KF.jugador.puntos);
  },

  // Opciones del menú de inicio ahora mismo.
  opciones: function () {
    return KF.red.fase === 'menu' ? [this.OTRA_PARTIDA].concat(this.OPCIONES) : this.OPCIONES;
  },

  // La opción elegida del menú de inicio. Cualquiera salvo 'PLAY AGAIN' deja
  // la conexión con el otro jugador, si la había.
  elegir: function () {
    var opcion = this.opciones()[this.opcion];
    if (this.enPerfect()) {
      KF.red.cerrar();
      this.empezar(KF.perfect.marcado());
    } else if (opcion === this.OTRA_PARTIDA) KF.red.elegirOtra();
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

  // Altura (borde superior) de la línea de la dificultad, bajo las opciones.
  alturaDificultad: function () {
    return this.alturaOpcion(this.opciones().length) + this.SEPARACION_DIFICULTAD;
  },

  // Altura (borde superior) de la línea '< FROM WAVE n >', bajo la dificultad.
  alturaPerfect: function () {
    return this.alturaDificultad() + this.SEPARACION_OPCIONES;
  },

  // Filas que se recorren con las flechas arriba y abajo: las opciones y, si
  // la dificultad marcada tiene algún perfect, la línea '< FROM WAVE n >'.
  filas: function () {
    return this.opciones().length + (KF.perfect.marcado() ? 1 : 0);
  },

  // La línea '< FROM WAVE n >' está marcada.
  enPerfect: function () {
    return this.opcion === this.opciones().length && !!KF.perfect.marcado();
  },

  // Cambia la dificultad marcada en el menú; la formación de detrás se pone
  // a la velocidad del nivel nuevo.
  // Cada nivel tiene sus perfects: se marca el de oleada más alta.
  cambiarDificultad: function (paso) {
    KF.dificultad.cambiar(paso);
    KF.dificultad.nivel = KF.dificultad.elegido;
    KF.perfect.marcarUltimo();
    this.ponerOleada(1);
  },

  // Las flechas izquierda y derecha cambian el perfect si su línea está
  // marcada y, si no, la dificultad.
  cambiarConFlechas: function (paso) {
    if (this.enPerfect()) KF.perfect.cambiar(paso);
    else this.cambiarDificultad(paso);
  },

  // El punto (x, y) de la pantalla lógica está en la línea que empieza en y.
  enLinea: function (p, y) {
    return p.y >= y - 5 && p.y < y + KF.graficos.FUENTE_ALTO + 5;
  },

  // El punto (x, y) de la pantalla lógica está en la línea de la dificultad.
  enDificultad: function (p) {
    return this.enLinea(p, this.alturaDificultad());
  },

  // El punto (x, y) está en la línea '< FROM WAVE n >', si se muestra.
  enLineaPerfect: function (p) {
    return !!KF.perfect.marcado() && this.enLinea(p, this.alturaPerfect());
  },

  // Tocar la línea '< FROM WAVE n >' la marca; si ya estaba marcada, pasa al
  // perfect siguiente. Tocar fuera de ella empieza desde el marcado.
  tocarPerfect: function () {
    if (this.enPerfect()) KF.perfect.cambiar(1);
    else this.opcion = this.opciones().length;
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
      this.escribirCentrado(ctx, this.LETRAS_INICIO, KF.dificultad.texto(), this.alturaDificultad(), 1);
      if (KF.perfect.marcado()) {
        var letrasPerfect = this.enPerfect() ? this.LETRAS_INICIO : this.LETRAS_OPCION;
        this.escribirCentrado(ctx, letrasPerfect, KF.perfect.texto(), this.alturaPerfect(), 1);
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
      var n = p.filas();
      p.opcion = (p.opcion + (e.code === 'ArrowUp' ? n - 1 : 1)) % n;
      return;
    }
    // Y las flechas izquierda y derecha cambian la dificultad (o el perfect,
    // con su línea marcada).
    if (p.estado === 'inicio' && !KF.red.activa() && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
      p.cambiarConFlechas(e.code === 'ArrowLeft' ? -1 : 1);
      return;
    }
    p.pulsar();
  });
  // La pulsación corta que empieza la partida no dispara. En el menú, tocar
  // una opción la elige, tocar la dificultad pasa al nivel siguiente, tocar la
  // línea '< FROM WAVE n >' la marca (o pasa al perfect siguiente) y tocar en
  // otro sitio elige la opción marcada.
  KF.alPulsarCorto(function () {
    var antes = p.estado;
    if (antes !== 'fin' && KF.red.activa()) {
      if (antes !== 'jugando') KF.tactil.disparar = false;
      KF.red.toque(KF.ultimoToque);
      return;
    }
    if (antes === 'inicio' && !KF.red.activa() && KF.ultimoToque) {
      if (p.enDificultad(KF.ultimoToque)) {
        p.cambiarDificultad(1);
        if (p.opcion >= p.filas()) p.opcion = 0;
        KF.tactil.disparar = false;
        return;
      }
      if (p.enLineaPerfect(KF.ultimoToque)) {
        p.tocarPerfect();
        KF.tactil.disparar = false;
        return;
      }
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
