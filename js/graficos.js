// Aspecto visual del juego: fondo de estrellas y sprites pixel-art definidos
// en el código, dibujados a partir de las capturas del arcade
// (sources/KF1.JPG y sources/KF2.JPG).
KF.graficos = {
  // Convierte un mapa de caracteres en un lienzo; cada carácter es un color
  // de la paleta y '.' es transparente.
  crearSprite: function (mapa, paleta) {
    var lienzo = document.createElement('canvas');
    lienzo.width = mapa[0].length;
    lienzo.height = mapa.length;
    var ctx = lienzo.getContext('2d');
    for (var y = 0; y < mapa.length; y++) {
      for (var x = 0; x < mapa[y].length; x++) {
        var color = paleta[mapa[y][x]];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return lienzo;
  },

  // Dibuja un sprite centrado en (x, y).
  dibujar: function (ctx, sprite, x, y) {
    ctx.drawImage(sprite, Math.round(x - sprite.width / 2), Math.round(y - sprite.height / 2));
  },

  // Dibuja un sprite centrado en (x, y) y girado: angulo en radianes, en
  // sentido horario; 0 es el sprite tal cual está definido.
  dibujarGirado: function (ctx, sprite, x, y, angulo) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angulo);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
  },

  // Naves alienígenas en formación, con los cañones hacia arriba: dos
  // antenas, brazos con las puntas hacia arriba, ojos y alas bajo los brazos.
  // C = cuerpo, O = ojos, A = alas.
  MAPA_NAVE: [
    '....C.C....',
    'C...C.C...C',
    'C..CCCCC..C',
    'CCCCOCOCCCC',
    'AA.CCCCC.AA',
    'AAACCCCCAAA',
    'AAA.CCC.AAA',
    '.A..CCC..A.',
    '.....C.....'
  ],
  // Nave amarilla (nave nodriza): cúpula naranja, cuerpo amarillo con bordes
  // blancos, alas azul oscuro a los lados y cola amarilla.
  // N = naranja, Y = amarillo, W = blanco, A = alas.
  MAPA_NODRIZA: [
    '.....N.....',
    '....NNN....',
    '.A.NNNNN.A.',
    'AWYYNYNYYWA',
    'AWYYYYYYYWA',
    'A.WYYYYYW.A',
    '.A..YYY..A.',
    '.....Y.....',
    '.....Y.....',
    '.....Y.....'
  ],
  // Colores de cada tipo de nave alienígena, tomados de las capturas.
  PALETAS_NAVE: {
    azul:     { C: '#40d0c8', O: '#203080', A: '#2028e0' },
    lila:     { C: '#b028e0', O: '#ffffff', A: '#7020c0' },
    roja:     { C: '#f02020', O: '#ffd8a0', A: '#3088e8' },
    amarilla: { N: '#f07818', Y: '#f8e830', W: '#ffffff', A: '#1820c0' }
  },

  // Nave del jugador, con el cañón hacia arriba: cúpula roja y tres columnas
  // blancas rellenas de celeste unidas por travesaños.
  // R = rojo, W = blanco, C = celeste.
  MAPA_JUGADOR: [
    '......R......',
    '.....RRR.....',
    '....RRRRR....',
    '...RRRRRRR...',
    '..W..W.W..W..',
    '.WCW.WCW.WCW.',
    '.WCWCWCWCWCW.',
    '.WCCCWCWCCCW.',
    '.WCWCWCWCWCW.',
    '.WCW.WCW.WCW.',
    '.WCW.WCW.WCW.',
    '..W..W.W..W..',
    '..W.......W..'
  ],
  // Disparo del jugador: línea amarilla. Y = amarillo.
  MAPA_DISPARO: [
    'Y',
    'Y',
    'Y',
    'Y'
  ],
  // Bomba de las naves alienígenas: línea blanca vertical algo gruesa. B = blanco.
  MAPA_BOMBA: [
    'BB',
    'BB',
    'BB',
    'BB',
    'BB',
    'BB'
  ],
  // Explosión de la nave del jugador, en tres fases.
  // R = rojo, Y = amarillo, B = blanco, C = celeste (restos de la nave).
  MAPAS_EXPLOSION_JUGADOR: [
    [
      '.............',
      '.............',
      '.............',
      '.....R.R.....',
      '......Y......',
      '....RYBYR....',
      '......Y......',
      '.....R.R.....',
      '.............',
      '.............',
      '.............'
    ],
    [
      '.............',
      '..R.......R..',
      '....R.Y.R....',
      '.....YBY.....',
      '..R.YBBBY.R..',
      '...YBBBBBY...',
      '..R.YBBBY.R..',
      '.....YBY.....',
      '....R.Y.R....',
      '..R.......R..',
      '.............'
    ],
    [
      'R.....R.....R',
      '...Y.....C...',
      '.R....Y....R.',
      '..C.R...R....',
      '..Y.......Y..',
      'R..Y.....Y..R',
      '..Y.......Y..',
      '....R...R.C..',
      '.R....Y....R.',
      '...C.....Y...',
      'R.....R.....R'
    ]
  ],
  // Explosión de una nave alienígena, en cuatro fases: un destello que se
  // abre en un anillo de chispas. B = blanco, Y = amarillo, R = rojo.
  MAPAS_EXPLOSION_NAVE: [
    [
      '...........',
      '...........',
      '...........',
      '...........',
      '.....Y.....',
      '....YBY....',
      '.....Y.....',
      '...........',
      '...........',
      '...........',
      '...........'
    ],
    [
      '...........',
      '...........',
      '...R...R...',
      '.....Y.....',
      '....YBY....',
      '...YBBBY...',
      '....YBY....',
      '.....Y.....',
      '...R...R...',
      '...........',
      '...........'
    ],
    [
      '...........',
      '..R..Y..R..',
      '...Y...Y...',
      '....R.R....',
      '.Y..BYB..Y.',
      '....YBY....',
      '.Y..BYB..Y.',
      '....R.R....',
      '...Y...Y...',
      '..R..Y..R..',
      '...........'
    ],
    [
      'R....Y....R',
      '...........',
      '..R.....R..',
      '...........',
      '...........',
      'Y.........Y',
      '...........',
      '...........',
      '..R.....R..',
      '...........',
      'R....Y....R'
    ]
  ],

  // Fondo de estrellas: puntos de colores que bajan despacio y parpadean,
  // como en el arcade. Se dibuja antes que todo lo demás.
  NUM_ESTRELLAS: 70,
  VELOCIDAD_ESTRELLAS: 12, // píxeles por segundo
  COLORES_ESTRELLAS: ['#ffffff', '#ffffff', '#ffffff', '#f0f040', '#40e0ff', '#ff4040', '#60ff60', '#ff60ff', '#6070ff'],
  estrellas: [],

  crearEstrellas: function () {
    this.estrellas = [];
    for (var i = 0; i < this.NUM_ESTRELLAS; i++) {
      this.estrellas.push({
        x: Math.floor(Math.random() * KF.ANCHO),
        y: Math.random() * KF.ALTO,
        color: this.COLORES_ESTRELLAS[Math.floor(Math.random() * this.COLORES_ESTRELLAS.length)],
        // Cada estrella se apaga y se enciende con su propio ritmo.
        periodo: 0.6 + Math.random() * 1.4,
        fase: Math.random()
      });
    }
  },

  actualizar: function (dt) {
    for (var i = 0; i < this.estrellas.length; i++) {
      var e = this.estrellas[i];
      e.y += this.VELOCIDAD_ESTRELLAS * dt;
      if (e.y >= KF.ALTO) {
        e.y -= KF.ALTO;
        e.x = Math.floor(Math.random() * KF.ANCHO);
      }
      e.fase = (e.fase + dt / e.periodo) % 1;
    }
  },

  dibujar: function (ctx) {
    for (var i = 0; i < this.estrellas.length; i++) {
      var e = this.estrellas[i];
      // Encendida tres cuartas partes de su ciclo.
      if (e.fase < 0.75) {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, Math.floor(e.y), 1, 1);
      }
    }
  }
};

