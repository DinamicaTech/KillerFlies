// Efectos de sonido sintetizados con Web Audio, sin ficheros: el disparo del
// jugador, la explosión de cualquier nave y el zumbido de las naves en picado.
// Sonido solo observa el juego: no hace falta que las demás partes lo llamen.
// Los navegadores no dejan sonar nada hasta que el jugador pulsa una tecla o
// toca la pantalla, así que el audio se pone en marcha con la primera pulsación
// o el primer toque.
KF.sonido = {
  VOLUMEN: 0.5,
  VOLUMEN_ZUMBIDO: 0.04,

  ctx: null,              // AudioContext, creado con la primera tecla o toque
  salida: null,           // ganancia general
  ruido: null,            // buffer de ruido blanco para las explosiones
  zumbido: null,          // {osc, ganancia} del zumbido, siempre en marcha
  ultimoDisparo: null,   // para notar cada disparo nuevo (es otro objeto)
  estadoJugador: 'viva',

  iniciarAudio: function () {
    if (this.ctx) {
      if (this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume();
      return;
    }
    var Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return;
    var ctx = this.ctx = new Contexto();
    this.salida = ctx.createGain();
    this.salida.gain.value = this.VOLUMEN;
    this.salida.connect(ctx.destination);

    var muestras = ctx.sampleRate;  // un segundo de ruido
    this.ruido = ctx.createBuffer(1, muestras, ctx.sampleRate);
    var datos = this.ruido.getChannelData(0);
    for (var i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;

    // Zumbido: diente de sierra con vibrato rápido, filtrado. Suena siempre
    // y se oye o no según su ganancia.
    var osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 300;
    var vibrato = ctx.createOscillator();
    vibrato.frequency.value = 14;
    var profundidad = ctx.createGain();
    profundidad.gain.value = 25;
    vibrato.connect(profundidad);
    profundidad.connect(osc.frequency);
    var filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 1500;
    var ganancia = ctx.createGain();
    ganancia.gain.value = 0;
    osc.connect(filtro);
    filtro.connect(ganancia);
    ganancia.connect(this.salida);
    osc.start();
    vibrato.start();
    this.zumbido = { osc: osc, ganancia: ganancia };
  },

  // "Piu": onda cuadrada que cae rápido de agudo a grave.
  disparo: function () {
    var ctx = this.ctx, t = ctx.currentTime;
    var osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(this.salida);
    osc.start(t);
    osc.stop(t + 0.16);
  },

  // Ruido filtrado que se apaga; la del jugador es más grave, fuerte y larga.
  explosion: function (delJugador) {
    var ctx = this.ctx, t = ctx.currentTime;
    var duracion = delJugador ? 1.2 : 0.5;
    var fuente = ctx.createBufferSource();
    fuente.buffer = this.ruido;
    fuente.loop = true;
    var filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(delJugador ? 1200 : 2500, t);
    filtro.frequency.exponentialRampToValueAtTime(100, t + duracion);
    var g = ctx.createGain();
    g.gain.setValueAtTime(delJugador ? 0.8 : 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duracion);
    fuente.connect(filtro);
    filtro.connect(g);
    g.connect(this.salida);
    fuente.start(t);
    fuente.stop(t + duracion);
  },

  // El zumbido suena mientras alguna nave sale de la formación o baja en
  // picado; se agrava a medida que la nave más alta de ellas desciende.
  actualizarZumbido: function () {
    var masAlta = null;
    var atacantes = KF.ataque.atacantes;
    for (var i = 0; i < atacantes.length; i++) {
      var a = atacantes[i];
      if (!a.nave.viva || a.fase === 'vuelta') continue;
      if (masAlta === null || a.y < masAlta) masAlta = a.y;
    }
    var t = this.ctx.currentTime;
    var z = this.zumbido;
    z.ganancia.gain.setTargetAtTime(masAlta === null ? 0 : this.VOLUMEN_ZUMBIDO, t, 0.03);
    if (masAlta !== null) {
      var y = Math.max(0, Math.min(KF.ALTO, masAlta));
      z.osc.frequency.setTargetAtTime(420 - 240 * y / KF.ALTO, t, 0.05);
    }
  },

  actualizar: function () {
    var j = KF.jugador;
    var disparoNuevo = j.disparo && j.disparo !== this.ultimoDisparo;
    var jugadorExplota = j.estado === 'explotando' && this.estadoJugador !== 'explotando';
    this.ultimoDisparo = j.disparo;
    this.estadoJugador = j.estado;

    if (!this.ctx || this.ctx.state !== 'running') return;
    if (disparoNuevo) this.disparo();
    if (jugadorExplota) this.explosion(true);
    this.actualizarZumbido();
  }
};

(function () {
  var s = KF.sonido;
  window.addEventListener('keydown', function () { s.iniciarAudio(); });
  document.addEventListener('touchend', function () { s.iniciarAudio(); });
  // Con la pestaña oculta el juego se detiene: el sonido también.
  document.addEventListener('visibilitychange', function () {
    if (!s.ctx) return;
    if (document.hidden) s.ctx.suspend(); else s.ctx.resume();
  });
  KF.enemigos.alDestruir(function () {
    if (s.ctx && s.ctx.state === 'running') s.explosion(false);
  });
})();

KF.registrar(KF.sonido);
