// La nave nodriza jefe: al limpiar cada tercera oleada (3, 6, 9…), antes de
// la oleada desafío, se muestra 'MOTHERSHIP' y entra sola una nave nodriza
// grande que se mueve de lado a lado en la parte de arriba y suelta ráfagas
// de tres bombas en abanico hacia el jugador. Aguanta 20 impactos la primera
// vez, 30 la segunda, 40 la tercera…; una barra encima muestra la vida que le
// queda y cada impacto la hace destellar en blanco. La bomba y la aniquilación
// le quitan 5 de vida. Al caer explota a lo grande y da 2.000 puntos por cada
// aparición (con el multiplicador del combo) a quien le da el último impacto.
// Su posición solo depende del tiempo, así que en la partida a dos el
// invitado la calcula con el tiempo que le manda el anfitrión.
KF.jefe = {
  CADA: 3,                 // aparece tras cada tantas oleadas
  VIDA_INICIAL: 20,        // impactos que aguanta la primera vez
  VIDA_MAS: 10,            // impactos de más en cada aparición siguiente
  PUNTOS: 2000,            // puntos por cada aparición (2.000, 4.000…)
  DANO_ESPECIAL: 5,        // vida que le quitan la bomba y la aniquilación
  ENTRADA: 2,              // segundos con 'MOTHERSHIP' mientras baja
  ALTURA: 60,              // altura de su centro
  AMPLITUD: 76,            // píxeles a cada lado del centro de la pantalla
  RITMO: 0.8,              // radianes por segundo del vaivén (por la velocidad de la oleada)
  ANCHO: 40,               // rectángulo de impacto
  ALTO: 16,
  PRIMERA_RAFAGA: 1,       // segundos desde que acaba de entrar hasta la primera ráfaga
  SEPARACION_RAFAGAS: 2,   // segundos entre ráfagas (más corto con la velocidad de la oleada)
  BOMBAS_RAFAGA: 3,
  ABANICO: 30,             // píxeles por segundo laterales entre bombas de la ráfaga
  DURACION_DESTELLO: 0.08, // segundos en blanco tras cada impacto
  DURACION_FIN: 2,         // segundos de la gran explosión antes de seguir
  ESCALA_TEXTO: 2,
  COLOR_TITULO: '#ff60ff',
  FASES: ['entrando', 'luchando', 'destruida'],

  activo: false,           // hay una nave nodriza en pantalla
  hecho: false,            // ya se jugó la de esta oleada (Partida lo pone a false)
  fase: 'entrando',
  aparicion: 1,            // cuántas van en la partida (1 tras la oleada 3…)
  t: 0,                    // segundos desde que empezó; se para al destruirla
  tiempoFin: 0,            // segundos desde que la destruyeron
  vida: 0,
  vidaMaxima: 0,
  destello: 0,
  esperaRafaga: 0,
  impactos: 0,             // impactos recibidos desde que empezó el juego (Sonido los observa)
  nave: null,              // {tipo, viva, puntos}: para Enemigos, Combos y Sonido al destruirla

  empezar: function (aparicion) {
    this.activo = true;
    this.fase = 'entrando';
    this.aparicion = aparicion;
    this.t = 0;
    this.tiempoFin = 0;
    this.vidaMaxima = this.VIDA_INICIAL + (aparicion - 1) * this.VIDA_MAS;
    this.vida = this.vidaMaxima;
    this.destello = 0;
    this.esperaRafaga = this.PRIMERA_RAFAGA;
    this.nave = { i: -1, tipo: 'nodriza', viva: true, puntos: this.PUNTOS * aparicion };
  },

  // Sin nave nodriza: al empezar cada oleada (Partida).
  quitar: function () {
    this.activo = false;
    this.hecho = false;
  },

  // Posición de su centro en el instante t: baja durante la entrada y luego
  // va de lado a lado con un ligero balanceo vertical.
  posicion: function (t) {
    var v = KF.ataque.factorVelocidad;
    var bajada = Math.min(1, t / this.ENTRADA);
    var y = -12 + (this.ALTURA + 12) * (1 - (1 - bajada) * (1 - bajada));
    var lucha = Math.max(0, t - this.ENTRADA);
    return {
      x: KF.ANCHO / 2 + this.AMPLITUD * Math.sin(lucha * this.RITMO * v),
      y: y + 4 * Math.sin(lucha * 1.7)
    };
  },

  // Se le puede dar mientras entra y lucha.
  enJuego: function () {
    return this.activo && this.fase !== 'destruida';
  },

  // ¿Toca el rectángulo {x, y, ancho, alto} a la nave nodriza?
  alcanza: function (r) {
    if (!this.enJuego()) return false;
    var p = this.posicion(this.t);
    return r.x < p.x + this.ANCHO / 2 && r.x + r.ancho > p.x - this.ANCHO / 2 &&
      r.y < p.y + this.ALTO / 2 && r.y + r.alto > p.y - this.ALTO / 2;
  },

  // ¿Toca el círculo de la bomba del jugador a la nave nodriza?
  alcanzaCirculo: function (x, y, radio) {
    if (!this.enJuego()) return false;
    var p = this.posicion(this.t);
    var dx = Math.max(Math.abs(x - p.x) - this.ANCHO / 2, 0);
    var dy = Math.max(Math.abs(y - p.y) - this.ALTO / 2, 0);
    return dx * dx + dy * dy <= radio * radio;
  },

  // Le quita vida; si llega a cero, la destruye y los puntos son del autor.
  danar: function (cantidad, autor) {
    if (!this.enJuego()) return;
    this.vida = Math.max(0, this.vida - cantidad);
    this.destello = this.DURACION_DESTELLO;
    this.impactos++;
    if (this.vida === 0) this.destruir(autor);
  },

  destruir: function (autor) {
    var p = this.posicion(this.t);
    this.fase = 'destruida';
    this.tiempoFin = 0;
    KF.enemigos.destruir(this.nave, p.x, p.y, 'disparo', autor);
  },

  // Ráfaga de bombas en abanico apuntada a la nave del jugador más cercana.
  disparar: function () {
    var p = this.posicion(this.t), b = KF.ataque.blanco(p.x);
    if (!b) return;
    var vy = KF.ataque.VELOCIDAD_BOMBA * KF.ataque.factorVelocidad;
    var y = p.y + 10;
    var centro = (b.x - p.x) / Math.max(20, b.Y - y) * vy;
    var n = this.BOMBAS_RAFAGA;
    for (var i = 0; i < n; i++) {
      KF.ataque.bombas.push({ id: KF.nuevoId(), x: p.x, y: y, vx: centro + (i - (n - 1) / 2) * this.ABANICO });
    }
  },

  actualizar: function (dt) {
    if (!this.activo) return;
    this.destello = Math.max(0, this.destello - dt);
    // En el invitado de una partida a dos, la nave nodriza llega del anfitrión.
    if (KF.red.invitado) return;
    if (this.fase === 'destruida') {
      this.tiempoFin += dt;
      if (this.tiempoFin >= this.DURACION_FIN) {
        this.activo = false;
        this.hecho = true;
      }
      return;
    }
    this.t += dt;
    if (this.fase === 'entrando') {
      if (this.t >= this.ENTRADA) this.fase = 'luchando';
      return;
    }
    // Sin naves de jugador en juego no dispara, para que la de recambio pueda
    // salir (Partida espera a que no queden bombas); luego espera un poco.
    if (!KF.navesVivas().length) {
      this.esperaRafaga = Math.max(this.esperaRafaga, KF.ataque.PRIMER_ATAQUE);
      return;
    }
    this.esperaRafaga -= dt;
    if (this.esperaRafaga <= 0) {
      this.esperaRafaga = this.SEPARACION_RAFAGAS / KF.ataque.factorVelocidad;
      this.disparar();
    }
  },

  // Anfitrión: la nave nodriza en la foto de la partida a dos, o 0 si no hay.
  foto: function () {
    if (!this.activo) return 0;
    return [this.FASES.indexOf(this.fase), KF.redondear(this.t), this.vida, this.vidaMaxima,
      KF.redondear(this.tiempoFin), this.aparicion];
  },

  // Invitado: lo que cambia de golpe (empieza o acaba, impactos, destruida).
  aplicarCambios: function (d) {
    if (!d) { this.activo = false; return; }
    if (!this.activo) this.empezar(d[5]);
    if (d[2] < this.vida) {
      this.destello = this.DURACION_DESTELLO;
      this.impactos++;
    }
    this.vida = d[2];
    this.vidaMaxima = d[3];
    var fase = this.FASES[d[0]];
    if (fase === 'destruida' && this.fase !== 'destruida') {
      this.t = d[1];
      this.destruir(null);
    }
    this.fase = fase;
    this.tiempoFin = d[4];
  },

  escribirCentrado: function (ctx, letras, texto, y) {
    var g = KF.graficos, e = this.ESCALA_TEXTO;
    g.escribir(ctx, letras, texto, (KF.ANCHO - g.anchoTexto(texto, e)) / 2, y, e);
  },

  // Gran explosión: varias explosiones de nave escalonadas sobre el casco.
  EXPLOSIONES: [[0, 0, 0], [-12, 2, 0.15], [12, -2, 0.3], [-6, -5, 0.45], [7, 5, 0.6],
    [-16, -1, 0.75], [16, 3, 0.9], [0, 4, 1.05], [-9, 0, 1.2], [9, -3, 1.35]],

  dibujar: function (ctx) {
    if (!this.activo) return;
    var g = KF.graficos, p = this.posicion(this.t);
    if (this.fase !== 'destruida') {
      g.dibujar(ctx, this.destello > 0 ? this.SPRITE_BLANCO : this.SPRITE, p.x, p.y);
      // Barra de vida encima de la nave.
      var ancho = this.ANCHO, x = Math.round(p.x - ancho / 2), y = Math.round(p.y - 16);
      var parte = this.vida / this.vidaMaxima;
      ctx.fillStyle = '#402020';
      ctx.fillRect(x, y, ancho, 2);
      ctx.fillStyle = parte > 0.5 ? '#40e040' : parte > 0.25 ? '#ffff40' : '#f02828';
      ctx.fillRect(x, y, Math.ceil(ancho * parte), 2);
    } else {
      var fases = KF.enemigos.SPRITES_EXPLOSION, d = KF.enemigos.DURACION_FASE * 2;
      for (var i = 0; i < this.EXPLOSIONES.length; i++) {
        var e = this.EXPLOSIONES[i], f = Math.floor((this.tiempoFin - e[2]) / d);
        if (f >= 0 && f < fases.length) g.dibujar(ctx, fases[f], p.x + e[0], p.y + e[1]);
      }
    }
    if (this.fase === 'entrando') {
      var medio = (KF.ALTO - g.FUENTE_ALTO * this.ESCALA_TEXTO) / 2;
      this.escribirCentrado(ctx, this.LETRAS_TITULO, 'MOTHERSHIP', medio);
    }
  }
};

(function () {
  var j = KF.jefe, g = KF.graficos;
  j.SPRITE = g.SPRITE_JEFE;
  j.SPRITE_BLANCO = g.SPRITE_JEFE_BLANCO;
  j.LETRAS_TITULO = g.crearFuente(j.COLOR_TITULO);
})();

KF.registrar(KF.jefe);
