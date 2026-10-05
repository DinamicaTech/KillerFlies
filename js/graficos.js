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

  // Dibuja un sprite centrado en (x, y). Los de alta resolución se colocan
  // al píxel real más cercano y se dibujan suavizados.
  dibujar: function (ctx, sprite, x, y) {
    if (sprite.hd) {
      var r = KF.RESOLUCION;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(sprite.imagen, Math.round((x - sprite.width / 2) * r) / r,
        Math.round((y - sprite.height / 2) * r) / r, sprite.width, sprite.height);
      ctx.imageSmoothingEnabled = false;
      return;
    }
    ctx.drawImage(sprite, Math.round(x - sprite.width / 2), Math.round(y - sprite.height / 2));
  },

  // Dibuja un sprite centrado en (x, y) y girado: angulo en radianes, en
  // sentido horario; 0 es el sprite tal cual está definido.
  dibujarGirado: function (ctx, sprite, x, y, angulo) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angulo);
    if (sprite.hd) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(sprite.imagen, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
    } else {
      ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    }
    ctx.restore();
  },

  // Onda de la explosión de la bomba del jugador: un círculo que se abre
  // hasta el radio dado y se apaga; t va de 0 (inicio) a 1 (fin).
  dibujarOnda: function (ctx, x, y, radio, t) {
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = t < 0.5 ? '#ffff40' : '#ff8020';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, radio * Math.min(1, t * 2)), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },

  // Fuente pixel-art de 5×7 para los textos: cifras, '/', letras y espacio.
  // '#' = píxel encendido.
  FUENTE: {
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
    '/': ['.....', '....#', '...#.', '..#..', '.#...', '#....', '.....'],
    ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
    'A': ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    'D': ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
    'E': ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
    'F': ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
    'G': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
    'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    'I': ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    'J': ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
    'K': ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
    'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
    'N': ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
    'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'P': ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
    'Q': ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
    'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    'S': ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'V': ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    'W': ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
    'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
    'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    'Z': ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####']
  },
  FUENTE_ANCHO: 5,
  FUENTE_ALTO: 7,

  // Las letras de la fuente pintadas de un color: {carácter: lienzo}.
  crearFuente: function (color) {
    var letras = {};
    for (var c in this.FUENTE) letras[c] = this.crearSprite(this.FUENTE[c], { '#': color });
    return letras;
  },

  // Ancho en píxeles de un texto escrito con la fuente, a la escala dada.
  anchoTexto: function (texto, escala) {
    return (texto.length * (this.FUENTE_ANCHO + 1) - 1) * (escala || 1);
  },

  // Escribe un texto con su esquina superior izquierda en (x, y); escala
  // agranda cada píxel (1 si se omite).
  escribir: function (ctx, letras, texto, x, y, escala) {
    escala = escala || 1;
    var paso = (this.FUENTE_ANCHO + 1) * escala;
    for (var i = 0; i < texto.length; i++) {
      var letra = letras[texto[i]];
      if (letra) {
        ctx.drawImage(letra, Math.round(x + i * paso), Math.round(y),
          this.FUENTE_ANCHO * escala, this.FUENTE_ALTO * escala);
      }
    }
  },

  // Sprite de alta resolución: dibujo(ctx) pinta en coordenadas lógicas
  // (0..ancho, 0..alto) sobre un lienzo con KF.RESOLUCION veces más píxeles
  // por lado. Devuelve { imagen, width, height } con el tamaño lógico, que
  // dibujar y dibujarGirado entienden igual que un sprite normal.
  crearSpriteHD: function (ancho, alto, dibujo) {
    var r = KF.RESOLUCION;
    var lienzo = document.createElement('canvas');
    lienzo.width = ancho * r;
    lienzo.height = alto * r;
    var ctx = lienzo.getContext('2d');
    ctx.scale(r, r);
    dibujo(ctx);
    return { imagen: lienzo, width: ancho, height: alto, hd: true };
  },

  // Mezcla un color '#rrggbb' con blanco (t > 0) o con negro (t < 0).
  tono: function (color, t) {
    var n = parseInt(color.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    var destino = t > 0 ? 255 : 0, k = Math.abs(t);
    return 'rgb(' + c.map(function (v) { return Math.round(v + (destino - v) * k); }).join(',') + ')';
  },

  // Degradado metálico de arriba abajo: brillo claro, el color y sombra.
  metal: function (ctx, color, y0, y1) {
    var d = ctx.createLinearGradient(0, y0, 0, y1);
    d.addColorStop(0, this.tono(color, 0.55));
    d.addColorStop(0.45, color);
    d.addColorStop(1, this.tono(color, -0.5));
    return d;
  },

  // Punto luminoso con halo: ojos, luces y puntas de antena.
  luz: function (ctx, x, y, radio, color) {
    var d = ctx.createRadialGradient(x, y, 0, x, y, radio * 2.2);
    d.addColorStop(0, '#ffffff');
    d.addColorStop(0.3, color);
    d.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = d;
    ctx.beginPath();
    ctx.arc(x, y, radio * 2.2, 0, Math.PI * 2);
    ctx.fill();
  },

  // Nave alienígena de 11×9 con los cañones hacia arriba: dos antenas,
  // brazos con las puntas hacia arriba, ojos y alas bajo los brazos.
  // p = { C: cuerpo, O: ojos, A: alas }.
  dibujarNave: function (ctx, p) {
    var g = this;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Alas: dos aletas en flecha bajo los brazos, con el borde iluminado.
    for (var lado = -1; lado <= 1; lado += 2) {
      ctx.save();
      if (lado > 0) { ctx.translate(11, 0); ctx.scale(-1, 1); }
      ctx.beginPath();
      ctx.moveTo(3.6, 4.1);
      ctx.lineTo(0.2, 4.1);
      ctx.lineTo(0.3, 6.6);
      ctx.lineTo(1.6, 8.1);
      ctx.lineTo(2.4, 7.2);
      ctx.lineTo(3.8, 6.9);
      ctx.closePath();
      ctx.fillStyle = g.metal(ctx, p.A, 4, 8);
      ctx.fill();
      ctx.strokeStyle = g.tono(p.A, 0.6);
      ctx.lineWidth = 0.25;
      ctx.stroke();
      // Nervio del ala.
      ctx.beginPath();
      ctx.moveTo(3.2, 4.8);
      ctx.lineTo(1.2, 7.2);
      ctx.strokeStyle = g.tono(p.A, -0.45);
      ctx.lineWidth = 0.3;
      ctx.stroke();
      ctx.restore();
    }
    // Brazos: salen del cuerpo y suben en punta hasta la fila de las antenas.
    ctx.strokeStyle = g.metal(ctx, p.C, 1, 4);
    ctx.lineWidth = 0.95;
    for (var s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(5.5 + s * 1.8, 3.5);
      ctx.lineTo(5.5 + s * 4.3, 3.5);
      ctx.quadraticCurveTo(5.5 + s * 5, 3.4, 5.5 + s * 5, 1.1);
      ctx.stroke();
    }
    // Antenas con la punta encendida.
    ctx.strokeStyle = g.tono(p.C, 0.3);
    ctx.lineWidth = 0.55;
    for (var a = -1; a <= 1; a += 2) {
      ctx.beginPath();
      ctx.moveTo(5.5 + a * 0.7, 2.4);
      ctx.lineTo(5.5 + a * 1.1, 0.6);
      ctx.stroke();
      g.luz(ctx, 5.5 + a * 1.1, 0.55, 0.32, g.tono(p.C, 0.4));
    }
    // Cuerpo: un casco ovalado que se estrecha en una cola puntiaguda.
    ctx.beginPath();
    ctx.moveTo(5.5, 1.7);
    ctx.bezierCurveTo(7.6, 1.7, 8.3, 3.6, 8, 4.7);
    ctx.bezierCurveTo(7.7, 5.9, 6.6, 6.3, 6.4, 7.2);
    ctx.lineTo(5.5, 9);
    ctx.lineTo(4.6, 7.2);
    ctx.bezierCurveTo(4.4, 6.3, 3.3, 5.9, 3, 4.7);
    ctx.bezierCurveTo(2.7, 3.6, 3.4, 1.7, 5.5, 1.7);
    ctx.closePath();
    var cuerpo = ctx.createRadialGradient(4.7, 2.8, 0.2, 5.5, 4.5, 4.5);
    cuerpo.addColorStop(0, g.tono(p.C, 0.7));
    cuerpo.addColorStop(0.35, p.C);
    cuerpo.addColorStop(1, g.tono(p.C, -0.6));
    ctx.fillStyle = cuerpo;
    ctx.fill();
    ctx.strokeStyle = g.tono(p.C, -0.65);
    ctx.lineWidth = 0.2;
    ctx.stroke();
    // Placas del casco: una línea central y una franja oscura bajo los ojos.
    ctx.strokeStyle = g.tono(p.C, -0.35);
    ctx.lineWidth = 0.18;
    ctx.beginPath();
    ctx.moveTo(5.5, 4.4);
    ctx.lineTo(5.5, 8.2);
    ctx.moveTo(3.6, 5.1);
    ctx.quadraticCurveTo(5.5, 5.9, 7.4, 5.1);
    ctx.stroke();
    // Ojos luminosos.
    g.luz(ctx, 4.5, 3.5, 0.42, p.O);
    g.luz(ctx, 6.5, 3.5, 0.42, p.O);
    ctx.fillStyle = p.O;
    ctx.beginPath();
    ctx.arc(4.5, 3.5, 0.42, 0, Math.PI * 2);
    ctx.arc(6.5, 3.5, 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4.35, 3.35, 0.14, 0, Math.PI * 2);
    ctx.arc(6.35, 3.35, 0.14, 0, Math.PI * 2);
    ctx.fill();
  },

  // Nave amarilla (nave nodriza) de 11×10: cúpula naranja, cuerpo amarillo
  // con bordes blancos, alas azul oscuro a los lados y cola amarilla.
  // p = { N: naranja, Y: amarillo, W: blanco, A: alas }.
  dibujarNodriza: function (ctx, p) {
    var g = this;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Alas: dos aletas verticales en los costados.
    for (var lado = 0; lado < 2; lado++) {
      ctx.save();
      if (lado) { ctx.translate(11, 0); ctx.scale(-1, 1); }
      ctx.beginPath();
      ctx.moveTo(1.3, 2.3);
      ctx.lineTo(0.1, 3.4);
      ctx.lineTo(0.1, 5.9);
      ctx.lineTo(1.2, 7);
      ctx.lineTo(1.7, 6.3);
      ctx.lineTo(1.3, 5.2);
      ctx.lineTo(1.6, 3.2);
      ctx.closePath();
      ctx.fillStyle = g.metal(ctx, p.A, 2.3, 7);
      ctx.fill();
      ctx.strokeStyle = g.tono(p.A, 0.55);
      ctx.lineWidth = 0.22;
      ctx.stroke();
      ctx.restore();
    }
    // Cola: un aguijón amarillo que baja hasta la última fila.
    ctx.beginPath();
    ctx.moveTo(4.4, 6);
    ctx.lineTo(6.6, 6);
    ctx.lineTo(5.9, 7.2);
    ctx.lineTo(5.5, 10);
    ctx.lineTo(5.1, 7.2);
    ctx.closePath();
    ctx.fillStyle = g.metal(ctx, p.Y, 6, 10);
    ctx.fill();
    // Cuerpo: casco ancho amarillo con ribete blanco.
    ctx.beginPath();
    ctx.moveTo(1.4, 3.1);
    ctx.lineTo(9.6, 3.1);
    ctx.bezierCurveTo(9.9, 4.4, 9.2, 5.6, 7.6, 6.3);
    ctx.lineTo(3.4, 6.3);
    ctx.bezierCurveTo(1.8, 5.6, 1.1, 4.4, 1.4, 3.1);
    ctx.closePath();
    ctx.fillStyle = g.metal(ctx, p.Y, 3, 6.4);
    ctx.fill();
    ctx.strokeStyle = p.W;
    ctx.lineWidth = 0.4;
    ctx.stroke();
    // Luces de posición en el casco.
    g.luz(ctx, 3.3, 4.4, 0.25, g.tono(p.N, 0.3));
    g.luz(ctx, 7.7, 4.4, 0.25, g.tono(p.N, 0.3));
    // Cúpula: burbuja naranja con reflejo, sobre el casco.
    ctx.beginPath();
    ctx.moveTo(2.6, 3.6);
    ctx.bezierCurveTo(2.8, 1.6, 4.3, 0.6, 5.5, 0);
    ctx.bezierCurveTo(6.7, 0.6, 8.2, 1.6, 8.4, 3.6);
    ctx.closePath();
    var cupula = ctx.createRadialGradient(4.6, 1.6, 0.1, 5.5, 2.8, 3.4);
    cupula.addColorStop(0, g.tono(p.N, 0.75));
    cupula.addColorStop(0.4, p.N);
    cupula.addColorStop(1, g.tono(p.N, -0.55));
    ctx.fillStyle = cupula;
    ctx.fill();
    ctx.strokeStyle = g.tono(p.N, -0.5);
    ctx.lineWidth = 0.2;
    ctx.stroke();
    // Ojos de la cúpula.
    g.luz(ctx, 4.6, 3, 0.3, p.Y);
    g.luz(ctx, 6.4, 3, 0.3, p.Y);
    // Reflejo en la cúpula.
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(3.8, 2.3);
    ctx.quadraticCurveTo(4.3, 1.2, 5.3, 0.8);
    ctx.stroke();
  },

  // Nave del jugador de 13×13 con el cañón hacia arriba: morro rojo y tres
  // columnas blancas rellenas de celeste unidas por travesaños.
  // p = { R: rojo, W: blanco, C: celeste }.
  dibujarJugador: function (ctx, p) {
    var g = this;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Travesaños entre las columnas.
    ctx.strokeStyle = g.metal(ctx, p.W, 6, 9);
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(2.5, 6.5); ctx.lineTo(10.5, 6.5);
    ctx.moveTo(2.5, 8.5); ctx.lineTo(10.5, 8.5);
    ctx.stroke();
    // Columnas: un fuselaje central y dos motores laterales, de casco blanco
    // con el interior celeste encendido.
    var columnas = [[2.5, 4.3, 12.9], [6.5, 3.6, 11.6], [10.5, 4.3, 12.9]];
    for (var i = 0; i < 3; i++) {
      var x = columnas[i][0], y0 = columnas[i][1], y1 = columnas[i][2];
      var ancho = i === 1 ? 1.75 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x - ancho, y0 + 1);
      ctx.quadraticCurveTo(x - ancho, y0, x, y0);
      ctx.quadraticCurveTo(x + ancho, y0, x + ancho, y0 + 1);
      ctx.lineTo(x + ancho * 0.8, y1);
      ctx.lineTo(x - ancho * 0.8, y1);
      ctx.closePath();
      var casco = ctx.createLinearGradient(x - ancho, 0, x + ancho, 0);
      casco.addColorStop(0, g.tono(p.W, -0.35));
      casco.addColorStop(0.35, p.W);
      casco.addColorStop(1, g.tono(p.W, -0.45));
      ctx.fillStyle = casco;
      ctx.fill();
      // Interior celeste que brilla en el centro.
      ctx.beginPath();
      ctx.moveTo(x - ancho * 0.45, y0 + 1.4);
      ctx.lineTo(x + ancho * 0.45, y0 + 1.4);
      ctx.lineTo(x + ancho * 0.35, y1 - 1);
      ctx.lineTo(x - ancho * 0.35, y1 - 1);
      ctx.closePath();
      var nucleo = ctx.createLinearGradient(x - ancho * 0.45, 0, x + ancho * 0.45, 0);
      nucleo.addColorStop(0, g.tono(p.C, -0.45));
      nucleo.addColorStop(0.5, g.tono(p.C, 0.25));
      nucleo.addColorStop(1, g.tono(p.C, -0.45));
      ctx.fillStyle = nucleo;
      ctx.fill();
      // Tobera encendida al pie de cada columna.
      g.luz(ctx, x, y1 - 0.4, 0.35, p.C);
    }
    // Morro: una cabina roja en flecha sobre el fuselaje, con su reflejo.
    ctx.beginPath();
    ctx.moveTo(6.5, 0);
    ctx.bezierCurveTo(7.4, 1.2, 10, 2.9, 10.6, 4.9);
    ctx.quadraticCurveTo(6.5, 4.1, 2.4, 4.9);
    ctx.bezierCurveTo(3, 2.9, 5.6, 1.2, 6.5, 0);
    ctx.closePath();
    var morro = ctx.createRadialGradient(5.8, 1.6, 0.1, 6.5, 2.8, 3.8);
    morro.addColorStop(0, g.tono(p.R, 0.65));
    morro.addColorStop(0.4, p.R);
    morro.addColorStop(1, g.tono(p.R, -0.55));
    ctx.fillStyle = morro;
    ctx.fill();
    ctx.strokeStyle = g.tono(p.R, -0.6);
    ctx.lineWidth = 0.2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(5.2, 2.6);
    ctx.quadraticCurveTo(5.7, 1.5, 6.4, 1.0);
    ctx.stroke();
  },

  // Colores de cada tipo de nave alienígena, tomados de las capturas.
  PALETAS_NAVE: {
    azul:     { C: '#40d0c8', O: '#203080', A: '#2028e0' },
    lila:     { C: '#b028e0', O: '#ffffff', A: '#7020c0' },
    roja:     { C: '#f02020', O: '#ffd8a0', A: '#3088e8' },
    amarilla: { N: '#f07818', Y: '#f8e830', W: '#ffffff', A: '#1820c0' },
    // Tipos que aparecen a partir de la oleada 2.
    verde:    { C: '#30e040', O: '#ffffff', A: '#108020' },
    naranja:  { C: '#ff8c18', O: '#202020', A: '#c03010' },
    cian:     { C: '#60ffff', O: '#202020', A: '#e020a0' }
  },

  // Disparo del jugador: línea amarilla. Y = amarillo.
  MAPA_DISPARO: [
    'Y',
    'Y',
    'Y',
    'Y'
  ],
  // Destello en la punta del cañón al disparar: estrella blanca con centro
  // amarillo, la fila de abajo toca el cañón. W = blanco, Y = amarillo.
  MAPA_DESTELLO: [
    'W.W.W',
    '.WYW.',
    '..Y..'
  ],
  // Llama del motor bajo la nave del jugador mientras se mueve: dos formas
  // que se alternan para que parpadee; la fila de arriba toca la nave.
  // O = naranja, Y = amarillo.
  MAPAS_LLAMA: [
    [
      'OOO',
      '.O.',
      '.Y.'
    ],
    [
      'OYO',
      '.Y.',
      '...'
    ]
  ],
  // Bomba que dispara el jugador con el power-up bomba: un rombo de 3×3.
  // O = naranja, Y = amarillo.
  MAPA_BOMBA_JUGADOR: [
    '.O.',
    'OYO',
    '.O.'
  ],
  // Cápsula de power-up: igual para todos los poderes. Parpadea alternando
  // dos paletas. C = cuerpo, B = brillo, L = franja central.
  MAPA_CAPSULA: [
    '.CCC.',
    'CBCCC',
    'CBCCC',
    'LLLLL',
    'CCCCC',
    'CCCCC',
    '.CCC.'
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
  ]
};

