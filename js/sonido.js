// Sonidos del juego, grabados en assets/sonidos y metidos en js/sonidos-datos.js
// (KF.SONIDOS_MP3), que se tocan con Web Audio: el disparo del jugador, las
// explosiones (de una nave enemiga, de una amarilla y del jugador), el sonido
// de las naves en picado, la recogida de un power-up, la música de inicio de
// cada oleada y la música de fondo, que se acelera a medida que quedan menos
// naves. Sonido solo observa el juego: no hace falta que las demás partes lo
// llamen. Los navegadores no dejan sonar nada hasta que el jugador pulsa una
// tecla o toca la pantalla, así que el audio se pone en marcha con la primera
// pulsación o el primer toque.
KF.sonido = {
  VOLUMEN: 1,
  // Volumen de cada sonido, para mantener el orden de antes: la explosión del
  // jugador la más fuerte, luego la de las naves, el disparo, y por debajo el
  // sonido de ataque y la música de fondo.
  VOLUMENES: {
    'explosion-jugador': 1,
    'explosion-amarilla': 0.85,
    'explosion-enemigo': 0.75,
    'inicio-oleada': 0.8,
    'power-up': 0.8,
    'disparo': 0.5,
    'ataque': 0.35,
    'musica-fondo': 0.3
  },
  VELOCIDAD_MAXIMA: 2,     // la música de fondo con la última nave, al 200%

  ctx: null,               // AudioContext, creado al cargar y en marcha con la primera tecla o toque
  activado: false,         // ya ha habido una tecla o un toque
  salida: null,            // ganancia general
  buffers: {},             // nombre -> AudioBuffer ya decodificado
  ataque: null,            // {fuente, ganancia} del sonido de ataque, siempre en marcha
  musica: null,            // {fuente, ganancia} de la música de fondo mientras suena
  musicaDesde: 0,          // momento (ctx.currentTime) en que empieza la música de fondo
  navesOleada: 1,          // naves de la oleada al empezar, para la velocidad de la música
  ultimasSalvas: 0,        // para notar cada disparo nuevo
  ultimasRecogidas: 0,     // para notar cada power-up recogido
  estadoJugador: 'viva',
  estadoPartida: 'inicio',
  oleada: 1,

  crearContexto: function () {
    var Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto || !KF.SONIDOS_MP3) return;
    var ctx = this.ctx = new Contexto();
    this.salida = ctx.createGain();
    this.salida.gain.value = this.VOLUMEN;
    this.salida.connect(ctx.destination);
    var s = this;
    Object.keys(KF.SONIDOS_MP3).forEach(function (nombre) {
      var binario = atob(KF.SONIDOS_MP3[nombre]);
      var bytes = new Uint8Array(binario.length);
      for (var i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
      // Forma con funciones de vuelta: la única que entienden los Safari antiguos.
      ctx.decodeAudioData(bytes.buffer, function (buffer) {
        s.buffers[nombre] = buffer;
        if (nombre === 'ataque') s.ponerAtaque();
      }, function () {});
    });
  },

  iniciarAudio: function () {
    this.activado = true;
    if (this.ctx && this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume();
  },

  // Tramo con sonido de un buffer, sin el silencio que el MP3 añade al
  // principio y al final, para que los bucles enlacen sin hueco.
  tramoSonoro: function (buffer) {
    var datos = buffer.getChannelData(0), n = datos.length;
    var inicio = 0, fin = n;
    while (inicio < n && Math.abs(datos[inicio]) < 0.003) inicio++;
    while (fin > inicio && Math.abs(datos[fin - 1]) < 0.003) fin--;
    return { inicio: inicio / buffer.sampleRate, fin: fin / buffer.sampleRate };
  },

  // Toca un sonido una vez; devuelve su fuente, o null si aún no está listo.
  tocar: function (nombre) {
    var buffer = this.buffers[nombre];
    if (!buffer) return null;
    var fuente = this.ctx.createBufferSource();
    fuente.buffer = buffer;
    var g = this.ctx.createGain();
    g.gain.value = this.VOLUMENES[nombre];
    fuente.connect(g);
    g.connect(this.salida);
    fuente.start();
    return fuente;
  },

  // Un sonido en bucle, con su ganancia, que empieza en silencio.
  bucle: function (nombre) {
    var buffer = this.buffers[nombre];
    var tramo = this.tramoSonoro(buffer);
    var fuente = this.ctx.createBufferSource();
    fuente.buffer = buffer;
    fuente.loop = true;
    fuente.loopStart = tramo.inicio;
    fuente.loopEnd = tramo.fin;
    var g = this.ctx.createGain();
    g.gain.value = 0;
    fuente.connect(g);
    g.connect(this.salida);
    fuente.start(0, tramo.inicio);
    return { fuente: fuente, ganancia: g };
  },

  // El sonido de ataque suena siempre en bucle y se oye o no según su ganancia.
  ponerAtaque: function () {
    this.ataque = this.bucle('ataque');
  },

  // Suena mientras alguna nave sale de la formación o baja en picado.
  actualizarAtaque: function () {
    if (!this.ataque) return;
    var atacando = false;
    var atacantes = KF.ataque.atacantes;
    for (var i = 0; i < atacantes.length; i++) {
      if (atacantes[i].nave.viva && atacantes[i].fase !== 'vuelta') { atacando = true; break; }
    }
    this.ataque.ganancia.gain.setTargetAtTime(atacando ? this.VOLUMENES.ataque : 0,
      this.ctx.currentTime, 0.03);
  },

  // Cada oleada (también la primera, al empezar la partida) empieza con su
  // música; la de fondo se calla mientras tanto y vuelve cuando acaba.
  empezarOleada: function () {
    this.pararMusica();
    var fuente = this.tocar('inicio-oleada');
    var duracion = fuente ? this.tramoSonoro(fuente.buffer).fin : 0;
    this.musicaDesde = this.ctx.currentTime + duracion;
    this.navesOleada = KF.formacion.naves.length;
  },

  pararMusica: function () {
    if (!this.musica) return;
    this.musica.fuente.stop();
    this.musica = null;
  },

  // La música de fondo va al 100% con la oleada entera y se acelera hasta el
  // 200% con la última nave (el tono sube con la velocidad, como una cinta).
  actualizarMusica: function () {
    if (this.estadoPartida !== 'jugando') { this.pararMusica(); return; }
    if (!this.buffers['musica-fondo'] || this.ctx.currentTime < this.musicaDesde) return;
    var t = this.ctx.currentTime;
    if (!this.musica) {
      this.musica = this.bucle('musica-fondo');
      this.musica.ganancia.gain.setTargetAtTime(this.VOLUMENES['musica-fondo'], t, 0.05);
    }
    var naves = KF.formacion.naves, vivas = 0;
    for (var i = 0; i < naves.length; i++) if (naves[i].viva) vivas++;
    var total = this.navesOleada;
    var avance = total > 1 ? (total - Math.max(vivas, 1)) / (total - 1) : 1;
    this.musica.fuente.playbackRate.setTargetAtTime(1 + (this.VELOCIDAD_MAXIMA - 1) * avance, t, 0.1);
  },

  actualizar: function () {
    var j = KF.jugador, p = KF.partida;
    var disparoNuevo = j.salvas !== this.ultimasSalvas;
    var jugadorExplota = j.estado === 'explotando' && this.estadoJugador !== 'explotando';
    var powerUp = KF.powerups.recogidas !== this.ultimasRecogidas;
    var oleadaNueva = p.estado === 'jugando' &&
      (this.estadoPartida !== 'jugando' || p.oleada !== this.oleada);
    this.ultimasSalvas = j.salvas;
    this.estadoJugador = j.estado;
    this.ultimasRecogidas = KF.powerups.recogidas;
    this.estadoPartida = p.estado;
    this.oleada = p.oleada;

    if (!this.ctx || !this.activado || document.hidden) return;
    if (oleadaNueva) this.empezarOleada();
    if (disparoNuevo) this.tocar('disparo');
    if (jugadorExplota) this.tocar('explosion-jugador');
    if (powerUp) this.tocar('power-up');
    this.actualizarAtaque();
    this.actualizarMusica();
  }
};

(function () {
  var s = KF.sonido;
  s.crearContexto();
  window.addEventListener('keydown', function () { s.iniciarAudio(); });
  document.addEventListener('touchend', function () { s.iniciarAudio(); });
  // Con la pestaña oculta el juego se detiene: el sonido también.
  document.addEventListener('visibilitychange', function () {
    if (!s.ctx || !s.activado) return;
    if (document.hidden) s.ctx.suspend(); else s.ctx.resume();
  });
  KF.enemigos.alDestruir(function (nave) {
    if (!s.ctx || !s.activado || document.hidden) return;
    s.tocar(nave.tipo === 'amarilla' ? 'explosion-amarilla' : 'explosion-enemigo');
  });
})();

KF.registrar(KF.sonido);
