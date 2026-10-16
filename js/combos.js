// Combos: cada nave alienígena destruida seguida, sin fallar, sube la racha
// del jugador que la destruye (KF.Nave.racha). Las 5 primeras dan sus puntos,
// de la 6.ª a la 10.ª el doble, de la 11.ª a la 15.ª el triple y desde la
// 16.ª el cuádruple. La racha vuelve a cero cuando un disparo sale por arriba
// sin dar a nada (con el triple, si ninguno de sus tres proyectiles da) y
// cuando la nave del jugador explota. Cuenta también en la oleada desafío y
// sigue de una oleada a otra.
// Los puntos ganados, ya multiplicados, flotan donde explota cada nave: suben
// unos píxeles y se desvanecen. En la partida a dos el anfitrión calcula los
// combos y manda los puntos flotantes al invitado (js/red.js).
KF.combos = {
  NAVES_POR_PASO: 5,     // naves seguidas para subir el multiplicador
  MULTIPLICADOR_MAXIMO: 4,
  DURACION: 0.8,         // segundos que flotan los puntos
  SUBIDA: 10,            // píxeles que suben mientras flotan
  COLOR: '#ffffff',

  flotantes: [],         // {id, x, y, t, puntos, numero}: numero del jugador

  // Multiplicador que dará la próxima nave a quien lleva esa racha.
  multiplicador: function (racha) {
    return Math.min(this.MULTIPLICADOR_MAXIMO, 1 + Math.floor(racha / this.NAVES_POR_PASO));
  },

  // Puntos que da una nave a su autor, que suma una más a la racha.
  anotar: function (nave, autor, x, y) {
    // La nave nodriza jefe (js/jefe.js) lleva sus propios puntos.
    var base = nave.puntos || KF.TIPOS_NAVE[nave.tipo].puntos;
    var puntos = base * this.multiplicador(autor.racha);
    autor.racha++;
    autor.puntos += puntos;
    this.flotantes.push({ id: KF.nuevoId(), x: x, y: y, t: 0, puntos: puntos, numero: autor.numero });
  },

  // Un disparo perdido o la nave destruida: la racha vuelve a empezar.
  cortar: function (jugador) {
    jugador.racha = 0;
  },

  actualizar: function (dt) {
    // En el invitado los puntos flotantes llegan del anfitrión.
    if (KF.red.invitado) return;
    var duracion = this.DURACION;
    for (var i = 0; i < this.flotantes.length; i++) this.flotantes[i].t += dt;
    this.flotantes = this.flotantes.filter(function (f) { return f.t < duracion; });
  },

  dibujar: function (ctx) {
    var g = KF.graficos;
    for (var i = 0; i < this.flotantes.length; i++) {
      var f = this.flotantes[i], texto = String(f.puntos);
      var k = Math.min(1, f.t / this.DURACION);
      // Solo a dos van en el color de cada jugador.
      var letras = KF.companero ? this.LETRAS_JUGADOR[f.numero - 1] : this.LETRAS;
      var x = Math.max(0, Math.min(KF.ANCHO - g.anchoTexto(texto), f.x - g.anchoTexto(texto) / 2));
      ctx.globalAlpha = 1 - k * k;
      g.escribir(ctx, letras, texto, x, f.y - g.FUENTE_ALTO / 2 - this.SUBIDA * k);
    }
    ctx.globalAlpha = 1;
  }
};

(function () {
  var c = KF.combos;
  c.LETRAS = KF.graficos.crearFuente(c.COLOR);
  c.LETRAS_JUGADOR = KF.graficos.COLORES_JUGADOR.map(function (col) { return KF.graficos.crearFuente(col); });

  // Cada nave destruida, por disparo o por choque, da sus puntos (con el
  // multiplicador de su racha) al jugador que la ha destruido.
  KF.enemigos.alDestruir(function (nave, motivo, autor, x, y) {
    if (autor) c.anotar(nave, autor, x, y);
  });
})();

KF.registrar(KF.combos);
