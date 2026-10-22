// Monedas (mejoras): en la partida a uno, cada oleada principal tiene
// POR_OLEADA monedas, y cada una solo se puede recoger una vez. Al empezar
// la oleada se mira cuántas faltan por recoger en ella y solo caen esas:
// todas menos una de enemigos destruidos al azar y la última siempre del
// último enemigo de la oleada. La moneda cae como una cápsula y se recoge al
// tocarla con la nave; si se escapa por abajo, sigue pendiente para otra
// partida. La nave nodriza no tiene monedas, y en la partida a dos no cae
// ninguna (mejoras/dos-jugadores).
// La oleada desafío, que en la partida a uno solo sale con la mejora BONUS,
// suelta una moneda por cada grupo destruido entero, hasta POR_DESAFIO: las
// del desafío que sigue a cada oleada también se recogen una sola vez.
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

  monedas: [],             // {id, x, y, t, oleada, desafio}: desafio si es del desafío tras esa oleada
  naves: null,             // formación de la oleada planificada
  plan: [],                // números de enemigo destruido (1, 2…) que sueltan moneda
  destruidas: 0,           // enemigos de la formación destruidos en la oleada
  navesDesafio: null,      // naves del desafío en curso
  soltadasDesafio: 0,      // monedas soltadas en el desafío en curso
  limiteDesafio: 0,        // las que le faltaban al empezar
  recogidas: 0,            // monedas recogidas desde que empezó el juego (Sonido las observa)
  cache: {},               // datos de cada cuenta, leídos una vez: { cuenta: datos }

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

  // Hay monedas en esta partida: a uno, jugando y en el anfitrión (o solo).
  enJuego: function () {
    return KF.partida.estado === 'jugando' && !KF.companero && !KF.red.invitado;
  },

  // Oleada nueva: elige qué enemigos destruidos soltarán las monedas que
  // faltan; la última, siempre el último. Las que aún caen de la oleada
  // anterior siguen cayendo.
  planificar: function () {
    this.naves = KF.formacion.naves;
    this.destruidas = 0;
    this.plan = [];
    var total = this.naves.length, faltan = Math.min(this.faltan(KF.partida.oleada), total);
    if (!this.enJuego() || !faltan) return;
    var posibles = [];
    for (var i = 1; i < total; i++) posibles.push(i);
    for (i = 0; i < faltan - 1; i++) {
      this.plan.push(posibles.splice(Math.floor(Math.random() * posibles.length), 1)[0]);
    }
    this.plan.push(total);
  },

  // Un enemigo de la formación destruido: si le toca, suelta una moneda. En
  // el desafío, la suelta la última nave de cada grupo.
  alDestruir: function (nave, x, y) {
    if (!this.enJuego()) return;
    if (KF.desafio.activo && KF.desafio.naves.indexOf(nave) >= 0) {
      this.alDestruirEnDesafio(nave, x, y);
      return;
    }
    if (this.naves !== KF.formacion.naves || this.naves.indexOf(nave) < 0) return;
    this.destruidas++;
    if (this.plan.indexOf(this.destruidas) >= 0) {
      this.monedas.push({ id: KF.nuevoId(), x: x, y: y, t: 0, oleada: KF.partida.oleada });
    }
  },

  alDestruirEnDesafio: function (nave, x, y) {
    var d = KF.desafio;
    if (this.navesDesafio !== d.naves) {
      this.navesDesafio = d.naves;
      this.soltadasDesafio = 0;
      this.limiteDesafio = this.faltanDesafio(KF.partida.oleada);
    }
    var quedan = d.naves.some(function (n) { return n.grupo === nave.grupo && n.viva; });
    if (quedan || this.soltadasDesafio >= this.limiteDesafio) return;
    this.soltadasDesafio++;
    this.monedas.push({ id: KF.nuevoId(), x: x, y: y, t: 0, oleada: KF.partida.oleada, desafio: true });
  },

  // La nave recoge la moneda: cuenta para su oleada (o su desafío) y suma al saldo.
  recoger: function (moneda) {
    var d = this.delNivel();
    if (moneda.desafio) d.desafios[moneda.oleada] = Math.min(this.POR_DESAFIO, (d.desafios[moneda.oleada] || 0) + 1);
    else d.oleadas[moneda.oleada] = Math.min(this.POR_OLEADA, (d.oleadas[moneda.oleada] || 0) + 1);
    d.saldo++;
    this.recogidas++;
    this.guardar();
  },

  // Con el imán, el objeto k va hacia la nave si está cerca y por encima de ella.
  atraer: function (k, dt) {
    var j = KF.jugador;
    if (j.estado !== 'viva' || k.y > j.Y || Math.abs(k.x - j.x) > this.RADIO_IMAN || j.Y - k.y > this.RADIO_IMAN * 2) return;
    var paso = this.VELOCIDAD_IMAN * dt, dx = j.x - k.x;
    k.x += Math.abs(dx) <= paso ? dx : (dx > 0 ? paso : -paso);
  },

  actualizar: function (dt) {
    if (this.naves !== KF.formacion.naves) this.planificar();
    if (!this.enJuego()) {
      this.monedas = [];
      return;
    }
    var iman = KF.tienda.nivel('MAGNET') > 0, self = this;
    if (iman) KF.powerups.capsulas.forEach(function (k) { self.atraer(k, dt); });
    var vy = KF.ataque.VELOCIDAD_BOMBA * KF.ataque.factorVelocidad * this.FACTOR_CAIDA;
    var s = this.SPRITE;
    this.monedas = this.monedas.filter(function (m) {
      m.t += dt;
      m.y += vy * dt;
      if (iman) self.atraer(m, dt);
      var c = KF.jugador.caja();
      if (c && m.x - s.width / 2 < c.x + c.ancho && m.x + s.width / 2 > c.x &&
          m.y - s.height / 2 < c.y + c.alto && m.y + s.height / 2 > c.y) {
        self.recoger(m);
        return false;
      }
      return m.y < KF.ALTO + 8;
    });
  },

  dibujar: function (ctx) {
    for (var i = 0; i < this.monedas.length; i++) {
      var m = this.monedas[i];
      var fase = Math.floor(m.t / this.GIRO) % this.SPRITES.length;
      KF.graficos.dibujar(ctx, this.SPRITES[fase], m.x, m.y);
    }
  }
};

KF.monedas.SPRITES = KF.graficos.SPRITES_MONEDA;
KF.monedas.SPRITE = KF.graficos.SPRITE_MONEDA;
KF.enemigos.alDestruir(function (nave, motivo, autor, x, y) { KF.monedas.alDestruir(nave, x, y); });
// Cuando ya están cargadas las dificultades (js/dificultad.js va después).
window.addEventListener('DOMContentLoaded', function () { KF.monedas.cargarDeRegalo(); });
KF.registrar(KF.monedas);
