// Los cuatro tipos de nave alienígena: puntos y máximo de bombas por ataque.
KF.TIPOS_NAVE = {
  azul:     { puntos: 10, bombas: 2 },
  lila:     { puntos: 20, bombas: 3 },
  roja:     { puntos: 30, bombas: 4 },
  amarilla: { puntos: 50, bombas: 4 }
};

// Cada tipo toma su sprite, ya coloreado, de js/graficos.js.
Object.keys(KF.TIPOS_NAVE).forEach(function (tipo) {
  KF.TIPOS_NAVE[tipo].sprite = KF.graficos.SPRITES_NAVE[tipo];
});

// Destrucción de las naves alienígenas: el único sitio donde muere una nave,
// ya sea por el disparo del jugador o por chocar contra él. Deja una explosión
// corta en su sitio y avisa a quien se haya apuntado con KF.enemigos.alDestruir
// (Marcador sumará los puntos y Sonido lanzará el ruido de explosión).
KF.enemigos = {
  DURACION_FASE: 0.1,  // segundos de cada fase de la explosión

  explosiones: [],     // {x, y, tiempo}
  oyentes: [],

  // fn(nave, motivo) se llama con cada nave destruida; motivo es 'disparo' o
  // 'choque'. Los puntos de la nave están en KF.TIPOS_NAVE[nave.tipo].puntos.
  alDestruir: function (fn) {
    this.oyentes.push(fn);
  },

  destruir: function (nave, x, y, motivo) {
    nave.viva = false;
    this.explosiones.push({ x: x, y: y, tiempo: 0 });
    for (var i = 0; i < this.oyentes.length; i++) this.oyentes[i](nave, motivo);
  },

  actualizar: function (dt) {
    var duracion = this.SPRITES_EXPLOSION.length * this.DURACION_FASE;
    for (var i = 0; i < this.explosiones.length; i++) this.explosiones[i].tiempo += dt;
    this.explosiones = this.explosiones.filter(function (e) { return e.tiempo < duracion; });
  },

  dibujar: function (ctx) {
    for (var i = 0; i < this.explosiones.length; i++) {
      var e = this.explosiones[i];
      var fase = Math.floor(e.tiempo / this.DURACION_FASE);
      KF.graficos.dibujar(ctx, this.SPRITES_EXPLOSION[fase], e.x, e.y);
    }
  }
};

KF.enemigos.SPRITES_EXPLOSION = KF.graficos.SPRITES_EXPLOSION_NAVE;

KF.registrar(KF.enemigos);
