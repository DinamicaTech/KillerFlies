// Empezar tras un perfect (partida/empezar-tras-perfect): en la partida a uno,
// limpiar una oleada principal sin perder ninguna nave mientras dura (un
// 'perfect') guarda en el navegador, para esa dificultad, un punto de partida:
// la oleada siguiente con los puntos que tenía el jugador al destruir su última
// nave. Si se repite el perfect en la misma oleada se queda la mejor
// puntuación. Cada perfil de jugador (js/perfiles.js) tiene los suyos. En
// el menú de inicio, bajo la dificultad y el perfil, la línea
// '< FROM WAVE n >' (solo si esa dificultad tiene alguno) deja empezar desde
// cualquiera de ellos; Partida decide cuándo hay perfect y empieza la partida.
KF.perfect = {
  CLAVE: 'killerflies.perfect.',   // más el nivel y el perfil (js/perfiles.js): 'killerflies.perfect.HARD', 'killerflies.perfect.HARD.2'

  elegido: 0,              // punto de partida marcado en el menú (índice en lista())

  // Puntos de partida de un nivel de dificultad (por defecto el marcado en el
  // menú), de la oleada más baja a la más alta: [{ oleada, puntos }, …].
  lista: function (nivel) {
    var guardados = this.leer(nivel === undefined ? KF.dificultad.elegido : nivel);
    var lista = [];
    for (var oleada in guardados) lista.push({ oleada: +oleada, puntos: guardados[oleada] });
    return lista.sort(function (a, b) { return a.oleada - b.oleada; });
  },

  // El punto de partida marcado en el menú, o null si ese nivel no tiene.
  marcado: function () {
    var lista = this.lista();
    return lista.length ? lista[Math.min(this.elegido, lista.length - 1)] : null;
  },

  // Al cambiar de dificultad o volver al menú se marca el de oleada más alta.
  marcarUltimo: function () {
    this.elegido = Math.max(0, this.lista().length - 1);
  },

  // Cambia el punto de partida marcado (paso -1 o +1, dando la vuelta).
  cambiar: function (paso) {
    var n = this.lista().length;
    if (n) this.elegido = (this.elegido + paso + n) % n;
  },

  // Texto de la línea del menú, p. ej. '< FROM WAVE 4 >'.
  texto: function () {
    var m = this.marcado();
    return m ? '< FROM WAVE ' + m.oleada + ' >' : '';
  },

  // Clave de los perfects del perfil activo de un nivel; los del perfil 0 son
  // los de antes de haber perfiles.
  clave: function (nivel) {
    var id = KF.perfiles.activo(nivel);
    return this.CLAVE + KF.dificultad.NIVELES[nivel] + (id ? '.' + id : '');
  },

  // Perfect en la oleada n con esos puntos y ese nivel: guarda la oleada
  // siguiente como punto de partida, salvo que ya tuviera más puntos.
  anotar: function (nivel, oleada, puntos) {
    var guardados = this.leer(nivel), siguiente = oleada + 1;
    if (guardados[siguiente] >= puntos) return;
    guardados[siguiente] = puntos;
    try {
      window.localStorage.setItem(this.clave(nivel), JSON.stringify(guardados));
    } catch (e) { /* sin almacenamiento: no se guarda */ }
  },

  // { oleada: puntos } guardado para ese nivel y su perfil activo; lo que no
  // sea una oleada mayor que 1 con puntos válidos se ignora. Con
  // '< NEW PROFILE >' en el menú no hay ninguno.
  leer: function (nivel) {
    var guardados = {}, datos;
    if (KF.perfiles.nuevo && nivel === KF.dificultad.elegido) return guardados;
    try {
      datos = JSON.parse(window.localStorage.getItem(this.clave(nivel)));
    } catch (e) {
      datos = null;
    }
    if (!datos || typeof datos !== 'object') return guardados;
    for (var k in datos) {
      var oleada = parseInt(k, 10), puntos = datos[k];
      if (oleada > 1 && String(oleada) === k && typeof puntos === 'number' && puntos >= 0) guardados[oleada] = Math.floor(puntos);
    }
    return guardados;
  }
};

KF.perfect.marcarUltimo();
