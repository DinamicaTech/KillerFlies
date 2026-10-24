// Monedas (mejoras): cada oleada principal tiene POR_OLEADA monedas, y cada
// una solo se puede recoger una vez. Al empezar la oleada se mira cuántas
// faltan por recoger en ella y solo caen esas: todas menos una de enemigos
// destruidos al azar y la última siempre del último enemigo de la oleada. La
// moneda cae como una cápsula y se recoge al tocarla con la nave; si se
// escapa por abajo, sigue pendiente para otra partida. La nave nodriza no
// tiene monedas.
// La oleada desafío, que en la partida a uno solo sale con la mejora BONUS,
// suelta una moneda por cada grupo destruido entero, hasta POR_DESAFIO, para
// quien tenga BONUS: las del desafío que sigue a cada oleada también se
// recogen una sola vez.
// En la partida a dos (mejoras/dos-jugadores) cada jugador tiene las suyas,
// las que le faltan a él, así que caen de enemigos distintos para cada uno
// (las dos últimas, del último enemigo, una al lado de la otra). Cada moneda
// es de una nave (dueno) y solo la recoge esa; en cada pantalla las del otro
// jugador se ven semitransparentes. El anfitrión mueve todas: el invitado le
// dice cuántas le faltan (estadoInvitado) y recibe en cada foto las que ha
// recogido (js/red.js), que guarda en su perfil al momento.
// Lo recogido se guarda en el navegador al momento, aparte para cada
// dificultad: el saldo, las monedas recogidas en cada oleada y las mejoras
// compradas en la tienda (js/tienda.js). Cada dificultad tiene sus perfiles
// de jugador (js/perfiles.js): todo esto es del perfil activo de la
// dificultad, guardado bajo el número de su cuenta.
// Con la mejora MAGNET, las monedas y las cápsulas de power-up cercanas van
// solas hacia la nave.
// Para hacer pruebas, abrir el juego con ?monedas=N suma N monedas al saldo
// de cada dificultad; el parámetro se quita de la dirección para que recargar
// no las vuelva a sumar.
KF.monedas = {
  POR_OLEADA: 5,
  POR_DESAFIO: 4,          // una por grupo del desafío
  CLAVE: 'killerflies.cuenta.',   // más la cuenta: 'killerflies.cuenta.default' (perfil 0), 'killerflies.cuenta.2'…
  FACTOR_CAIDA: 0.5,       // caen a la mitad de la velocidad de las bombas, como las cápsulas
  GIRO: 0.12,              // segundos de cada fase del giro de la moneda
  RADIO_IMAN: 48,          // píxeles alrededor de la nave a los que llega el imán
  VELOCIDAD_IMAN: 70,      // píxeles por segundo hacia la nave con el imán

  SEPARACION: 4,           // a dos, píxeles a cada lado del sitio cuando caen las dos a la vez
  ULTIMAS: 10,             // a dos, recogidas del invitado que repite cada foto

  monedas: [],             // {id, x, y, t, oleada, desafio, dueno}: desafio si es del desafío tras esa oleada; dueno, el número de su nave
  naves: null,             // formación de la oleada planificada
  planes: {},              // por número de nave: números de enemigo destruido (1, 2…) que sueltan su moneda
  destruidas: 0,           // enemigos de la formación destruidos en la oleada
  navesDesafio: null,      // naves del desafío en curso
  soltadasDesafio: {},     // por número de nave, monedas soltadas en el desafío en curso
  limiteDesafio: {},       // por número de nave, las que le faltaban al empezar
  recogidas: 0,            // monedas recogidas (y mejoras compradas) desde que empezó el juego (Sonido las observa)
  cache: {},               // datos de cada cuenta, leídos una vez: { cuenta: datos }
  // Partida a dos. En el anfitrión: lo que ha dicho el invitado [oleada,
  // faltan en ella, faltan en su desafío] y sus recogidas (entregadas en
  // total, las últimas como oleada o -oleada si son del desafío). En el
  // invitado: cuántas de esas ya ha guardado.
  invitado: null,
  entregadas: 0,
  ultimas: [],
  guardadas: 0,

  // Datos de la cuenta: { EASY: { saldo, oleadas: { n: recogidas },
  // desafios: { n: recogidas }, mejoras: { id: nivel }, quitadas: { id: true } }, … };
  // quitadas son las skins y los cosméticos comprados que no están puestos.
  datos: function (cuenta) {
    if (!this.cache[cuenta]) this.cache[cuenta] = this.leer(cuenta);
    return this.cache[cuenta];
  },

  // Nombre de la cuenta del perfil número id.
  cuenta: function (id) { return id ? String(id) : 'default'; },

  // Los datos del perfil activo de una dificultad (por defecto, la de la
  // partida en curso).
  delNivel: function (nivel) {
    if (nivel === undefined) nivel = KF.dificultad.nivel;
    var nombre = KF.dificultad.NIVELES[nivel];
    var d = this.datos(this.cuenta(KF.perfiles.activo(nivel)));
    if (!d[nombre]) d[nombre] = { saldo: 0, oleadas: {}, desafios: {}, mejoras: {}, quitadas: {} };
    return d[nombre];
  },

  saldo: function (nivel) { return this.delNivel(nivel).saldo; },

  // Monedas que faltan por recoger en la oleada n de la dificultad en curso.
  faltan: function (n) {
    return Math.max(0, this.POR_OLEADA - (this.delNivel().oleadas[n] || 0));
  },

  // Monedas que faltan por recoger en el desafío que sigue a la oleada n.
  faltanDesafio: function (n) {
    return Math.max(0, this.POR_DESAFIO - (this.delNivel().desafios[n] || 0));
  },

  // Gasta monedas de la dificultad en curso, si hay bastantes.
  gastar: function (cuantas) {
    var d = this.delNivel();
    if (d.saldo < cuantas) return false;
    d.saldo -= cuantas;
    this.guardar();
    return true;
  },

  // Guarda las cuentas leídas.
  guardar: function () {
    try {
      for (var cuenta in this.cache) window.localStorage.setItem(this.CLAVE + cuenta, JSON.stringify(this.cache[cuenta]));
    } catch (e) { /* sin almacenamiento: dura solo la sesión */ }
  },

  // Lo guardado, quedándose solo con lo que tenga sentido.
  leer: function (cuenta) {
    var datos, limpio = {};
    try {
      datos = JSON.parse(window.localStorage.getItem(this.CLAVE + cuenta));
    } catch (e) {
      datos = null;
    }
    var entero = function (v) { return typeof v === 'number' && v >= 0 ? Math.floor(v) : 0; };
    KF.dificultad.NIVELES.forEach(function (nombre) {
      var d = datos && typeof datos === 'object' && datos[nombre];
      if (!d || typeof d !== 'object') return;
      var nivel = { saldo: entero(d.saldo), oleadas: {}, desafios: {}, mejoras: {}, quitadas: {} };
      var porOleada = function (origen, destino, maximo) {
        for (var k in origen || {}) {
          var n = parseInt(k, 10);
          if (n >= 1 && String(n) === k) destino[n] = Math.min(maximo, entero(origen[k]));
        }
      };
      porOleada(d.oleadas, nivel.oleadas, KF.monedas.POR_OLEADA);
      porOleada(d.desafios, nivel.desafios, KF.monedas.POR_DESAFIO);
      for (var id in d.mejoras || {}) {
        if (entero(d.mejoras[id]) > 0) nivel.mejoras[id] = entero(d.mejoras[id]);
      }
      for (id in d.quitadas || {}) {
        if (d.quitadas[id] === true && nivel.mejoras[id]) nivel.quitadas[id] = true;
      }
      limpio[nombre] = nivel;
    });
    return limpio;
  },

  // Puerta trasera de pruebas: ?monedas=N en la dirección, para el perfil
  // activo de cada dificultad.
  cargarDeRegalo: function () {
    var loc = window.location, m = loc && /[?&]monedas=(\d{1,6})(?=&|$)/.exec(loc.search);
    if (!m) return;
    var n = parseInt(m[1], 10), self = this;
    KF.dificultad.NIVELES.forEach(function (nombre, i) { self.delNivel(i).saldo += n; });
    this.guardar();
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', loc.pathname + loc.search.replace(/([?&])monedas=\d+&?/, '$1').replace(/[?&]$/, '') + (loc.hash || ''));
    }
  },

  // Hay monedas que mover en esta partida: jugando, a uno o en el anfitrión.
  enJuego: function () {
    return KF.partida.estado === 'jugando' && !KF.red.invitado;
  },

  // La nave de número n en juego, o null.
  nave: function (n) {
    for (var i = 0; i < KF.jugadores.length; i++) if (KF.jugadores[i].numero === n) return KF.jugadores[i];
    return null;
  },

  // Cuántas le faltan a la nave n en la oleada en curso (desafio: en su
  // desafío), o null si aún no se sabe: el invitado lo dice en sus mensajes.
  faltanDe: function (n, desafio) {
    var o = KF.partida.oleada, nave = this.nave(n);
    if (!nave) return 0;
    if (nave === KF.jugador) return desafio ? this.faltanDesafio(o) : this.faltan(o);
    var e = this.invitado;
    if (!e || e[0] !== o) return null;
    return e[desafio ? 2 : 1];
  },

  // Oleada nueva: elige qué enemigos destruidos soltarán las monedas que le
  // faltan a cada jugador; la última, siempre el último. Las que aún caen de
  // la oleada anterior siguen cayendo.
  planificar: function () {
    this.naves = KF.formacion.naves;
    this.destruidas = 0;
    this.planes = {};
    this.planificarFaltan();
  },

  // Planifica las de cada jugador en cuanto se sabe cuántas le faltan (las
  // del invitado, al llegar su primer mensaje de la oleada), entre los
  // enemigos que aún no se han destruido.
  planificarFaltan: function () {
    if (!this.enJuego() || this.naves !== KF.formacion.naves) return;
    for (var i = 0; i < KF.jugadores.length; i++) {
      var n = KF.jugadores[i].numero, faltan = this.faltanDe(n);
      if (this.planes[n] || faltan === null) continue;
      this.planes[n] = this.elegirEnemigos(faltan);
    }
  },

  elegirEnemigos: function (faltan) {
    var total = this.naves.length, plan = [], posibles = [];
    if (!faltan || this.destruidas >= total) return plan;
    for (var i = this.destruidas + 1; i < total; i++) posibles.push(i);
    for (i = 0; i < faltan - 1 && posibles.length; i++) {
      plan.push(posibles.splice(Math.floor(Math.random() * posibles.length), 1)[0]);
    }
    plan.push(total);
    return plan;
  },

  // Un enemigo de la formación destruido: suelta la moneda de cada jugador
  // al que le toque. En el desafío, la suelta la última nave de cada grupo.
  alDestruir: function (nave, x, y) {
    if (!this.enJuego()) return;
    if (KF.desafio.activo && KF.desafio.naves.indexOf(nave) >= 0) {
      this.alDestruirEnDesafio(nave, x, y);
      return;
    }
    if (this.naves !== KF.formacion.naves || this.naves.indexOf(nave) < 0) return;
    this.destruidas++;
    var duenos = [];
    for (var n in this.planes) if (this.planes[n].indexOf(this.destruidas) >= 0) duenos.push(+n);
    this.soltar(duenos, x, y, false);
  },

  alDestruirEnDesafio: function (nave, x, y) {
    var d = KF.desafio, self = this;
    if (this.navesDesafio !== d.naves) {
      this.navesDesafio = d.naves;
      this.soltadasDesafio = {};
      this.limiteDesafio = {};
    }
    var quedan = d.naves.some(function (n) { return n.grupo === nave.grupo && n.viva; });
    if (quedan) return;
    var duenos = [];
    KF.jugadores.forEach(function (j) {
      var n = j.numero;
      // A uno, sin BONUS no hay desafío; a dos sale siempre, pero sus
      // monedas solo caen para quien la tenga.
      if (KF.companero && KF.tienda.nivelDe(j, 'BONUS') <= 0) return;
      if (self.limiteDesafio[n] === undefined) {
        var faltan = self.faltanDe(n, true);
        if (faltan === null) return;
        self.limiteDesafio[n] = faltan;
        self.soltadasDesafio[n] = 0;
      }
      if (self.soltadasDesafio[n] >= self.limiteDesafio[n]) return;
      self.soltadasDesafio[n]++;
      duenos.push(n);
    });
    this.soltar(duenos, x, y, true);
  },

  // Las monedas de esos jugadores caen en (x, y); si son dos, una al lado de la otra.
  soltar: function (duenos, x, y, desafio) {
    var self = this;
    duenos.forEach(function (n, i) {
      var dx = duenos.length > 1 ? (i ? 1 : -1) * self.SEPARACION : 0;
      self.monedas.push({ id: KF.nuevoId(), x: x + dx, y: y, t: 0, oleada: KF.partida.oleada, desafio: desafio, dueno: n });
    });
  },

  // Una nave recoge su moneda. La de este dispositivo cuenta para su oleada
  // (o su desafío) y suma al saldo; la del invitado se le manda (js/red.js).
  recoger: function (moneda) {
    if (moneda.dueno && moneda.dueno !== KF.jugador.numero) {
      this.entregadas++;
      this.ultimas.push(moneda.desafio ? -moneda.oleada : moneda.oleada);
      if (this.ultimas.length > this.ULTIMAS) this.ultimas.shift();
      return;
    }
    var d = this.delNivel();
    if (moneda.desafio) d.desafios[moneda.oleada] = Math.min(this.POR_DESAFIO, (d.desafios[moneda.oleada] || 0) + 1);
    else d.oleadas[moneda.oleada] = Math.min(this.POR_OLEADA, (d.oleadas[moneda.oleada] || 0) + 1);
    d.saldo++;
    this.recogidas++;
    this.guardar();
  },

  // Partida a dos nueva (otra conexión): nada recibido ni entregado aún.
  empezarDos: function () {
    this.invitado = null;
    this.entregadas = this.guardadas = 0;
    this.ultimas = [];
  },

  // Invitado: lo que manda al anfitrión, [oleada, faltan en ella, faltan en su desafío].
  estadoInvitado: function () {
    var o = KF.partida.oleada;
    return [o, this.faltan(o), this.faltanDesafio(o)];
  },

  // Anfitrión: llega lo que dice el invitado.
  recibirInvitado: function (e) {
    if (!Array.isArray(e) || e.length < 3) return;
    this.invitado = e;
    this.planificarFaltan();
  },

  // Invitado: llegan sus recogidas, [entregadas, últimas]; guarda las nuevas.
  recibirRecogidas: function (r) {
    if (!Array.isArray(r) || !Array.isArray(r[1])) return;
    var nuevas = Math.min(r[0] - this.guardadas, r[1].length);
    for (var i = r[1].length - nuevas; i < r[1].length; i++) {
      var o = r[1][i];
      this.recoger({ oleada: Math.abs(o), desafio: o < 0 });
    }
    this.guardadas = Math.max(this.guardadas, r[0]);
  },

  // Con el imán, el objeto k va hacia la nave j si está cerca y por encima de ella.
  atraer: function (k, dt, j) {
    if (j.estado !== 'viva' || k.y > j.Y || Math.abs(k.x - j.x) > this.RADIO_IMAN || j.Y - k.y > this.RADIO_IMAN * 2) return;
    var paso = this.VELOCIDAD_IMAN * dt, dx = j.x - k.x;
    k.x += Math.abs(dx) <= paso ? dx : (dx > 0 ? paso : -paso);
  },

  actualizar: function (dt) {
    // En el invitado, las monedas llegan en las fotos del anfitrión.
    if (KF.red.invitado) return;
    if (this.naves !== KF.formacion.naves) this.planificar();
    if (!this.enJuego()) {
      this.monedas = [];
      return;
    }
    var self = this, s = this.SPRITE;
    var imanes = KF.jugadores.filter(function (j) { return KF.tienda.nivelDe(j, 'MAGNET') > 0; });
    imanes.forEach(function (j) { KF.powerups.capsulas.forEach(function (k) { self.atraer(k, dt, j); }); });
    var vy = KF.ataque.VELOCIDAD_BOMBA * KF.ataque.factorVelocidad * this.FACTOR_CAIDA;
    this.monedas = this.monedas.filter(function (m) {
      var nave = self.nave(m.dueno || 1);
      // Si su nave ya no está en la partida (el otro jugador se ha ido), fuera.
      if (!nave) return false;
      m.t += dt;
      m.y += vy * dt;
      if (imanes.indexOf(nave) >= 0) self.atraer(m, dt, nave);
      var c = nave.caja();
      if (c && m.x - s.width / 2 < c.x + c.ancho && m.x + s.width / 2 > c.x &&
          m.y - s.height / 2 < c.y + c.alto && m.y + s.height / 2 > c.y) {
        self.recoger(m);
        return false;
      }
      return m.y < KF.ALTO + 8;
    });
  },

  // Las monedas del otro jugador, semitransparentes, como su nave.
  dibujar: function (ctx) {
    for (var i = 0; i < this.monedas.length; i++) {
      var m = this.monedas[i];
      var fase = Math.floor(m.t / this.GIRO) % this.SPRITES.length;
      if (m.dueno && m.dueno !== KF.jugador.numero) ctx.globalAlpha = KF.Nave.prototype.OPACIDAD_FANTASMA;
      KF.graficos.dibujar(ctx, this.SPRITES[fase], m.x, m.y);
      ctx.globalAlpha = 1;
    }
  }
};

KF.monedas.SPRITES = KF.graficos.SPRITES_MONEDA;
KF.monedas.SPRITE = KF.graficos.SPRITE_MONEDA;
KF.enemigos.alDestruir(function (nave, motivo, autor, x, y) { KF.monedas.alDestruir(nave, x, y); });
// Cuando ya están cargadas las dificultades (js/dificultad.js va después).
window.addEventListener('DOMContentLoaded', function () { KF.monedas.cargarDeRegalo(); });
KF.registrar(KF.monedas);
