// El marcador: oleada/oleada máxima arriba a la izquierda, puntos/puntos
// máximos arriba a la derecha y las naves de recambio abajo a la derecha.
// En la partida a dos, los puntos de cada jugador van arriba a la derecha en
// el color de su nave (J1 encima de J2) y sus naves de recambio abajo, las de
// J1 a la izquierda y las de J2 a la derecha.
// Los máximos se guardan en el navegador (localStorage) en cuanto se superan,
// aparte los de la partida a dos, que cuentan los puntos del jugador de este
// dispositivo. Partida decide la oleada y las naves de recambio; los puntos
// son de cada nave (KF.Nave.puntos) y el marcador solo los muestra.
KF.marcador = {
  MARGEN: 4,            // píxeles desde el borde de la pantalla
  COLOR: '#ffffff',
  CLAVE_OLEADA: 'killerflies.oleadaMaxima',
  CLAVE_PUNTOS: 'killerflies.puntosMaximos',
  CLAVE_OLEADA_DOS: 'killerflies.dos.oleadaMaxima',
  CLAVE_PUNTOS_DOS: 'killerflies.dos.puntosMaximos',

  dos: false,           // los máximos son los de la partida a dos
  oleada: 1,
  oleadaMaxima: 1,
  puntosMaximos: 0,

  // Récords de la partida a uno o a dos; lo llama Partida al empezar.
  cambiarModo: function (dos) {
    this.dos = dos;
    this.oleadaMaxima = Math.max(1, this.leer(this.claveOleada()));
    this.puntosMaximos = this.leer(this.clavePuntos());
  },

  claveOleada: function () { return this.dos ? this.CLAVE_OLEADA_DOS : this.CLAVE_OLEADA; },
  clavePuntos: function () { return this.dos ? this.CLAVE_PUNTOS_DOS : this.CLAVE_PUNTOS; },

  ponerOleada: function (n) {
    this.oleada = n;
    if (this.oleada > this.oleadaMaxima) {
      this.oleadaMaxima = this.oleada;
      this.guardar(this.claveOleada(), this.oleadaMaxima);
    }
  },

  // Los puntos del jugador de este dispositivo pueden batir el récord.
  actualizar: function () {
    var puntos = KF.jugador.puntos;
    if (puntos > this.puntosMaximos) {
      this.puntosMaximos = puntos;
      this.guardar(this.clavePuntos(), this.puntosMaximos);
    }
  },

  // El almacenamiento puede no estar disponible (navegación privada, ficheros
  // locales en algunos navegadores): entonces los máximos duran solo la sesión.
  leer: function (clave) {
    try {
      var v = parseInt(window.localStorage.getItem(clave), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  },

  guardar: function (clave, valor) {
    try {
      window.localStorage.setItem(clave, String(valor));
    } catch (e) { /* sin almacenamiento: no se guarda */ }
  },

  // Ancho en píxeles de un texto con la fuente de graficos.
  anchoTexto: function (texto) {
    return KF.graficos.anchoTexto(texto);
  },

  escribir: function (ctx, texto, x, y, letras) {
    KF.graficos.escribir(ctx, letras || this.LETRAS, texto, x, y);
  },

  // Naves de recambio de un jugador pegadas al borde inferior, desde la
  // derecha hacia la izquierda o (desde la izquierda) hacia la derecha.
  dibujarRecambio: function (ctx, jugador, desdeIzquierda) {
    var s = jugador.SPRITE, m = this.MARGEN;
    for (var i = 0; i < jugador.recambio; i++) {
      var dx = m + s.width / 2 + i * (s.width + 2);
      var x = desdeIzquierda ? dx : KF.ANCHO - dx;
      KF.graficos.dibujar(ctx, s, x, KF.ALTO - 1 - s.height / 2);
    }
  },

  dibujar: function (ctx) {
    var m = this.MARGEN;
    this.escribir(ctx, this.oleada + '/' + this.oleadaMaxima, m, m);
    if (!KF.companero) {
      var puntos = KF.jugador.puntos + '/' + this.puntosMaximos;
      this.escribir(ctx, puntos, KF.ANCHO - m - this.anchoTexto(puntos), m);
      this.dibujarRecambio(ctx, KF.jugador, false);
      return;
    }
    // A dos: J1 y J2 por su número, sea cual sea el de este dispositivo.
    var porNumero = [];
    for (var i = 0; i < KF.jugadores.length; i++) porNumero[KF.jugadores[i].numero - 1] = KF.jugadores[i];
    for (i = 0; i < 2; i++) {
      var texto = 'J' + (i + 1) + ' ' + porNumero[i].puntos;
      this.escribir(ctx, texto, KF.ANCHO - m - this.anchoTexto(texto), m + i * 9, this.LETRAS_JUGADOR[i]);
    }
    this.dibujarRecambio(ctx, porNumero[0], true);
    this.dibujarRecambio(ctx, porNumero[1], false);
  }
};

(function () {
  var mk = KF.marcador;
  mk.LETRAS = KF.graficos.crearFuente(mk.COLOR);
  mk.LETRAS_JUGADOR = KF.graficos.COLORES_JUGADOR.map(function (c) { return KF.graficos.crearFuente(c); });
  mk.cambiarModo(false);

  // Cada nave destruida, por disparo o por choque, da sus puntos al jugador
  // que la ha destruido.
  KF.enemigos.alDestruir(function (nave, motivo, autor) {
    if (autor) autor.puntos += KF.TIPOS_NAVE[nave.tipo].puntos;
  });
})();

// Se registra el último para dibujarse encima de todo.
KF.registrar(KF.marcador);
