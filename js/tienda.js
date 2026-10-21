// La tienda de mejoras (mejoras): la opción SHOP de la pausa (js/pausa.js),
// solo en la partida a uno. Al elegirla aparece una tienda junto a la nave y
// un piloto sale de ella y anda hasta la tienda; entonces se abre la lista de
// mejoras con el saldo de monedas (js/monedas.js) de la dificultad en curso.
// Las flechas arriba y abajo cambian de mejora y Enter o espacio (al
// soltarlos) la compran; en la pantalla táctil, tocar una mejora la compra.
// BACK devuelve el piloto a la nave y vuelve al menú de la pausa; P (o
// cualquier cosa que acabe la pausa) cierra la tienda al momento.
// Las mejoras son permanentes y valen para la dificultad con cuyas monedas se
// compraron, en la partida a uno; se notan desde la compra, salvo SHIPS, que
// da una nave de recambio más al empezar cada partida, hasta el tope de 5 (3
// niveles). Las demás acumulables no tienen tope: el equilibrio se hace con
// los precios.
KF.tienda = {
  MEJORAS: [
    { id: 'SPEED',    precio: 5 },              // +5% de velocidad de la nave por nivel
    { id: 'FIRE',     precio: 5 },              // +5% de velocidad del disparo por nivel
    { id: 'SHIPS',    precio: 15, maximo: 3, niveles: true },  // una nave de recambio más al empezar, hasta el tope de 5
    { id: 'BOMBS',    precio: 5 },              // bombas enemigas un 5% más lentas por nivel
    { id: 'MAGNET',   precio: 10, maximo: 1 },  // monedas y cápsulas van hacia la nave
    { id: 'RED SLOW', precio: 3, maximo: 1 }    // la cápsula del slow fire cae en roja
  ],
  AUMENTO: 0.05,           // SPEED y FIRE: +5% por nivel, sumados
  BOMBAS: 0.95,            // BOMBS: cada nivel deja las bombas al 95% de su velocidad
  DURACION_PASEO: 1.5,     // segundos que tarda el piloto entre la nave y la tienda
  DISTANCIA_TIENDA: 40,    // píxeles de la nave a la tienda
  DURACION_PASO: 0.15,     // segundos de cada paso del piloto
  DURACION_AVISO: 2,       // segundos que se ve el aviso de una compra
  SEPARACION: 12,          // píxeles entre una fila de la lista y la siguiente
  COLOR: '#ffff40',
  COLOR_OPCION: '#808080',
  COLOR_MONEDAS: '#ffd030',
  enPausa: true,           // se mueve con la partida en pausa

  fase: null,              // null (cerrada) | 'ida' | 'lista' | 'vuelta'
  t: 0,                    // segundos en la fase
  opcion: 0,               // fila marcada: una mejora o, la última, BACK
  aviso: '',
  tiempoAviso: 0,
  teclaElegir: null,
  xNave: 0,                // dónde estaba la nave al abrir la tienda
  xTienda: 0,

  // Nivel comprado de una mejora en la dificultad en curso; en la partida a
  // dos las mejoras no cuentan (mejoras/dos-jugadores).
  nivel: function (id) {
    if (KF.companero) return 0;
    return KF.monedas.delNivel().mejoras[id] || 0;
  },

  factorVelocidad: function () { return 1 + this.AUMENTO * this.nivel('SPEED'); },
  factorDisparo: function () { return 1 + this.AUMENTO * this.nivel('FIRE'); },
  factorBombas: function () { return Math.pow(this.BOMBAS, this.nivel('BOMBS')); },

  abierta: function () { return this.fase !== null; },

  // Desde la pausa: la tienda aparece al lado de la nave, donde haya sitio.
  abrir: function () {
    if (KF.companero || this.abierta()) return;
    this.xNave = KF.jugador.estado === 'viva' ? KF.jugador.x : KF.ANCHO / 2;
    this.xTienda = this.xNave + (this.xNave < KF.ANCHO / 2 ? 1 : -1) * this.DISTANCIA_TIENDA;
    this.fase = 'ida';
    this.t = 0;
    this.opcion = 0;
    this.aviso = '';
    this.teclaElegir = null;
  },

  // BACK: el piloto vuelve a la nave y después se ve otra vez la pausa.
  volver: function () {
    if (this.fase !== 'lista') return;
    this.fase = 'vuelta';
    this.t = 0;
  },

  // Al acabar la pausa la tienda se cierra sin más.
  cerrar: function () {
    this.fase = null;
    this.teclaElegir = null;
  },

  // Precio y texto de la fila de una mejora: 'SPEED    LV 2    5'.
  textoMejora: function (m) {
    var nivel = this.nivel(m.id);
    var lleno = m.maximo && nivel >= m.maximo;
    var precio = lleno ? (m.niveles ? 'MAX' : 'OWNED') : String(m.precio);
    var lv = m.maximo && !m.niveles ? '' : 'LV ' + nivel;
    var relleno = function (t, n) { while (t.length < n) t += ' '; return t; };
    var derecha = function (t, n) { while (t.length < n) t = ' ' + t; return t; };
    return relleno(m.id, 10) + relleno(lv, 6) + derecha(precio, 5);
  },

  filas: function () { return this.MEJORAS.length + 1; },

  // Compra la mejora marcada, o vuelve si está marcado BACK.
  elegir: function () {
    if (this.fase !== 'lista') return;
    var m = this.MEJORAS[this.opcion];
    if (!m) { this.volver(); return; }
    var d = KF.monedas.delNivel(), nivel = d.mejoras[m.id] || 0;
    if (m.maximo && nivel >= m.maximo) this.avisar(m.niveles ? 'ALREADY AT MAX' : 'ALREADY OWNED');
    else if (d.saldo < m.precio) this.avisar('NEED ' + (m.precio - d.saldo) + ' MORE COINS');
    else {
      KF.monedas.gastar(m.precio);
      d.mejoras[m.id] = nivel + 1;
      KF.monedas.guardar();
      KF.powerups.recogidas++;   // suena como un power-up
      this.avisar(m.id === 'SHIPS' ? 'FROM NEXT GAME' : 'BOUGHT');
    }
  },

  avisar: function (texto) {
    this.aviso = texto;
    this.tiempoAviso = this.DURACION_AVISO;
  },

  actualizar: function (dt) {
    if (!this.abierta()) return;
    if (!KF.pausa.activa) { this.cerrar(); return; }
    this.t += dt;
    this.tiempoAviso = Math.max(0, this.tiempoAviso - dt);
    if (this.fase === 'ida' && this.t >= this.DURACION_PASEO) {
      this.fase = 'lista';
      this.t = 0;
    } else if (this.fase === 'vuelta' && this.t >= this.DURACION_PASEO) {
      this.cerrar();
    }
  },

  // Altura (borde superior) de la fila i de la lista.
  alturaFila: function (i) { return 64 + i * this.SEPARACION; },

  filaEn: function (p) {
    if (!p) return -1;
    for (var i = 0; i < this.filas(); i++) {
      var y = this.alturaFila(i);
      if (p.y >= y - 3 && p.y < y + KF.graficos.FUENTE_ALTO + 3) return i;
    }
    return -1;
  },

  // Toque en la lista: una fila la marca y la elige; fuera, nada.
  toque: function (p) {
    if (this.fase !== 'lista') return;
    var i = this.filaEn(p);
    if (i < 0) return;
    this.opcion = i;
    this.elegir();
  },

  tecla: function (e) {
    if (this.fase !== 'lista') return;
    var n = this.filas();
    if (e.code === 'ArrowUp') this.opcion = (this.opcion + n - 1) % n;
    else if (e.code === 'ArrowDown') this.opcion = (this.opcion + 1) % n;
    else if (e.code === 'Enter' || e.code === 'Space') this.teclaElegir = e.code;
  },

  soltar: function (e) {
    if (e.code !== this.teclaElegir) return;
    this.teclaElegir = null;
    this.elegir();
  },

  // Dónde está el piloto: de la nave a la tienda en la ida, al revés en la
  // vuelta y dentro de la tienda (no se ve) con la lista abierta.
  xPiloto: function () {
    var k = Math.min(1, this.t / this.DURACION_PASEO);
    if (this.fase === 'vuelta') k = 1 - k;
    return this.xNave + (this.xTienda - this.xNave) * k;
  },

  dibujar: function (ctx) {
    if (!this.abierta()) return;
    var g = KF.graficos, p = KF.partida, y = KF.Nave.prototype.Y;
    var s = this.SPRITE_TIENDA;
    g.dibujar(ctx, s, this.xTienda, y + 5 - s.height / 2);
    if (this.fase !== 'lista') {
      var paso = this.SPRITES_PILOTO[Math.floor(this.t / this.DURACION_PASO) % 2];
      g.dibujar(ctx, paso, this.xPiloto(), y + 2);
      return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, KF.ANCHO, y - 12);
    p.escribirCentrado(ctx, this.LETRAS, 'SHOP', 24, 2);
    var saldo = 'COINS ' + KF.monedas.saldo();
    var x = (KF.ANCHO - g.anchoTexto(saldo) - 10) / 2;
    g.dibujar(ctx, KF.monedas.SPRITE, x + 3, 47);
    g.escribir(ctx, this.LETRAS_MONEDAS, saldo, x + 10, 44);
    for (var i = 0; i < this.filas(); i++) {
      var texto = this.MEJORAS[i] ? this.textoMejora(this.MEJORAS[i]) : 'BACK';
      var letras = i === this.opcion ? this.LETRAS : this.LETRAS_OPCION;
      p.escribirCentrado(ctx, letras, texto, this.alturaFila(i), 1);
    }
    if (this.tiempoAviso > 0) p.escribirCentrado(ctx, this.LETRAS_MONEDAS, this.aviso, this.alturaFila(this.filas()) + 6, 1);
  }
};

(function () {
  var t = KF.tienda, g = KF.graficos;
  t.LETRAS = g.crearFuente(t.COLOR);
  t.LETRAS_OPCION = g.crearFuente(t.COLOR_OPCION);
  t.LETRAS_MONEDAS = g.crearFuente(t.COLOR_MONEDAS);
  t.SPRITE_TIENDA = g.SPRITE_TIENDA;
  t.SPRITES_PILOTO = g.SPRITES_PILOTO;
})();

// Después de la pausa, para que la tienda quede encima de su menú.
KF.registrar(KF.tienda);
