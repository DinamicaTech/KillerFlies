// La oleada desafío, como en Galaga: tras limpiar cada oleada, cuatro grupos
// de naves cruzan la pantalla siguiendo caminos fijos, sin disparar ni chocar.
// Si se destruyen todas, cada jugador que siga en la partida gana una nave de
// recambio (hasta el tope); en cuanto una nave sale viva de la pantalla, el
// desafío se acaba sin premio. Cada nave da sus puntos de siempre.
// Las posiciones solo dependen del tiempo del desafío, así que en la partida
// a dos el invitado las calcula con el tiempo que le manda el anfitrión.
KF.desafio = {
  NAVES_GRUPO: 6,
  ENTRADA: 2,              // segundos con el título antes del primer grupo
  SEPARACION_GRUPOS: 4,    // segundos entre la salida de un grupo y el siguiente
  SEPARACION_NAVES: 0.3,   // segundos entre las naves de un mismo grupo
  DURACION_CAMINO: 6,      // segundos que tarda una nave en cruzar
  DURACION_MENSAJE: 2,     // segundos del mensaje final antes de la oleada siguiente
  ESCALA_TEXTO: 2,
  COLOR_TITULO: '#40c0ff',
  COLOR_PREMIO: '#ffff40',
  COLOR_FALLO: '#808080',
  FASES: ['jugando', 'perfecto', 'fallido'],

  activo: false,           // hay un desafío en pantalla
  hecho: false,            // ya se jugó el desafío de esta oleada (Partida lo pone a false)
  fase: 'jugando',
  t: 0,                    // segundos desde que empezó el desafío
  tiempoFin: 0,            // segundos desde que se ganó o se perdió
  naves: [],               // {i, tipo, viva, grupo, salida}

  empezar: function () {
    this.activo = true;
    this.fase = 'jugando';
    this.t = 0;
    this.tiempoFin = 0;
    this.naves = [];
    for (var g = 0; g < this.GRUPOS.length; g++) {
      for (var k = 0; k < this.NAVES_GRUPO; k++) {
        this.naves.push({
          i: this.naves.length,
          tipo: this.GRUPOS[g].tipo,
          viva: true,
          grupo: g,
          salida: this.ENTRADA + g * this.SEPARACION_GRUPOS + k * this.SEPARACION_NAVES
        });
      }
    }
  },

  // Sin desafío: al empezar cada oleada (Partida).
  quitar: function () {
    this.activo = false;
    this.hecho = false;
    this.naves = [];
  },

  // Posición y ángulo de una nave en el instante t, o null si aún no ha
  // entrado o ya ha salido.
  posicion: function (nave, t) {
    var u = (t - nave.salida) / this.DURACION_CAMINO;
    if (u < 0 || u > 1) return null;
    var camino = this.GRUPOS[nave.grupo].camino;
    var p = camino(u), q = camino(Math.min(1, u + 0.01)), o = camino(Math.max(0, u - 0.01));
    return { x: p.x, y: p.y, angulo: Math.atan2(q.x - o.x, -(q.y - o.y)) };
  },

  // Naves vivas en pantalla con su posición; también para la bomba y la
  // aniquilación de power-ups.
  enPantalla: function () {
    var lista = [];
    if (!this.activo || this.fase !== 'jugando') return lista;
    for (var i = 0; i < this.naves.length; i++) {
      var n = this.naves[i];
      if (!n.viva) continue;
      var p = this.posicion(n, this.t);
      if (p) lista.push({ nave: n, x: p.x, y: p.y, angulo: p.angulo });
    }
    return lista;
  },

  // Si el rectángulo {x, y, ancho, alto} toca una nave del desafío, la
  // destruye y la devuelve; si no, devuelve null. Lo usa el disparo del jugador.
  tocar: function (r, autor) {
    var f = KF.formacion, lista = this.enPantalla();
    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      if (r.x < a.x + f.ANCHO_NAVE / 2 && r.x + r.ancho > a.x - f.ANCHO_NAVE / 2 &&
          r.y < a.y + f.ALTO_NAVE / 2 && r.y + r.alto > a.y - f.ALTO_NAVE / 2) {
        KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo', autor);
        return a.nave;
      }
    }
    return null;
  },

  // Todas destruidas: una nave de recambio para cada jugador que siga en la
  // partida. Suena como la vida extra del power-up (Sonido observa las recogidas).
  ganar: function () {
    this.fase = 'perfecto';
    this.tiempoFin = 0;
    for (var i = 0; i < KF.jugadores.length; i++) {
      if (KF.jugadores[i].estado !== 'ausente') KF.partida.sumarRecambio(KF.jugadores[i]);
    }
    KF.powerups.recogidas++;
  },

  // Una nave ha salido viva: ya no hay premio y las demás desaparecen.
  perder: function () {
    this.fase = 'fallido';
    this.tiempoFin = 0;
  },

  actualizar: function (dt) {
    // En el invitado de una partida a dos, el desafío llega del anfitrión.
    if (!this.activo || KF.red.invitado) return;
    this.t += dt;
    if (this.fase === 'jugando') {
      var quedan = false;
      for (var i = 0; i < this.naves.length; i++) {
        var n = this.naves[i];
        if (!n.viva) continue;
        quedan = true;
        if (this.t >= n.salida + this.DURACION_CAMINO) { this.perder(); return; }
      }
      if (!quedan) this.ganar();
      return;
    }
    this.tiempoFin += dt;
    if (this.tiempoFin >= this.DURACION_MENSAJE) {
      this.activo = false;
      this.hecho = true;
    }
  },

  // Anfitrión: el desafío en la foto de la partida a dos, o 0 si no hay.
  foto: function () {
    if (!this.activo) return 0;
    var vivas = '';
    for (var i = 0; i < this.naves.length; i++) vivas += this.naves[i].viva ? '1' : '0';
    return [this.FASES.indexOf(this.fase), KF.redondear(this.t), vivas];
  },

  // Invitado: lo que cambia de golpe (empieza o acaba el desafío, naves
  // destruidas, que explotan donde se las veía).
  aplicarCambios: function (d) {
    if (!d) { this.activo = false; return; }
    if (!this.activo) this.empezar();
    var fase = this.FASES[d[0]];
    if (fase === 'jugando') {
      var lista = this.enPantalla();
      for (var i = 0; i < lista.length; i++) {
        var a = lista[i];
        if (d[2][a.nave.i] === '0') KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo', null);
      }
    }
    for (var k = 0; k < this.naves.length && k < d[2].length; k++) this.naves[k].viva = d[2][k] === '1';
    this.fase = fase;
  },

  escribirCentrado: function (ctx, letras, texto, y) {
    var g = KF.graficos, e = this.ESCALA_TEXTO;
    g.escribir(ctx, letras, texto, (KF.ANCHO - g.anchoTexto(texto, e)) / 2, y, e);
  },

  dibujar: function (ctx) {
    if (!this.activo) return;
    var lista = this.enPantalla();
    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      KF.graficos.dibujarGirado(ctx, KF.TIPOS_NAVE[a.nave.tipo].sprite, a.x, a.y, a.angulo);
    }
    var medio = (KF.ALTO - KF.graficos.FUENTE_ALTO * this.ESCALA_TEXTO) / 2;
    if (this.fase === 'jugando' && this.t < this.ENTRADA) {
      this.escribirCentrado(ctx, this.LETRAS_TITULO, 'CHALLENGE', medio);
    } else if (this.fase === 'perfecto') {
      this.escribirCentrado(ctx, this.LETRAS_PREMIO, 'PERFECT', medio - 10);
      this.escribirCentrado(ctx, this.LETRAS_PREMIO, 'EXTRA SHIP', medio + 10);
    } else if (this.fase === 'fallido') {
      this.escribirCentrado(ctx, this.LETRAS_FALLO, 'NO BONUS', medio);
    }
  }
};

