// Power-ups: al destruir fuera de la formación una amarilla y sus dos rojas
// de escolta, cae una cápsula que parpadea, igual para todos los poderes. Si
// la nave de un jugador la recoge, obtiene un poder al azar (todos con la misma
// probabilidad) que dura hasta acabar la oleada; el nuevo sustituye al
// anterior y se pierde si destruyen la nave. Uno de ellos es un power-down.
// El poder es de la nave que recoge la cápsula (KF.Nave.poder): en la partida
// a dos, cada jugador tiene el suyo.
// La vida extra no es un poder que dure: suma una nave de recambio al momento
// y deja el poder que hubiera.
// El disparo de cada poder lo hace la nave del jugador (js/jugador.js).
KF.powerups = {
  PODERES: [
    'acelerado',     // hasta tres disparos activos en lugar de uno
    'profundo',      // el disparo atraviesa las naves
    'bomba',         // explota al dar en una nave y destruye las de alrededor
    'aniquilacion',  // un solo uso: al disparar se destruyen todas las naves
    'lento',         // power-down: el disparo va a la mitad de velocidad
    'triple',        // tres proyectiles paralelos que cuentan como un disparo
    'vida'           // vida extra: una nave de recambio más (hasta 5)
  ],
  RADIO_BOMBA: 27.5,       // círculo de 5 anchos de nave (11 píxeles) de diámetro
  DURACION_ONDA: 0.4,      // segundos que se ve la onda de la explosión
  PARPADEO: 0.15,          // segundos de cada color de la cápsula
  FACTOR_CAIDA: 0.5,       // la cápsula cae a la mitad de la velocidad de las bombas

  capsulas: [],            // {id, x, y, t}
  ondas: [],               // {id, x, y, t}: explosiones de la bomba
  naves: null,             // formación de la oleada en la que se obtuvo
  recogidas: 0,            // poderes recibidos desde que empezó el juego (Sonido los observa)

  // Sin poder ni cápsulas: al empezar cada oleada y cada partida.
  reiniciar: function () {
    for (var i = 0; i < KF.jugadores.length; i++) KF.jugadores[i].poder = null;
    this.capsulas = [];
    this.ondas = [];
    this.naves = KF.formacion.naves;
  },

  // La nave del jugador recibe un poder, al recoger una cápsula o por la
  // puerta trasera.
  otorgar: function (poder, jugador) {
    this.recogidas++;
    if (poder === 'vida') KF.partida.sumarRecambio(jugador);
    else jugador.poder = poder;
  },

  soltar: function (x, y) {
    this.capsulas.push({ id: KF.nuevoId(), x: x, y: y, t: 0 });
  },

  // Destruye todas las naves alienígenas vivas, en formación y en picado; los
  // puntos son para la nave del jugador que la ha usado.
  aniquilar: function (autor) {
    autor.poder = null;
    var f = KF.formacion, naves = f.naves;
    var atacantes = KF.ataque.atacantes.slice();
    for (var i = 0; i < atacantes.length; i++) {
      var a = atacantes[i];
      if (a.nave.viva) KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo', autor);
    }
    for (i = 0; i < naves.length; i++) {
      var n = naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = f.posicionHueco(n);
      KF.enemigos.destruir(n, p.x, p.y, 'disparo', autor);
    }
  },

  // Explosión de la bomba en (x, y): destruye las naves que estén total o
  // parcialmente dentro del círculo.
  explotarBomba: function (x, y, autor) {
    var f = KF.formacion, r = this.RADIO_BOMBA;
    var dentro = function (cx, cy) {
      var dx = Math.max(Math.abs(x - cx) - f.ANCHO_NAVE / 2, 0);
      var dy = Math.max(Math.abs(y - cy) - f.ALTO_NAVE / 2, 0);
      return dx * dx + dy * dy <= r * r;
    };
    var atacantes = KF.ataque.atacantes.slice();
    for (var i = 0; i < atacantes.length; i++) {
      var a = atacantes[i];
      if (a.nave.viva && dentro(a.x, a.y)) KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo', autor);
    }
    for (i = 0; i < f.naves.length; i++) {
      var n = f.naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = f.posicionHueco(n);
      if (dentro(p.x, p.y)) KF.enemigos.destruir(n, p.x, p.y, 'disparo', autor);
    }
    this.ondas.push({ id: KF.nuevoId(), x: x, y: y, t: 0 });
  },

  actualizar: function (dt) {
    // En el invitado de una partida a dos, cápsulas y ondas llegan del anfitrión.
    if (KF.red.invitado) return;
    // Oleada o partida nueva: el poder se acaba.
    if (this.naves !== KF.formacion.naves) this.reiniciar();

    // Las cápsulas caen a la mitad de velocidad que las bombas y se recogen
    // al tocar una nave; el poder es para esa nave.
    var vy = KF.ataque.VELOCIDAD_BOMBA * KF.ataque.factorVelocidad * this.FACTOR_CAIDA;
    var s = this.SPRITES_CAPSULA[0];
    var self = this;
    this.capsulas = this.capsulas.filter(function (k) {
      k.t += dt;
      k.y += vy * dt;
      for (var j = 0; j < KF.jugadores.length; j++) {
        var c = KF.jugadores[j].caja();
        if (c && k.x - s.width / 2 < c.x + c.ancho && k.x + s.width / 2 > c.x &&
            k.y - s.height / 2 < c.y + c.alto && k.y + s.height / 2 > c.y) {
          self.otorgar(self.PODERES[Math.floor(Math.random() * self.PODERES.length)], KF.jugadores[j]);
          return false;
        }
      }
      return k.y < KF.ALTO + 8;
    });

    for (var i = 0; i < this.ondas.length; i++) this.ondas[i].t += dt;
    this.ondas = this.ondas.filter(function (o) { return o.t < self.DURACION_ONDA; });
  },

  dibujar: function (ctx) {
    var g = KF.graficos;
    for (var i = 0; i < this.capsulas.length; i++) {
      var k = this.capsulas[i];
      var fase = Math.floor(k.t / this.PARPADEO) % this.SPRITES_CAPSULA.length;
      g.dibujar(ctx, this.SPRITES_CAPSULA[fase], k.x, k.y);
    }
    for (i = 0; i < this.ondas.length; i++) {
      var o = this.ondas[i];
      g.dibujarOnda(ctx, o.x, o.y, this.RADIO_BOMBA, o.t / this.DURACION_ONDA);
    }
  }
};

KF.powerups.SPRITES_CAPSULA = KF.graficos.SPRITES_CAPSULA;
KF.powerups.reiniciar();
KF.ataque.alDestruirEscolta(function (x, y) { KF.powerups.soltar(x, y); });

// Puerta trasera para probar los poderes, solo con teclado: Mayúsculas+1…7
// da el poder de ese número (en el orden de PODERES) con la nave en juego.
window.addEventListener('keydown', function (e) {
  var m = /^Digit([1-7])$/.exec(e.code);
  if (!m || !e.shiftKey || KF.jugador.estado !== 'viva' || KF.red.invitado) return;
  KF.powerups.otorgar(KF.powerups.PODERES[m[1] - 1], KF.jugador);
});
KF.registrar(KF.powerups);
