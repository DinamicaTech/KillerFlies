// La tienda de mejoras (mejoras): la opción SHOP de la pausa (js/pausa.js).
// Al elegirla aparece una tienda junto a la nave y
// un piloto sale de ella y anda hasta la tienda; entonces se abre la lista de
// mejoras con el saldo de monedas (js/monedas.js) de la dificultad en curso.
// Las flechas arriba y abajo cambian de mejora y Enter o espacio (al
// soltarlos) la compran; en la pantalla táctil, tocar una mejora la compra.
// BACK devuelve el piloto a la nave y vuelve al menú de la pausa; P (o
// cualquier cosa que acabe la pausa) cierra la tienda al momento.
// Las mejoras son permanentes y valen para la dificultad con cuyas monedas se
// compraron; se notan desde la compra, salvo SHIPS, que
// da una nave de recambio más al empezar cada partida, hasta el tope de 5 (3
// niveles), y SHIELD y WINGMAN, que llegan con la nave siguiente. BONUS
// desbloquea la oleada desafío (js/partida.js). La lista muestra 8 filas y se
// desplaza con la marca o tocando sus flechas. Las demás acumulables no
// tienen tope: el equilibrio se hace con los precios.
// Las skins y los cosméticos (mejoras/skins) se compran una vez y después su
// fila los pone o los quita (ON/OFF); solo puede haber una skin puesta.
// En la partida a dos (mejoras/dos-jugadores) cada jugador juega con las
// mejoras de su perfil, en la dificultad del anfitrión, y los dos
// dispositivos se mandan sus niveles (js/red.js). Las de la nave van con la
// nave de quien las compró (nivelDe); BOMBS, YELLOW y ESCORT, que cambian a
// los enemigos de los dos, usan la media de los dos niveles, redondeando
// hacia abajo (nivelJuego); RED SLOW, BLAST y STARS solo cambian la
// pantalla de quien las compró (nivel).
KF.tienda = {
  // Cada una con su explicación, que se ve bajo la lista mientras está marcada.
  MEJORAS: [
    { id: 'SPEED',    precio: 5,                // +5% de velocidad de la nave por nivel
      texto: ['+5% SHIP SPEED PER LEVEL'] },
    { id: 'FIRE',     precio: 5,                // +5% de velocidad del disparo por nivel
      texto: ['+5% SHOT SPEED PER LEVEL'] },
    { id: 'BONUS',    precio: 10, maximo: 1,    // la oleada desafío, con sus monedas (mejoras/escudo-y-apoyo)
      texto: ['UNLOCKS THE CHALLENGE WAVE', 'ONE COIN PER GROUP DESTROYED'] },
    { id: 'SHIELD',   precio: 20, maximo: 1,    // aguanta un golpe; vuelve con cada nave nueva
      texto: ['A SHIELD THAT TAKES ONE HIT', 'BACK WITH EVERY NEW SHIP'] },
    { id: 'WINGMAN',  precio: 15, maximo: 2, niveles: true,  // naves de apoyo a los lados, hasta dos
      texto: ['A SUPPORT SHIP THAT FIRES WITH YOU', 'LEVEL 2 ADDS ONE ON THE OTHER SIDE'] },
    { id: 'SHIPS',    precio: 15, maximo: 3, niveles: true,  // una nave de recambio más al empezar, hasta el tope de 5
      texto: ['START EACH GAME WITH', 'ONE MORE SPARE SHIP'] },
    { id: 'BOMBS',    precio: 5,                // bombas enemigas un 5% más lentas por nivel
      texto: ['ENEMY BOMBS 5% SLOWER PER LEVEL'] },
    { id: 'MAGNET',   precio: 10, maximo: 1,    // monedas y cápsulas van hacia la nave
      texto: ['COINS AND CAPSULES', 'FLY TO YOUR SHIP'] },
    { id: 'RED SLOW', precio: 3, maximo: 1,     // la cápsula del slow fire cae en roja
      texto: ['THE SLOW FIRE CAPSULE', 'FALLS IN RED'] },
    // Fase 4 (mejoras/skins).
    { id: 'YELLOW',   precio: 5,                // +10% de ataques de amarillas por nivel (js/ataque.js)
      texto: ['+10% YELLOW ATTACKS PER LEVEL', 'MORE CHANCES OF A CAPSULE'] },
    { id: 'KEEP POWER', precio: 15, maximo: 1,  // la primera vez que te destruyen con power-up, lo conservas
      texto: ['KEEP YOUR POWER UP THE FIRST', 'TIME YOU ARE DESTROYED IN A GAME'] },
    { id: 'ESCORT',   precio: 10, maximo: 1,    // cápsula con la amarilla y una sola escolta
      texto: ['A CAPSULE FOR THE YELLOW', 'AND ONLY ONE OF ITS ESCORT'] },
    // Skins y cosméticos: una vez comprados, la fila los pone y los quita.
    { id: 'SKIN BLUE', precio: 10, maximo: 1, conmutable: true, skin: true,
      texto: ['A BLUE SHIP WITH ITS OWN LOOK', 'FOR EVERY POWER UP'] },
    { id: 'SKIN GOLD', precio: 10, maximo: 1, conmutable: true, skin: true,
      texto: ['A GOLD SHIP WITH ITS OWN LOOK', 'FOR EVERY POWER UP'] },
    { id: 'TRAIL',    precio: 5, maximo: 1, conmutable: true,
      texto: ['A BLUE ENGINE FLAME'] },
    { id: 'BLAST',    precio: 5, maximo: 1, conmutable: true,
      texto: ['PLASMA COLOURED EXPLOSIONS'] },
    { id: 'STARS',    precio: 5, maximo: 1, conmutable: true,
      texto: ['STARS IN NEBULA COLOURS'] }
  ],
  TEXTO_PUESTO: 'SELECT TO TAKE IT OFF',
  TEXTO_QUITADO: 'SELECT TO PUT IT ON',
  TEXTO_BACK: ['RETURN TO THE PAUSE MENU'],
  AUMENTO: 0.05,           // SPEED y FIRE: +5% por nivel, sumados
  BOMBAS: 0.95,            // BOMBS: cada nivel deja las bombas al 95% de su velocidad
  DURACION_PASEO: 1.5,     // segundos que tarda el piloto entre la nave y la tienda
  DISTANCIA_TIENDA: 40,    // píxeles de la nave a la tienda
  DURACION_PASO: 0.15,     // segundos de cada paso del piloto
  DURACION_AVISO: 2,       // segundos que se ve el aviso de una compra
  SEPARACION: 12,          // píxeles entre una fila de la lista y la siguiente
  VISIBLES: 8,             // filas que se ven a la vez; las demás, desplazando la lista
  ARRIBA_LISTA: 64,        // borde superior de la primera fila visible
  COLOR: '#ffff40',
  COLOR_OPCION: '#808080',
  COLOR_MONEDAS: '#c8d0dc',   // el saldo, del color de la moneda
  COLOR_AVISO: '#ffd030',
  COLOR_EXPLICACION: '#40d0e0',
  enPausa: true,           // se mueve con la partida en pausa

  fase: null,              // null (cerrada) | 'ida' | 'lista' | 'vuelta'
  t: 0,                    // segundos en la fase
  opcion: 0,               // fila marcada: una mejora o, la última, BACK
  primera: 0,              // primera fila visible de la lista
  aviso: '',
  tiempoAviso: 0,
  teclaElegir: null,
  xNave: 0,                // dónde estaba la nave al abrir la tienda
  xTienda: 0,
  otro: {},                // a dos, niveles en vigor del otro jugador: { id: nivel }

  // Nivel en vigor de una mejora de este dispositivo en la dificultad en
  // curso: el comprado, salvo una skin o un cosmético quitado, que cuenta 0.
  nivel: function (id) {
    var d = KF.monedas.delNivel();
    return d.quitadas[id] ? 0 : d.mejoras[id] || 0;
  },

  // Nivel de una mejora de la nave: el de este dispositivo para la suya y,
  // a dos, el del otro jugador para la del otro.
  nivelDe: function (nave, id) {
    return KF.companero && nave === KF.companero ? this.otro[id] || 0 : this.nivel(id);
  },

  // Nivel de una mejora que cambia a los enemigos: a dos, la media de los
  // dos jugadores, redondeando hacia abajo.
  nivelJuego: function (id) {
    return KF.companero ? Math.floor((this.nivel(id) + (this.otro[id] || 0)) / 2) : this.nivel(id);
  },

  // Niveles en vigor de este dispositivo, en el orden de MEJORAS, para el
  // otro dispositivo de la partida a dos.
  niveles: function () {
    var self = this;
    return this.MEJORAS.map(function (m) { return self.nivel(m.id); });
  },

  // Llegan los niveles del otro jugador. En el anfitrión, el escudo y las
  // naves de apoyo que acaba de comprar (o que aún no sabía) llegan ya a su
  // nave en juego, como a uno.
  recibirNiveles: function (lista) {
    if (!Array.isArray(lista)) return;
    var antes = this.otro, otro = {}, self = this;
    this.MEJORAS.forEach(function (m, i) {
      var n = lista[i];
      if (typeof n === 'number' && n > 0) otro[m.id] = Math.floor(n);
    });
    this.otro = otro;
    if (!KF.companero || KF.red.invitado) return;
    ['SHIELD', 'WINGMAN'].forEach(function (id) {
      var mas = (otro[id] || 0) - (antes[id] || 0);
      if (mas > 0) self.ponerEnLaNave(id, KF.companero, mas);
    });
  },

  // Mejora por su id.
  mejora: function (id) {
    for (var i = 0; i < this.MEJORAS.length; i++) if (this.MEJORAS[i].id === id) return this.MEJORAS[i];
    return null;
  },

  // Pone o quita una skin o un cosmético comprado; solo puede haber una skin
  // puesta, así que poner una quita las demás.
  poner: function (m, puesto) {
    var d = KF.monedas.delNivel(), self = this;
    if (puesto) delete d.quitadas[m.id];
    else d.quitadas[m.id] = true;
    if (puesto && m.skin) {
      this.MEJORAS.forEach(function (o) {
        if (o.skin && o !== m && d.mejoras[o.id]) d.quitadas[o.id] = true;
      });
    }
    KF.monedas.guardar();
  },

  factorVelocidad: function (nave) { return 1 + this.AUMENTO * this.nivelDe(nave, 'SPEED'); },
  factorDisparo: function (nave) { return 1 + this.AUMENTO * this.nivelDe(nave, 'FIRE'); },
  factorBombas: function () { return Math.pow(this.BOMBAS, this.nivelJuego('BOMBS')); },

  abierta: function () { return this.fase !== null; },

  // Desde la pausa: la tienda aparece al lado de la nave, donde haya sitio.
  abrir: function () {
    if (this.abierta()) return;
    this.xNave = KF.jugador.estado === 'viva' ? KF.jugador.x : KF.ANCHO / 2;
    this.xTienda = this.xNave + (this.xNave < KF.ANCHO / 2 ? 1 : -1) * this.DISTANCIA_TIENDA;
    this.fase = 'ida';
    this.t = 0;
    this.opcion = 0;
    this.primera = 0;
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

  // Precio y texto de la fila de una mejora: 'SPEED    LV 2    5'. Una skin
  // o un cosmético comprado dice si está puesto (ON) o no (OFF).
  textoMejora: function (m) {
    var nivel = KF.monedas.delNivel().mejoras[m.id] || 0;
    var lleno = m.maximo && nivel >= m.maximo;
    var precio = lleno ? (m.conmutable ? (this.nivel(m.id) ? 'ON' : 'OFF') : m.niveles ? 'MAX' : 'OWNED') : String(m.precio);
    var lv = m.maximo && !m.niveles ? '' : 'LV ' + nivel;
    var relleno = function (t, n) { while (t.length < n) t += ' '; return t; };
    var derecha = function (t, n) { while (t.length < n) t = ' ' + t; return t; };
    return relleno(m.id, 10) + relleno(lv, 6) + derecha(precio, 5);
  },

  filas: function () { return this.MEJORAS.length + 1; },

  // Líneas de la explicación de la fila marcada.
  explicacion: function () {
    var m = this.MEJORAS[this.opcion];
    if (!m) return this.TEXTO_BACK;
    if (m.conmutable && KF.monedas.delNivel().mejoras[m.id]) return [m.texto[0], this.nivel(m.id) ? this.TEXTO_PUESTO : this.TEXTO_QUITADO];
    return m.texto;
  },

  // Compra la mejora marcada, o vuelve si está marcado BACK.
  elegir: function () {
    if (this.fase !== 'lista') return;
    var m = this.MEJORAS[this.opcion];
    if (!m) { this.volver(); return; }
    var d = KF.monedas.delNivel(), nivel = d.mejoras[m.id] || 0;
    if (m.conmutable && nivel) {
      var puesto = !this.nivel(m.id);
      this.poner(m, puesto);
      this.avisar(puesto ? 'ON' : 'OFF');
    } else if (m.maximo && nivel >= m.maximo) this.avisar(m.niveles ? 'ALREADY AT MAX' : 'ALREADY OWNED');
    else if (d.saldo < m.precio) this.avisar('NEED ' + (m.precio - d.saldo) + ' MORE COINS');
    else {
      KF.monedas.gastar(m.precio);
      d.mejoras[m.id] = nivel + 1;
      if (m.conmutable) this.poner(m, true);   // recién comprada, puesta
      KF.monedas.guardar();
      // Suena como un power-up, igual que una moneda: con el contador de las
      // monedas, que a dos no pisa la foto del anfitrión.
      KF.monedas.recogidas++;
      this.ponerEnLaNave(m.id, KF.jugador);
      this.avisar(m.id === 'SHIPS' ? 'FROM NEXT GAME' : 'BOUGHT');
    }
  },

  // El escudo y las n naves de apoyo (una, por defecto) recién compradas
  // llegan ya a la nave en juego. En el invitado de la partida a dos lo hace
  // el anfitrión al recibir sus niveles.
  ponerEnLaNave: function (id, j, n) {
    if (j.estado !== 'viva' || KF.red.invitado) return;
    if (id === 'SHIELD') j.blindaje = true;
    for (var k = 0; id === 'WINGMAN' && k < (n || 1) && j.apoyos.length < 2; k++) {
      var libre = j.apoyos.some(function (a) { return a.lado < 0; }) ? 1 : -1;
      j.apoyos.push({ lado: libre });
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

  visibles: function () { return Math.min(this.VISIBLES, this.filas()); },

  // Altura (borde superior) de la fila i de la lista, si se ve.
  alturaFila: function (i) { return this.ARRIBA_LISTA + (i - this.primera) * this.SEPARACION; },

  // Alturas de las flechas que desplazan la lista, encima y debajo de ella.
  alturaFlechaArriba: function () { return this.ARRIBA_LISTA - 8; },
  alturaFlechaAbajo: function () { return this.ARRIBA_LISTA + this.visibles() * this.SEPARACION - 2; },
  hayArriba: function () { return this.primera > 0; },
  hayAbajo: function () { return this.primera + this.visibles() < this.filas(); },

  // La lista se desplaza para que se vea la fila marcada.
  seguirMarca: function () {
    if (this.opcion < this.primera) this.primera = this.opcion;
    else if (this.opcion >= this.primera + this.visibles()) this.primera = this.opcion - this.visibles() + 1;
  },

  // Desplaza la lista una fila (paso -1 o +1) y marca la primera o la última visible.
  desplazar: function (paso) {
    this.primera = Math.max(0, Math.min(this.filas() - this.visibles(), this.primera + paso));
    this.opcion = Math.max(this.primera, Math.min(this.primera + this.visibles() - 1, this.opcion));
  },

  filaEn: function (p) {
    if (!p) return -1;
    for (var i = this.primera; i < this.primera + this.visibles(); i++) {
      var y = this.alturaFila(i);
      if (p.y >= y - 3 && p.y < y + KF.graficos.FUENTE_ALTO + 3) return i;
    }
    return -1;
  },

  // Toque en la lista: una fila la marca y la elige; las flechas la
  // desplazan; fuera, nada.
  toque: function (p) {
    if (this.fase !== 'lista' || !p) return;
    if (this.hayArriba() && Math.abs(p.y - this.alturaFlechaArriba() - 2) <= 5) { this.desplazar(-1); return; }
    if (this.hayAbajo() && Math.abs(p.y - this.alturaFlechaAbajo() - 2) <= 5) { this.desplazar(1); return; }
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
    this.seguirMarca();
  },

  // Flecha de 5 píxeles de ancho centrada en la pantalla, hacia arriba (-1) o hacia abajo (1).
  dibujarFlecha: function (ctx, y, sentido) {
    ctx.fillStyle = this.COLOR_OPCION;
    for (var k = 0; k < 3; k++) {
      var ancho = sentido < 0 ? 1 + 2 * k : 5 - 2 * k;
      ctx.fillRect(KF.ANCHO / 2 - ancho / 2, y + k, ancho, 1);
    }
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
    // El perfil de jugador (js/perfiles.js) y su saldo.
    var perfil = KF.perfiles.nombre() + '  ', saldo = 'COINS ' + KF.monedas.saldo();
    var x = (KF.ANCHO - g.anchoTexto(perfil) - g.anchoTexto(saldo) - 10) / 2;
    g.escribir(ctx, this.LETRAS_OPCION, perfil, x, 44);
    x += g.anchoTexto(perfil);
    g.dibujar(ctx, KF.monedas.SPRITE, x + 3, 47);
    g.escribir(ctx, this.LETRAS_MONEDAS, saldo, x + 10, 44);
    for (var i = this.primera; i < this.primera + this.visibles(); i++) {
      var texto = this.MEJORAS[i] ? this.textoMejora(this.MEJORAS[i]) : 'BACK';
      var letras = i === this.opcion ? this.LETRAS : this.LETRAS_OPCION;
      p.escribirCentrado(ctx, letras, texto, this.alturaFila(i), 1);
    }
    if (this.hayArriba()) this.dibujarFlecha(ctx, this.alturaFlechaArriba(), -1);
    if (this.hayAbajo()) this.dibujarFlecha(ctx, this.alturaFlechaAbajo(), 1);
    // La explicación de la fila marcada y, debajo, el aviso de la última compra.
    var abajo = this.alturaFlechaAbajo() + 10, lineas = this.explicacion();
    for (i = 0; i < lineas.length; i++) p.escribirCentrado(ctx, this.LETRAS_EXPLICACION, lineas[i], abajo + i * 9, 1);
    if (this.tiempoAviso > 0) p.escribirCentrado(ctx, this.LETRAS_AVISO, this.aviso, abajo + 24, 1);
  }
};

(function () {
  var t = KF.tienda, g = KF.graficos;
  t.LETRAS = g.crearFuente(t.COLOR);
  t.LETRAS_OPCION = g.crearFuente(t.COLOR_OPCION);
  t.LETRAS_MONEDAS = g.crearFuente(t.COLOR_MONEDAS);
  t.LETRAS_AVISO = g.crearFuente(t.COLOR_AVISO);
  t.LETRAS_EXPLICACION = g.crearFuente(t.COLOR_EXPLICACION);
  t.SPRITE_TIENDA = g.SPRITE_TIENDA;
  t.SPRITES_PILOTO = g.SPRITES_PILOTO;
})();

// Después de la pausa, para que la tienda quede encima de su menú.
KF.registrar(KF.tienda);