(function () {
  var d = KF.desafio, g = KF.graficos;
  d.LETRAS_TITULO = g.crearFuente(d.COLOR_TITULO);
  d.LETRAS_PREMIO = g.crearFuente(d.COLOR_PREMIO);
  d.LETRAS_FALLO = g.crearFuente(d.COLOR_FALLO);

  // Camino suave (Catmull-Rom) por una lista de puntos [x, y]; u va de 0 a 1.
  // Empieza y acaba fuera de la pantalla.
  var camino = function (puntos) {
    var n = puntos.length - 1;
    return function (u) {
      var s = Math.min(u * n, n - 1e-6), i = Math.floor(s), t = s - i;
      var p0 = puntos[Math.max(0, i - 1)], p1 = puntos[i], p2 = puntos[i + 1], p3 = puntos[Math.min(n, i + 2)];
      var c = function (k) {
        return 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t +
          (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t);
      };
      return { x: c(0), y: c(1) };
    };
  };
  var espejo = function (puntos) {
    return puntos.map(function (p) { return [KF.ANCHO - p[0], p[1]]; });
  };

  // Entra arriba a la izquierda, da una vuelta en el centro y sale por la derecha.
  var rizo = [[-12, 40], [15, 58], [40, 80], [62, 104], [86, 126], [112, 136], [136, 128],
    [146, 105], [136, 82], [112, 72], [88, 82], [78, 105], [88, 128], [112, 136],
    [140, 138], [168, 128], [194, 108], [216, 84], [236, 62]];
  // Cruza de izquierda a derecha ondulando.
  var onda = [];
  for (var k = 0; k <= 10; k++) onda.push([-12 + k * 24.8, 95 + 40 * Math.sin(k / 10 * 3 * Math.PI)]);
  // Entra por la derecha a media altura, sube en U y sale arriba a la izquierda.
  var gancho = [[236, 170], [204, 176], [172, 172], [144, 158], [124, 136], [114, 110],
    [118, 84], [134, 64], [158, 58], [178, 70], [182, 92], [168, 110], [140, 116],
    [108, 108], [76, 92], [48, 70], [24, 46], [4, 22], [-12, 4]];

  d.GRUPOS = [
    { tipo: 'azul', camino: camino(rizo) },
    { tipo: 'lila', camino: camino(espejo(rizo)) },
    { tipo: 'verde', camino: camino(onda) },
    { tipo: 'roja', camino: camino(gancho) }
  ];
})();

KF.registrar(KF.desafio);
