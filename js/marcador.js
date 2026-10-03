// El marcador: oleada/oleada máxima arriba a la izquierda, puntos/puntos
// máximos arriba a la derecha y las naves de recambio abajo a la derecha.
// Los máximos se guardan en el navegador (localStorage) en cuanto se superan.
// Partida decide la oleada en curso, las naves de recambio y cuándo empiezan
// los puntos de cero; el marcador solo los muestra.
KF.marcador = {
  MARGEN: 4,            // píxeles desde el borde de la pantalla
  COLOR: '#ffffff',
  CLAVE_OLEADA: 'killerflies.oleadaMaxima',
  CLAVE_PUNTOS: 'killerflies.puntosMaximos',

  oleada: 1,
  oleadaMaxima: 1,
  puntos: 0,
  puntosMaximos: 0,
  recambio: 2,          // naves de recambio que quedan (sin contar la que juega)

  // Suma los puntos de una nave destruida.
  sumarPuntos: function (n) {
    this.puntos += n;
    if (this.puntos > this.puntosMaximos) {
      this.puntosMaximos = this.puntos;
      this.guardar(this.CLAVE_PUNTOS, this.puntosMaximos);
    }
  },

  // Al empezar cada partida.
  reiniciarPuntos: function () {
    this.puntos = 0;
  },

  ponerOleada: function (n) {
    this.oleada = n;
    if (this.oleada > this.oleadaMaxima) {
      this.oleadaMaxima = this.oleada;
      this.guardar(this.CLAVE_OLEADA, this.oleadaMaxima);
    }
  },

  ponerRecambio: function (n) {
    this.recambio = n;
  },

  // El almacenamiento puede no estar disponible (navegación privada, ficheros
  // locales en algunos navegadores): entonces los máximos duran solo la sesión.
  leer: function (clave) {
    try {
      var v = parseInt(window.localStorage.getItem(clave), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  },

  guardar: function (clave, valor) {
    try {
      window.localStorage.setItem(clave, String(valor));
    } catch (e) { /* sin almacenamiento: no se guarda */ }
  },

  // Ancho en píxeles de un texto con la fuente del marcador.
  anchoTexto: function (texto) {
    return texto.length * (this.FUENTE_ANCHO + 1) - 1;
  },

  escribir: function (ctx, texto, x, y) {
    for (var i = 0; i < texto.length; i++) {
      var letra = this.LETRAS[texto[i]];
      if (letra) ctx.drawImage(letra, x + i * (this.FUENTE_ANCHO + 1), y);
    }
  },

  dibujar: function (ctx) {
    var m = this.MARGEN;
    this.escribir(ctx, this.oleada + '/' + this.oleadaMaxima, m, m);
    var puntos = this.puntos + '/' + this.puntosMaximos;
    this.escribir(ctx, puntos, KF.ANCHO - m - this.anchoTexto(puntos), m);

    // Naves de recambio, de derecha a izquierda, pegadas al borde inferior.
    var s = KF.jugador.SPRITE;
    for (var i = 0; i < this.recambio; i++) {
      var x = KF.ANCHO - m - s.width / 2 - i * (s.width + 2);
      KF.graficos.dibujar(ctx, s, x, KF.ALTO - 1 - s.height / 2);
    }
  }
};

(function () {
  var mk = KF.marcador;
  // Fuente pixel-art de 5×7 para las cifras y la barra. '#' = píxel encendido.
  var FUENTE = {
    '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
    '3': ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
    '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
    '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
    '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
    '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
    '/': ['.....', '....#', '...#.', '..#..', '.#...', '#....', '.....']
  };
  mk.FUENTE_ANCHO = 5;
  mk.LETRAS = {};
  for (var c in FUENTE) {
    mk.LETRAS[c] = KF.graficos.crearSprite(FUENTE[c], { '#': mk.COLOR });
  }
  mk.oleadaMaxima = Math.max(1, mk.leer(mk.CLAVE_OLEADA));
  mk.puntosMaximos = mk.leer(mk.CLAVE_PUNTOS);
})();

// Se registra el último para dibujarse encima de todo.
KF.registrar(KF.marcador);
