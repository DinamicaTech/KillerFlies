// Power-ups: al destruir fuera de la formación una amarilla y sus dos rojas
// de escolta, cae una cápsula que parpadea, igual para todos los poderes. Si
// la nave del jugador la recoge, obtiene un poder al azar (todos con la misma
// probabilidad) que dura hasta acabar la oleada; el nuevo sustituye al
// anterior y se pierde si destruyen la nave. Uno de ellos es un power-down.
// El disparo de cada poder lo hace la nave del jugador (js/jugador.js).
KF.powerups = {
  PODERES: [
    'acelerado',     // hasta tres disparos activos en lugar de uno
    'profundo',      // el disparo atraviesa las naves
    'bomba',         // explota al dar en una nave y destruye las de alrededor
    'aniquilacion',  // un solo uso: al disparar se destruyen todas las naves
    'lento',         // power-down: el disparo va a la mitad de velocidad
    'triple'         // tres proyectiles paralelos que cuentan como un disparo
  ],
  RADIO_BOMBA: 27.5,       // círculo de 5 anchos de nave (11 píxeles) de diámetro
  DURACION_ONDA: 0.4,      // segundos que se ve la onda de la explosión
  PARPADEO: 0.15,          // segundos de cada color de la cápsula

  activo: null,            // poder en curso, o null
  capsulas: [],            // {x, y, t}
  ondas: [],               // {x, y, t}: explosiones de la bomba
  naves: null,             // formación de la oleada en la que se obtuvo

  // Sin poder ni cápsulas: al empezar cada oleada y cada partida.
  reiniciar: function () {
    this.activo = null;
    this.capsulas = [];
    this.ondas = [];
    this.naves = KF.formacion.naves;
  },

  soltar: function (x, y) {
    this.capsulas.push({ x: x, y: y, t: 0 });
  },

  // Destruye todas las naves alienígenas vivas, en formación y en picado.
  aniquilar: function () {
    this.activo = null;
    var f = KF.formacion, naves = f.naves;
    var atacantes = KF.ataque.atacantes.slice();
    for (var i = 0; i < atacantes.length; i++) {
      var a = atacantes[i];
      if (a.nave.viva) KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo');
    }
    for (i = 0; i < naves.length; i++) {
      var n = naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = f.posicionHueco(n);
      KF.enemigos.destruir(n, p.x, p.y, 'disparo');
    }
  },

  // Explosión de la bomba en (x, y): destruye las naves que estén total o
  // parcialmente dentro del círculo.
  explotarBomba: function (x, y) {
    var f = KF.formacion, r = this.RADIO_BOMBA;
    var dentro = function (cx, cy) {
      var dx = Math.max(Math.abs(x - cx) - f.ANCHO_NAVE / 2, 0);
      var dy = Math.max(Math.abs(y - cy) - f.ALTO_NAVE / 2, 0);
      return dx * dx + dy * dy <= r * r;
    };
    var atacantes = KF.ataque.atacantes.slice();
    for (var i = 0; i < atacantes.length; i++) {
      var a = atacantes[i];
      if (a.nave.viva && dentro(a.x, a.y)) KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo');
    }
    for (i = 0; i < f.naves.length; i++) {
      var n = f.naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = f.posicionHueco(n);
      if (dentro(p.x, p.y)) KF.enemigos.destruir(n, p.x, p.y, 'disparo');
    }
    this.ondas.push({ x: x, y: y, t: 0 });
  },

  actualizar: function (dt) {
    // Oleada o partida nueva: el poder se acaba.
    if (this.naves !== KF.formacion.naves) this.reiniciar();
    var j = KF.jugador;
    if (j.estado !== 'viva') this.activo = null;

    // Las cápsulas caen como las bombas y se recogen al tocar la nave.
    var vy = KF.ataque.VELOCIDAD_BOMBA * KF.ataque.factorVelocidad;
    var c = j.caja(), s = this.SPRITES_CAPSULA[0];
    var self = this;
    this.capsulas = this.capsulas.filter(function (k) {
      k.t += dt;
      k.y += vy * dt;
      if (c && k.x - s.width / 2 < c.x + c.ancho && k.x + s.width / 2 > c.x &&
          k.y - s.height / 2 < c.y + c.alto && k.y + s.height / 2 > c.y) {
        self.activo = self.PODERES[Math.floor(Math.random() * self.PODERES.length)];
        return false;
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
KF.registrar(KF.powerups);
