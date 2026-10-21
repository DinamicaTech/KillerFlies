// Sonidos del juego, grabados en assets/sonidos y metidos en js/sonidos-datos.js
// (KF.SONIDOS_MP3), que se tocan con Web Audio: el disparo del jugador, las
// explosiones (de una nave enemiga, de una amarilla y del jugador), el sonido
// de las naves en picado, la recogida de un power-up, la música de inicio de
// cada oleada y la música de fondo, que se acelera a medida que quedan menos
// naves. Sonido solo observa el juego: no hace falta que las demás partes lo
// llamen. Los navegadores no dejan sonar nada hasta que el jugador pulsa una
// tecla o toca la pantalla, así que el audio se pone en marcha con la primera
// pulsación o el primer toque.
// La música (de fondo y de inicio de oleada) y los demás sonidos tienen cada
// uno su volumen (sonido/ajustes-sonido): 100%, 75%, 50%, 25% u OFF, que se
// cambian en el menú de pausa (js/pausa.js) y se recuerdan en el navegador.
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
    'musica-fondo': 0.225
  },
  MUSICA: ['musica-fondo', 'inicio-oleada'],   // los sonidos del grupo 'musica'; el resto son 'sonidos'
  PASOS: [1, 0.75, 0.5, 0.25, 0],               // niveles de volumen de cada grupo, de más a menos
  CLAVES: { musica: 'killerflies.musica', sonidos: 'killerflies.sonidos' },
  VELOCIDAD_MAXIMA: 2,     // la música de fondo con la última nave, al 200%

  ctx: null,               // AudioContext, creado al cargar y en marcha con la primera tecla o toque
  activado: false,         // ya ha habido una tecla o un toque
  salida: null,            // ganancia general
  salidas: {},             // grupo ('musica' o 'sonidos') -> su ganancia, conectada a la general
  niveles: { musica: 0, sonidos: 0 },   // grupo -> posición en PASOS (0, 100%)
  buffers: {},             // nombre -> AudioBuffer ya decodificado
  ataque: null,            // {fuente, ganancia} del sonido de ataque, siempre en marcha
  musica: null,            // {fuente, ganancia} de la música de fondo mientras suena
  musicaDesde: 0,          // momento (ctx.currentTime) en que empieza la música de fondo
  navesOleada: 1,          // naves de la oleada al empezar, para la velocidad de la música
  ultimasSalvas: 0,        // para notar cada disparo nuevo
  ultimasRecogidas: 0,     // para notar cada power-up recogido
  ultimasMonedas: 0,       // para notar cada moneda recogida
  ultimosImpactos: 0,      // para notar cada impacto en la nave nodriza jefe
  estadosJugador: [],      // estado de cada nave de jugador en el paso anterior
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
    ['musica', 'sonidos'].forEach(function (grupo) {
      var g = s.salidas[grupo] = ctx.createGain();
      g.gain.value = s.volumen(grupo);
      g.connect(s.salida);
    });
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

  grupo: function (nombre) {
    return this.MUSICA.indexOf(nombre) >= 0 ? 'musica' : 'sonidos';
  },

  // Volumen de un grupo, de 0 a 1.
  volumen: function (grupo) {
    return this.PASOS[this.niveles[grupo]];
  },

  // Texto del volumen de un grupo para el menú de pausa: '75%' u 'OFF'.
  textoVolumen: function (grupo) {
    var v = this.volumen(grupo);
    return v ? Math.round(v * 100) + '%' : 'OFF';
  },

  // Cambia el volumen de un grupo: paso +1 lo baja y -1 lo sube; con vuelta,
  // de OFF pasa a 100% (al elegir la opción), y sin ella se queda en el
  // extremo (flechas izquierda y derecha). Lo aplica y lo guarda.
  cambiarVolumen: function (grupo, paso, conVuelta) {
    var n = this.PASOS.length, i = this.niveles[grupo] + paso;
    if (conVuelta) i = (i + n) % n;
    else i = Math.max(0, Math.min(n - 1, i));
    this.niveles[grupo] = i;
    if (this.salidas[grupo]) this.salidas[grupo].gain.value = this.volumen(grupo);
    try {
      window.localStorage.setItem(this.CLAVES[grupo], String(Math.round(this.volumen(grupo) * 100)));
    } catch (e) { /* sin almacenamiento: dura solo la sesión */ }
  },

  // Los volúmenes guardados; lo que falte o no se entienda queda al 100%.
  leerVolumenes: function () {
    for (var grupo in this.CLAVES) {
      var i = 0;
      try {
        var v = window.localStorage.getItem(this.CLAVES[grupo]);
        if (v !== null) i = this.PASOS.indexOf(parseInt(v, 10) / 100);
      } catch (e) { i = 0; }
      this.niveles[grupo] = i >= 0 ? i : 0;
    }
  },

  iniciarAudio: function () {
    this.activado = true;
    this.ajustarSilencio();
  },

  // El audio se para con la pestaña oculta o la partida en pausa (js/pausa.js)
  // y vuelve al quitarse las dos cosas.
  ajustarSilencio: function () {
    if (!this.ctx || !this.activado) return;
    var callar = document.hidden || (KF.pausa && KF.pausa.activa);
    if (callar && this.ctx.state === 'running') this.ctx.suspend();
    else if (!callar && this.ctx.state === 'suspended') this.ctx.resume();
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
    g.connect(this.salidas[this.grupo(nombre)]);
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
    g.connect(this.salidas[this.grupo(nombre)]);
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
  // Se calla mientras no hay ninguna nave de jugador en juego.
  actualizarMusica: function () {
    if (this.estadoPartida !== 'jugando') { this.pararMusica(); return; }
    if (!this.buffers['musica-fondo'] || this.ctx.currentTime < this.musicaDesde) return;
    var t = this.ctx.currentTime;
    if (!this.musica) this.musica = this.bucle('musica-fondo');
    // Callada mientras la nave del jugador está destruida, hasta que sale la
    // de recambio; el bucle sigue corriendo, así que vuelve por donde iba.
    var volumen = KF.navesVivas().length ? this.VOLUMENES['musica-fondo'] : 0;
    this.musica.ganancia.gain.setTargetAtTime(volumen, t, 0.05);
    var naves = KF.formacion.naves, vivas = 0;
    for (var i = 0; i < naves.length; i++) if (naves[i].viva) vivas++;
    var total = this.navesOleada;
    var avance = total > 1 ? (total - Math.max(vivas, 1)) / (total - 1) : 1;
    // En la oleada desafío y con la nave nodriza, a la velocidad de partida.
    if (KF.desafio.activo || KF.jefe.activo) avance = 0;
    this.musica.fuente.playbackRate.setTargetAtTime(1 + (this.VELOCIDAD_MAXIMA - 1) * avance, t, 0.1);
  },

  actualizar: function () {
    var p = KF.partida, salvas = 0, jugadorExplota = false;
    for (var i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i];
      salvas += j.salvas;
      if (j.estado === 'explotando' && this.estadosJugador[i] !== 'explotando') jugadorExplota = true;
      this.estadosJugador[i] = j.estado;
    }
    var disparoNuevo = salvas !== this.ultimasSalvas;
    // Las monedas recogidas (js/monedas.js) suenan como un power-up.
    var powerUp = KF.powerups.recogidas !== this.ultimasRecogidas || KF.monedas.recogidas !== this.ultimasMonedas;
    var impacto = KF.jefe.impactos !== this.ultimosImpactos;
    var oleadaNueva = p.estado === 'jugando' &&
      (this.estadoPartida !== 'jugando' || p.oleada !== this.oleada);
    this.ultimasSalvas = salvas;
    this.ultimasRecogidas = KF.powerups.recogidas;
    this.ultimasMonedas = KF.monedas.recogidas;
    this.ultimosImpactos = KF.jefe.impactos;
    this.estadoPartida = p.estado;
    this.oleada = p.oleada;

    if (!this.ctx || !this.activado || document.hidden) return;
    if (oleadaNueva) this.empezarOleada();
    if (disparoNuevo) this.tocar('disparo');
    if (jugadorExplota) this.tocar('explosion-jugador');
    if (powerUp) this.tocar('power-up');
    // Cada impacto en la nave nodriza suena como una nave enemiga que explota.
    if (impacto && KF.jefe.activo) this.tocar('explosion-enemigo');
    this.actualizarAtaque();
    this.actualizarMusica();
  }
};

(function () {
  var s = KF.sonido;
  s.leerVolumenes();
  s.crearContexto();
  window.addEventListener('keydown', function () { s.iniciarAudio(); });
  document.addEventListener('touchend', function () { s.iniciarAudio(); });
  // Con la pestaña oculta el juego se detiene: el sonido también.
  document.addEventListener('visibilitychange', function () { s.ajustarSilencio(); });
  KF.enemigos.alDestruir(function (nave) {
    if (!s.ctx || !s.activado || document.hidden || KF.pausa.activa) return;
    s.tocar(nave.tipo === 'amarilla' || nave.tipo === 'nodriza' ? 'explosion-amarilla' : 'explosion-enemigo');
  });
})();

KF.registrar(KF.sonido);