// Sprites ya coloreados que usan las demás partes del juego.
(function () {
  var g = KF.graficos;
  g.SPRITES_NAVE = {};
  for (var tipo in g.PALETAS_NAVE) {
    g.SPRITES_NAVE[tipo] = g.crearSprite(tipo === 'amarilla' ? g.MAPA_NODRIZA : g.MAPA_NAVE, g.PALETAS_NAVE[tipo]);
  }
  var fuego = { R: '#f02828', Y: '#ffff40', B: '#ffffff', C: '#40d0e0' };
  g.SPRITE_JUGADOR = g.crearSprite(g.MAPA_JUGADOR, { R: '#f02020', W: '#e8f0f8', C: '#30c0d0' });
  g.SPRITE_DISPARO = g.crearSprite(g.MAPA_DISPARO, { Y: '#ffff40' });
  g.SPRITE_BOMBA = g.crearSprite(g.MAPA_BOMBA, { B: '#ffffff' });
  g.SPRITES_EXPLOSION_JUGADOR = g.MAPAS_EXPLOSION_JUGADOR.map(function (m) { return g.crearSprite(m, fuego); });
  g.SPRITES_EXPLOSION_NAVE = g.MAPAS_EXPLOSION_NAVE.map(function (m) { return g.crearSprite(m, fuego); });
  g.crearEstrellas();
})();

KF.registrar(KF.graficos);