// Fondo de estrellas: puntos de colores que bajan despacio y parpadean,
// como en el arcade. Se registra antes que las demás partes, así que se
// dibuja detrás de todo.
KF.graficos.fondo = {
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
    g.SPRITES_NAVE[tipo] = tipo === 'amarilla'
      ? g.crearSpriteHD(11, 10, function (ctx) { g.dibujarNodriza(ctx, g.PALETAS_NAVE.amarilla); })
      : g.crearSpriteHD(11, 9, (function (p) { return function (ctx) { g.dibujarNave(ctx, p); }; })(g.PALETAS_NAVE[tipo]));
  }
  var fuego = { R: '#f02828', Y: '#ffff40', B: '#ffffff', C: '#40d0e0' };
  g.SPRITE_JUGADOR = g.crearSpriteHD(13, 13, function (ctx) {
    g.dibujarJugador(ctx, { R: '#f02020', W: '#e8f0f8', C: '#30c0d0' });
  });
  g.SPRITE_DISPARO = g.crearSprite(g.MAPA_DISPARO, { Y: '#ffff40' });
  g.SPRITE_DESTELLO = g.crearSprite(g.MAPA_DESTELLO, { W: '#ffffff', Y: '#ffff40' });
  g.SPRITES_LLAMA = g.MAPAS_LLAMA.map(function (m) { return g.crearSprite(m, { O: '#ff8020', Y: '#ffff40' }); });
  g.SPRITE_BOMBA = g.crearSprite(g.MAPA_BOMBA, { B: '#ffffff' });
  g.SPRITE_BOMBA_JUGADOR = g.crearSprite(g.MAPA_BOMBA_JUGADOR, { O: '#ff8020', Y: '#ffff40' });
  g.SPRITES_CAPSULA = [
    g.crearSprite(g.MAPA_CAPSULA, { C: '#30c0ff', B: '#ffffff', L: '#ffff40' }),
    g.crearSprite(g.MAPA_CAPSULA, { C: '#ff40c0', B: '#ffffff', L: '#ffffff' })
  ];
  // Colores de los fragmentos que lanza la explosión del jugador.
  g.COLORES_FRAGMENTOS = [fuego.R, fuego.Y, fuego.B, fuego.C];
  g.SPRITES_EXPLOSION_JUGADOR = g.MAPAS_EXPLOSION_JUGADOR.map(function (m) { return g.crearSprite(m, fuego); });
  g.SPRITES_EXPLOSION_NAVE = g.MAPAS_EXPLOSION_NAVE.map(function (m) { return g.crearSprite(m, fuego); });
  g.fondo.crearEstrellas();
})();

KF.registrar(KF.graficos.fondo);
