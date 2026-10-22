// Perfiles de jugador (mejoras/cuentas): cada dificultad tiene los suyos,
// hasta MAXIMO, y cada perfil sus monedas, sus mejoras (js/monedas.js) y sus
// perfects (js/perfect.js). En el menú de inicio, bajo la dificultad, la línea
// '< PLAYER >' muestra el perfil activo de la dificultad marcada; las flechas
// (con la línea marcada) o un toque pasan al siguiente y, tras el último, a
// '< NEW PROFILE >', que al empezar pide el nombre del perfil nuevo
// (js/salon-fama.js). Se recuerda el perfil activo de cada dificultad.
// Cada perfil tiene un número: el 0 es el primero, PLAYER, con los datos de
// antes de haber perfiles; sus monedas siguen bajo 'killerflies.cuenta.default'
// y las del perfil n bajo 'killerflies.cuenta.n'.
KF.perfiles = {
  MAXIMO: 4,               // perfiles por dificultad
  PRIMERO: 'PLAYER',       // nombre del perfil 0
  CLAVE: 'killerflies.perfiles',
  NUEVO: 'NEW PROFILE',

  cache: null,             // { EASY: { activo, lista: [{ id, nombre }] }, … }
  nuevo: false,            // la línea del menú muestra '< NEW PROFILE >'

  datos: function () {
    if (!this.cache) this.cache = this.leer();
    return this.cache;
  },

  // Los perfiles de una dificultad (por defecto la de la partida en curso).
  deNivel: function (nivel) {
    var nombre = KF.dificultad.NIVELES[nivel === undefined ? KF.dificultad.nivel : nivel];
    var d = this.datos();
    if (!d[nombre]) d[nombre] = { activo: 0, lista: [{ id: 0, nombre: this.PRIMERO }] };
    return d[nombre];
  },

  // Número del perfil activo de una dificultad.
  activo: function (nivel) { return this.deNivel(nivel).activo; },

  // El perfil activo de una dificultad: { id, nombre }.
  perfil: function (nivel) {
    var p = this.deNivel(nivel);
    for (var i = 0; i < p.lista.length; i++) if (p.lista[i].id === p.activo) return p.lista[i];
    return p.lista[0];
  },

  nombre: function (nivel) { return this.perfil(nivel).nombre; },

  // Texto de la línea del menú, de la dificultad marcada.
  texto: function () {
    return '< ' + (this.nuevo ? this.NUEVO : this.nombre(KF.dificultad.elegido)) + ' >';
  },

  // Pasa al perfil siguiente (paso 1) o anterior (-1) de la dificultad
  // marcada; tras el último va '< NEW PROFILE >' si aún cabe otro.
  cambiar: function (paso) {
    var p = this.deNivel(KF.dificultad.elegido), lista = p.lista;
    var n = lista.length + (lista.length < this.MAXIMO ? 1 : 0);
    var i = this.nuevo ? lista.length : this.indice(p);
    i = (i + paso + n) % n;
    this.nuevo = i === lista.length;
    if (!this.nuevo) {
      p.activo = lista[i].id;
      this.guardar();
    }
  },

  indice: function (p) {
    for (var i = 0; i < p.lista.length; i++) if (p.lista[i].id === p.activo) return i;
    return 0;
  },

  // Al cambiar de dificultad o volver al menú, la línea muestra el perfil activo.
  mostrarActivo: function () { this.nuevo = false; },

  // Crea un perfil con ese nombre en la dificultad marcada y lo deja activo;
  // si ya hay uno con ese nombre, solo lo activa. Sin nombre, 'PLAYER n'.
  crear: function (nombre) {
    var p = this.deNivel(KF.dificultad.elegido), lista = p.lista, i;
    this.nuevo = false;
    nombre = nombre || this.PRIMERO + ' ' + (lista.length + 1);
    for (i = 0; i < lista.length; i++) {
      if (lista[i].nombre === nombre) { p.activo = lista[i].id; this.guardar(); return; }
    }
    if (lista.length >= this.MAXIMO) return;
    var usados = lista.map(function (x) { return x.id; }), id = 1;
    while (usados.indexOf(id) >= 0) id++;
    lista.push({ id: id, nombre: nombre });
    p.activo = id;
    this.guardar();
  },

  guardar: function () {
    try {
      window.localStorage.setItem(this.CLAVE, JSON.stringify(this.datos()));
    } catch (e) { /* sin almacenamiento: dura solo la sesión */ }
  },

  // Lo guardado, quedándose solo con lo que tenga sentido: el perfil 0
  // siempre está y el activo es uno de la lista.
  leer: function () {
    var datos, limpio = {}, self = this;
    try {
      datos = JSON.parse(window.localStorage.getItem(this.CLAVE));
    } catch (e) {
      datos = null;
    }
    KF.dificultad.NIVELES.forEach(function (nombre) {
      var d = datos && typeof datos === 'object' && datos[nombre];
      var lista = [{ id: 0, nombre: self.PRIMERO }], activo = 0;
      if (d && typeof d === 'object' && Array.isArray(d.lista)) {
        d.lista.forEach(function (x) {
          var ok = x && typeof x.id === 'number' && x.id > 0 && x.id < self.MAXIMO * 4 && Math.floor(x.id) === x.id &&
            typeof x.nombre === 'string' && x.nombre && lista.length < self.MAXIMO &&
            !lista.some(function (y) { return y.id === x.id; });
          if (ok) lista.push({ id: x.id, nombre: x.nombre.slice(0, 8) });
        });
        if (lista.some(function (y) { return y.id === d.activo; })) activo = d.activo;
      }
      limpio[nombre] = { activo: activo, lista: lista };
    });
    return limpio;
  }
};
