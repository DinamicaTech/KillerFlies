// La formación: un bloque de naves en una rejilla de 6 filas por 10 columnas
// que se desplaza de un extremo a otro de la pantalla; cada oleada tiene su
// propia forma y mezcla de tipos. Cada nave conserva su hueco para volver a
// él tras un ataque.
KF.formacion = {
  COLUMNAS: 10,
  ANCHO_HUECO: 16,
  ALTO_HUECO: 14,
  ARRIBA: 36, // altura de la primera fila (deja sitio al marcador)

  // Velocidad del vaivén en píxeles por segundo: con el bloque completo,
  // unos 4 segundos de un extremo a otro. Partida la sube con cada oleada.
  VELOCIDAD_INICIAL: 16,

  // Una formación para cada oleada, de arriba abajo en la rejilla de 10
  // columnas por 6 filas. A amarilla, R roja, L lila, B azul, V verde,
  // N naranja, C cian y · hueco vacío. La 1 es la de sources/KillerFlies.txt
  // § 2 (amarillas sobre las rojas 2 y 5, como el arcade); desde la oleada 7
  // se repiten en orden la 2 a la 6. Todas tienen amarillas con rojas cerca
  // para que la escolta pueda soltar el power-up.
  FORMACIONES: [
    { nombre: 'Clásica', filas: [
      '···A··A···',
      '··RRRRRR··',
      '·LLLLLLLL·',
      'BBBBBBBBBB',
      'BBBBBBBBBB',
      'BBBBBBBBBB'] },
    { nombre: 'Uve', filas: [
      '····AA····',
      '···RRRR···',
      '··LLVVLL··',
      '·BBVVVVBB·',
      'BBV····VBB',
      'BV······VB'] },
    { nombre: 'Rombo', filas: [
      '····AA····',
      '···RNNR···',
      '··LRNNRL··',
      '·BLLBBLLB·',
      '··BBNNBB··',
      '····BB····'] },
    { nombre: 'Columnas', filas: [
      '·A······A·',
      'RRR·CC·RRR',
      'LLL·CC·LLL',
      'BBB·CC·BBB',
      'BBB····BBB',
      'BBB····BBB'] },
    { nombre: 'Ajedrez', filas: [
      '··A····A··',
      '·R·R··R·R·',
      'C·V·NN·V·C',
      '·L·L··L·L·',
      'B·V·BB·V·B',
      '·B·N··N·B·'] },
    { nombre: 'Fortaleza', filas: [
      '···A··A···',
      '··RRCCRR··',
      '·NLLLLLLN·',
      'VVBBBBBBVV',
      'CBBNBBNBBC',
      'BBBBBBBBBB'] }
  ],
  LETRAS: { A: 'amarilla', R: 'roja', L: 'lila', B: 'azul', V: 'verde', N: 'naranja', C: 'cian' },

  // La formación que toca a la oleada n (1, 2…).
  formacionDeOleada: function (n) {
    var total = this.FORMACIONES.length;
    var i = n <= total ? n - 1 : 1 + (n - total - 1) % (total - 1);
    return this.FORMACIONES[Math.max(0, i)];
  },

  naves: [],
  x: 0,          // borde izquierdo de la columna 0
  direccion: 1,  // 1 = derecha, -1 = izquierda
  velocidad: 0,

  // Coloca las naves de la formación de la oleada en sus huecos y centra el
  // bloque (inicio de oleada).
  reiniciar: function (velocidad, oleada) {
    var filas = this.formacionDeOleada(oleada || 1).filas;
    this.naves = [];
    for (var f = 0; f < filas.length; f++) {
      for (var c = 0; c < filas[f].length; c++) {
        var tipo = this.LETRAS[filas[f][c]];
        if (!tipo) continue;
        this.naves.push({
          tipo: tipo,
          fila: f,
          columna: c,
          viva: true,
          // false mientras la nave está fuera de su hueco (ataque en picado).
          enFormacion: true
        });
      }
    }
    this.x = (KF.ANCHO - this.COLUMNAS * this.ANCHO_HUECO) / 2;
    this.direccion = 1;
    this.velocidad = velocidad || this.VELOCIDAD_INICIAL;
  },

  // Centro del hueco de una nave en la pantalla, en este instante.
  posicionHueco: function (nave) {
    return {
      x: this.x + (nave.columna + 0.5) * this.ANCHO_HUECO,
      y: this.ARRIBA + nave.fila * this.ALTO_HUECO
    };
  },

  // Tamaño de la zona de impacto de una nave en formación, centrada en su hueco.
  ANCHO_NAVE: 11,
  ALTO_NAVE: 8,

  // Si el rectángulo {x, y, ancho, alto} toca una nave viva en formación, la
  // destruye y la devuelve; si no, devuelve null. Lo usa el disparo del jugador.
  tocar: function (r) {
    for (var i = 0; i < this.naves.length; i++) {
      var n = this.naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = this.posicionHueco(n);
      if (r.x < p.x + this.ANCHO_NAVE / 2 && r.x + r.ancho > p.x - this.ANCHO_NAVE / 2 &&
          r.y < p.y + this.ALTO_NAVE / 2 && r.y + r.alto > p.y - this.ALTO_NAVE / 2) {
        KF.enemigos.destruir(n, p.x, p.y, 'disparo');
        return n;
      }
    }
    return null;
  },

  actualizar: function (dt) {
    // El bloque da la vuelta cuando el hueco más extremo de las naves que
    // quedan vivas toca el borde: al destruir columnas recorre más espacio.
    var min = Infinity, max = -Infinity;
    for (var i = 0; i < this.naves.length; i++) {
      var n = this.naves[i];
      if (!n.viva) continue;
      if (n.columna < min) min = n.columna;
      if (n.columna > max) max = n.columna;
    }
    if (min === Infinity) return;

    this.x += this.direccion * this.velocidad * dt;
    var izquierda = this.x + min * this.ANCHO_HUECO;
    var derecha = this.x + (max + 1) * this.ANCHO_HUECO;
    if (izquierda < 0) {
      this.x -= izquierda;
      this.direccion = 1;
    } else if (derecha > KF.ANCHO) {
      this.x -= derecha - KF.ANCHO;
      this.direccion = -1;
    }
  },

  dibujar: function (ctx) {
    for (var i = 0; i < this.naves.length; i++) {
      var n = this.naves[i];
      if (!n.viva || !n.enFormacion) continue;
      var p = this.posicionHueco(n);
      KF.graficos.dibujar(ctx, KF.TIPOS_NAVE[n.tipo].sprite, p.x, p.y);
    }
  }
};

KF.formacion.reiniciar();
KF.registrar(KF.formacion);
