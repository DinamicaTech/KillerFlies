// Sprites pixel-art definidos en el código. Provisionales: el nodo Gráficos
// los afinará a partir de las capturas.
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

  // Naves alienígenas en formación, con los cañones hacia arriba.
  // C = cuerpo, A = alas, O = ojos.
  MAPA_NAVE: [
    '....C.C....',
    '....C.C....',
    'A..CCCCC..A',
    'AA.COCOC.AA',
    'AAACCCCCAAA',
    '.AACCCCCAA.',
    '..A.CCC.A..',
    '....C.C....'
  ],
  // Nave amarilla (nave nodriza). Y = amarillo, R = rojo.
  MAPA_NODRIZA: [
    '.....R.....',
    '....YRY....',
    '...YYYYY...',
    'Y.YYRYRYY.Y',
    'YYYYYYYYYYY',
    'YY.YYYYY.YY',
    'Y...YYY...Y',
    '....R.R....'
  ]
};
