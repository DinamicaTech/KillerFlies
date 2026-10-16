// Niveles de dificultad (partida/dificultad): EASY, NORMAL o HARD, elegido en
// el menú de inicio con las flechas izquierda y derecha o tocando su línea, y
// recordado en el navegador. NORMAL es el juego de siempre; EASY va todo un
// 25% más lento (bloque, picados, bombas, nave nodriza) con un atacante menos
// a la vez y los ataques más espaciados, y HARD un 25% más rápido con uno más
// y más seguidos. En la partida a dos manda el nivel del anfitrión.
KF.dificultad = {
  NIVELES: ['EASY', 'NORMAL', 'HARD'],
  VELOCIDAD: [0.75, 1, 1.25],    // multiplica la velocidad de cada oleada
  ATAQUES: [-1, 0, 1],           // atacantes a la vez de menos o de más
  PAUSA: [1.3, 1, 0.75],         // multiplica los segundos entre ataques
  NORMAL: 1,
  CLAVE: 'killerflies.dificultad',

  elegido: 1,              // el nivel marcado en el menú
  nivel: 1,                // el nivel de la partida en curso (en el invitado, el del anfitrión)

  factorVelocidad: function () { return this.VELOCIDAD[this.nivel]; },
  ataquesDeMas: function () { return this.ATAQUES[this.nivel]; },
  factorPausa: function () { return this.PAUSA[this.nivel]; },

  // Texto de la línea del menú, p. ej. '< NORMAL >'.
  texto: function () { return '< ' + this.NIVELES[this.elegido] + ' >'; },

  // Cambia el nivel marcado (paso -1 o +1, dando la vuelta) y lo guarda.
  cambiar: function (paso) {
    var n = this.NIVELES.length;
    this.elegido = (this.elegido + paso + n) % n;
    try {
      window.localStorage.setItem(this.CLAVE, this.NIVELES[this.elegido]);
    } catch (e) { /* sin almacenamiento: dura solo la sesión */ }
  },

  // El nivel guardado, o NORMAL si no hay ninguno (o no hay almacenamiento).
  leer: function () {
    try {
      var i = this.NIVELES.indexOf(window.localStorage.getItem(this.CLAVE));
      return i >= 0 ? i : this.NORMAL;
    } catch (e) {
      return this.NORMAL;
    }
  }
};

KF.dificultad.elegido = KF.dificultad.nivel = KF.dificultad.leer();
