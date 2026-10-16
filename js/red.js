// Partida a dos, cada jugador en su dispositivo, con conexión directa entre
// los dos navegadores (WebRTC, con la librería PeerJS de js/lib).
// - Crear partida: este dispositivo es el anfitrión (J1). Abre una sala con un
//   código de 4 letras en el servidor gratuito de PeerJS, que solo sirve para
//   presentar los dos dispositivos, y la muestra con un QR del enlace del
//   juego con ?room=CÓDIGO.
// - Unirse: el invitado (J2) escribe el código o abre el enlace del QR.
// El anfitrión mueve todo el juego y envía 30 veces por segundo una foto de
// su estado; el invitado la dibuja interpolando entre las dos últimas fotos
// (RETRASO por detrás) y mueve su propia nave al momento, enviando su
// posición y los disparos que pide. Las explosiones y los sonidos del invitado
// salen de los cambios entre una foto y la siguiente, así que perder un
// mensaje no importa: la siguiente foto lo sustituye.
// Si se deja de recibir al otro jugador, la partida se pausa y se espera a
// que vuelva; pasados ESPERA_VUELTA segundos el anfitrión sigue solo y el
// invitado vuelve al menú.
// Tras 'GAME OVER' la conexión sigue abierta: cada jugador vuelve al menú de
// inicio, que ofrece 'PLAY AGAIN' mientras los dos sigan conectados, y con
// que uno la elija empieza otra partida en los dos dispositivos. Elegir otra
// opción, o perder la conexión estando en el menú, deja la partida a dos.
// Para probar en local se puede usar otro servidor de PeerJS con
// ?servidor=host:puerto en la dirección.
KF.red = {
  PREFIJO: 'killerflies-',
  LETRAS_CODIGO: 'ABCDEFGHJKLMNPQRSTUVWXYZ',  // sin I ni O, que se confunden
  ENVIOS: 30,              // mensajes por segundo en cada sentido
  RETRASO: 80,             // milisegundos que el dibujo va por detrás de lo recibido
  SIN_NOTICIAS: 2,         // segundos sin mensajes del otro para pausar
  ESPERA_VUELTA: 30,       // segundos de pausa antes de darlo por perdido
  REINTENTO: 2,            // segundos entre intentos del invitado de volver a conectar
  ESPERA_UNIRSE: 10,       // segundos para conectar con la sala antes de darla por inexistente
  SIN_NOTICIAS_MENU: 10,   // segundos sin mensajes del otro en el menú para dejar la partida a dos
  COLOR: '#ffff40',
  COLOR_SECUNDARIO: '#808080',
  ESTADOS_NAVE: ['ausente', 'viva', 'explotando'],

  anfitrion: false,
  invitado: false,
  fase: null,              // null | 'sala' | 'uniendo' | 'jugando' | 'pausa' | 'solo' | 'menu' | 'error'
  rol: 0,                  // en el menú, 1 si este dispositivo era el anfitrión y 2 si el invitado
  mensaje: '',             // texto del error
  codigo: '',
  peer: null,
  conexion: null,
  qr: null,                // lienzo con el QR de la sala
  desdeUltimo: 0,          // segundos desde el último mensaje del otro
  tiempoPausa: 0,
  tiempoUniendo: 0,
  esperaEnvio: 0,
  esperaReintento: 0,
  enPausa: true,           // se actualiza también con la partida en pausa

  // Invitado: fotos recibidas y la última aplicada. Anfitrión: posiciones
  // recibidas de la nave del invitado y sus disparos pedidos.
  fotos: null,
  fotoAplicada: null,
  entradas: null,
  peticiones: 0,
  // Número de la partida a dos (crece con cada 'PLAY AGAIN'), para no mezclar
  // fotos de la partida anterior con las de la nueva.
  partidaNumero: 0,
  pideOtra: false,         // invitado: ha elegido 'PLAY AGAIN' (o RESTART en la pausa) y espera la partida nueva

  // Hay una partida a dos en marcha o preparándose; en el menú, con los dos
  // conectados, no: el menú funciona como siempre.
  activa: function () {
    return this.fase !== null && this.fase !== 'solo' && this.fase !== 'menu';
  },

  opciones: function () {
    var m = /[?&]servidor=([^&:]+):(\d+)/.exec(location.search);
    return m ? { host: m[1], port: +m[2], path: '/', secure: false } : {};
  },

  // Anfitrión: abre una sala con un código al azar y espera al invitado.
  crear: function () {
    var r = this;
    this.cerrar();
    this.fase = 'sala';
    this.mensaje = '';
    this.codigo = '';
    for (var i = 0; i < 4; i++) {
      this.codigo += this.LETRAS_CODIGO[Math.floor(Math.random() * this.LETRAS_CODIGO.length)];
    }
    this.qr = this.crearQR(location.origin + location.pathname + '?room=' + this.codigo);
    var peer = this.peer = new Peer(this.PREFIJO + this.codigo, this.opciones());
    peer.on('connection', function (con) { r.aceptar(con); });
    peer.on('disconnected', function () { if (r.peer === peer && !peer.destroyed) peer.reconnect(); });
    peer.on('error', function (e) {
      if (r.peer !== peer) return;
      // Código ya en uso: otro.
      if (e.type === 'unavailable-id' && r.fase === 'sala') r.crear();
      else if (r.fase === 'sala') r.fallar('NO CONNECTION');
    });
  },

  // Anfitrión: llega el invitado (o vuelve tras perder la conexión).
  aceptar: function (con) {
    var r = this;
    if (this.fase !== 'sala' && this.fase !== 'pausa') { con.close(); return; }
    con.on('open', function () {
      if (r.conexion && r.conexion !== con) r.conexion.close();
      r.conexion = con;
      r.desdeUltimo = 0;
      if (r.fase === 'sala') {
        r.anfitrion = true;
        r.entradas = new KF.Muestras();
        r.peticiones = 0;
        KF.companero = new KF.Nave(2);
        KF.companero.remoto = true;
        KF.jugadores = [KF.jugador, KF.companero];
        r.partidaNumero = 1;
        KF.partida.empezar();
      }
      r.reanudar();
    });
    con.on('data', function (m) { if (con === r.conexion) r.recibir(m); });
    con.on('close', function () { if (con === r.conexion) r.perder(); });
  },

  // Pide el código de la sala y se une a ella.
  pedirCodigo: function () {
    var codigo = window.prompt('Room code');
    codigo = (codigo || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (codigo.length === 4) this.unirse(codigo);
  },

  // Invitado: se une a la sala del código.
  unirse: function (codigo) {
    var r = this;
    this.cerrar();
    this.fase = 'uniendo';
    this.tiempoUniendo = 0;
    this.mensaje = '';
    this.codigo = codigo;
    var peer = this.peer = new Peer(this.opciones());
    peer.on('open', function () { r.conectar(); });
    peer.on('disconnected', function () { if (r.peer === peer && !peer.destroyed) peer.reconnect(); });
    peer.on('error', function (e) {
      if (r.peer !== peer) return;
      if (r.fase === 'uniendo') r.fallar(e.type === 'peer-unavailable' ? 'ROOM NOT FOUND' : 'NO CONNECTION');
    });
  },

  conectar: function () {
    var r = this;
    var con = this.peer.connect(this.PREFIJO + this.codigo, { reliable: false, serialization: 'json' });
    con.on('open', function () {
      if (r.conexion && r.conexion !== con) r.conexion.close();
      r.conexion = con;
      r.desdeUltimo = 0;
      if (r.fase === 'uniendo') {
        r.invitado = true;
        r.fotos = [];
        r.fotoAplicada = null;
        r.desfase = null;
        r.partidaNumero = 0;
        r.pideOtra = false;
        // La nave de este dispositivo es la J2; la J1 la mueve el anfitrión.
        KF.companero = new KF.Nave(1);
        KF.companero.remoto = true;
        KF.jugador = new KF.Nave(2);
        KF.jugadores = [KF.companero, KF.jugador];
        KF.marcador.cambiarModo(true);
      }
      r.reanudar();
    });
    con.on('data', function (m) { if (con === r.conexion) r.recibir(m); });
    con.on('close', function () { if (con === r.conexion) r.perder(); });
  },

  reanudar: function () {
    this.fase = 'jugando';
    KF.pausado = false;
  },

  // Se ha perdido la conexión: pausa, salvo si la partida ya ha acabado.
  perder: function () {
    if (this.fase === 'menu') { this.soltar(); return; }
    if (this.fase !== 'jugando') return;
    if (KF.partida.estado !== 'jugando') {
      // Tras 'GAME OVER' no hay nada que esperar ni otra partida que jugar.
      this.fase = 'solo';
      return;
    }
    this.fase = 'pausa';
    this.tiempoPausa = 0;
    this.esperaReintento = this.REINTENTO;
    KF.pausado = true;
  },

  // La pausa ha durado demasiado: el anfitrión sigue solo, el invitado no
  // puede seguir sin él.
  rendirse: function () {
    if (this.anfitrion) {
      KF.companero.recambio = 0;
      KF.companero.retirar();
      this.desconectar();
      this.fase = 'solo';
      KF.pausado = false;
    } else {
      this.desconectar();
      this.fallar('CONNECTION LOST');
    }
  },

  fallar: function (mensaje) {
    this.desconectar();
    this.fase = 'error';
    this.mensaje = mensaje;
    KF.pausado = false;
  },

  desconectar: function () {
    var peer = this.peer, con = this.conexion;
    this.peer = null;
    this.conexion = null;
    if (con) con.close();
    if (peer) peer.destroy();
  },

  // Deja la partida a dos y vuelve a una sola nave, la J1 de este dispositivo.
  cerrar: function () {
    this.desconectar();
    var eraInvitado = this.invitado || (this.fase === 'menu' && this.rol === 2);
    this.fase = null;
    this.rol = 0;
    this.pideOtra = false;
    this.anfitrion = this.invitado = false;
    KF.pausado = false;
    if (KF.companero || eraInvitado) {
      KF.jugador = new KF.Nave(1);
      KF.companero = null;
      KF.jugadores = [KF.jugador];
    }
  },

  enviar: function (m) {
    if (this.conexion && this.conexion.open) this.conexion.send(m);
  },

  // Tras 'GAME OVER', este jugador vuelve al menú de inicio sin cortar la
  // conexión. Mientras está en el menú no es ni anfitrión ni invitado, para
  // que la formación se mueva detrás del menú como en la partida a uno.
  alMenu: function () {
    this.fase = 'menu';
    this.rol = this.anfitrion ? 1 : 2;
    this.anfitrion = this.invitado = false;
    this.pideOtra = false;
    this.desdeUltimo = 0;
  },

  // El otro jugador se ha ido estando en el menú: desaparece 'PLAY AGAIN'.
  soltar: function () {
    this.cerrar();
    KF.marcador.cambiarModo(false);
    KF.partida.opcion = Math.max(0, KF.partida.opcion - 1);
  },

  // 'PLAY AGAIN' elegida en el menú: el anfitrión empieza la partida; el
  // invitado se la pide en cada mensaje hasta que ve llegar la nueva.
  elegirOtra: function () {
    if (this.rol === 1) this.otraPartida();
    else {
      this.pideOtra = true;
      this.enviarYa();
    }
  },

  // Pausa de este jugador: RESTART. El anfitrión empieza otra partida; el
  // invitado se la pide en cada mensaje hasta que ve llegar la nueva.
  reiniciar: function () {
    if (this.anfitrion) this.otraPartida();
    else {
      this.pideOtra = true;
      this.enviarYa();
    }
  },

  // Anfitrión: otra partida con el mismo invitado, desde el menú, desde
  // 'GAME OVER' si el invitado la pide antes de que este jugador salga, o
  // desde la pausa (RESTART), que se acaba en los dos dispositivos.
  otraPartida: function () {
    this.anfitrion = true;
    this.rol = 0;
    this.fase = 'jugando';
    this.desdeUltimo = 0;
    this.entradas = new KF.Muestras();
    this.partidaNumero++;
    KF.pausado = false;
    if (KF.pausa.activa) KF.pausa.poner(false, 0, KF.pausa.version + 1);
    KF.partida.empezar();
    this.enviarYa();
  },

  recibir: function (m) {
    this.desdeUltimo = 0;
    if (this.fase === 'menu') {
      if (this.rol === 1 && m.o) this.otraPartida();
      else if (this.rol === 2 && m.f === 'e' && m.g > this.partidaNumero) {
        // El anfitrión ha empezado otra partida.
        this.invitado = true;
        this.rol = 0;
        this.fase = 'jugando';
        this.pideOtra = false;
        this.meterFoto(m);
      }
      return;
    }
    if (this.anfitrion && m.f === 'm') {
      if (m.o && KF.partida.estado === 'fin') this.otraPartida();
      return;
    }
    if (this.fase === 'pausa') this.reanudar();
    // El invitado, que ha pausado, elige RESTART.
    if (this.anfitrion && m.f === 'n' && m.o && KF.pausa.activa && KF.pausa.quien === 2) {
      this.otraPartida();
      return;
    }
    if ((this.anfitrion && m.f === 'n') || (this.invitado && m.f === 'e')) KF.pausa.recibir(m.z, m.zv, this.invitado);
    if (this.anfitrion && m.f === 'n') this.entradas.meter(m);
    else if (this.invitado && m.f === 'e') this.meterFoto(m);
  },

  actualizar: function (dt) {
    if (this.fase === 'menu') {
      this.desdeUltimo += dt;
      if (this.desdeUltimo >= this.SIN_NOTICIAS_MENU) { this.soltar(); return; }
      this.esperaEnvio -= dt;
      if (this.esperaEnvio <= 0) this.enviarYa();
      return;
    }
    if (this.fase === 'uniendo') {
      this.tiempoUniendo += dt;
      if (this.tiempoUniendo >= this.ESPERA_UNIRSE) this.fallar('ROOM NOT FOUND');
    }
    if (this.fase === 'jugando' || this.fase === 'pausa') {
      this.desdeUltimo += dt;
      if (this.fase === 'jugando' && this.desdeUltimo >= this.SIN_NOTICIAS) this.perder();
    }
    if (this.fase === 'pausa') {
      this.tiempoPausa += dt;
      if (this.tiempoPausa >= this.ESPERA_VUELTA) { this.rendirse(); return; }
      // El invitado vuelve a llamar a la sala de vez en cuando.
      this.esperaReintento -= dt;
      if (this.invitado && this.esperaReintento <= 0 && this.peer && this.peer.open) {
        this.esperaReintento = this.REINTENTO;
        this.conectar();
      }
    }
    if (this.fase !== 'jugando' && this.fase !== 'pausa') return;

    if (this.anfitrion) this.moverCompanero();
    else this.aplicarFotos();

    this.esperaEnvio -= dt;
    if (this.esperaEnvio > 0) return;
    this.enviarYa();
  },

  // Envía ya el mensaje de este dispositivo: la foto del anfitrión o la nave
  // del invitado, con el estado de la pausa (js/pausa.js); en el menú, solo
  // que sigue ahí y si pide otra partida.
  enviarYa: function () {
    if (this.fase === 'menu') {
      this.esperaEnvio = 1 / this.ENVIOS;
      this.enviar({ f: 'm', o: this.pideOtra ? 1 : 0 });
      return;
    }
    if (this.fase !== 'jugando' && this.fase !== 'pausa') return;
    this.esperaEnvio = 1 / this.ENVIOS;
    var m;
    if (this.anfitrion) m = this.foto();
    else {
      var j = KF.jugador;
      m = { f: 'n', t: performance.now(), x: KF.redondear(j.x), vx: KF.redondear(j.vx), d: j.peticiones, o: this.pideOtra ? 1 : 0 };
    }
    m.z = KF.pausa.quien;
    m.zv = KF.pausa.version;
    this.enviar(m);
  },

  // Anfitrión: la nave del invitado va donde él la ha movido, y dispara
  // cuando él lo pide.
  moverCompanero: function () {
    var c = KF.companero, m = this.entradas.muestra(this.RETRASO);
    if (!m) return;
    if (c.estado === 'viva') {
      c.x = KF.mezclar(m.a.x, m.b.x, m.k);
      c.vx = m.b.vx;
    }
    var d = this.entradas.ultima.d;
    if (d > this.peticiones) {
      this.peticiones = d;
      if (c.estado === 'viva') c.disparar();
    }
  },

  // Anfitrión: foto del estado del juego, con números redondeados.
  foto: function () {
    var R = KF.redondear, f = KF.formacion, p = KF.partida, est = this.ESTADOS_NAVE;
    var naves = '';
    for (var i = 0; i < f.naves.length; i++) {
      var n = f.naves[i];
      naves += n.viva ? (n.enFormacion ? '1' : '2') : '0';
    }
    var lista = function (l, conT) {
      return l.map(function (o) { return conT ? [o.id, R(o.x), R(o.y), R(o.t)] : [o.id, R(o.x), R(o.y)]; });
    };
    return {
      f: 'e',
      g: this.partidaNumero,
      t: performance.now(),
      e: p.estado,
      o: p.oleada,
      fx: R(f.x),
      n: naves,
      a: KF.ataque.atacantes.filter(function (a) { return a.nave.viva; }).map(function (a) {
        return [a.nave.i, R(a.x), R(a.y), R(a.angulo * 100), a.fase === 'vuelta' ? 1 : 0];
      }),
      b: lista(KF.ataque.bombas),
      c: lista(KF.powerups.capsulas, true),
      w: lista(KF.powerups.ondas, true),
      r: KF.powerups.recogidas,
      d: KF.desafio.foto(),
      p: KF.combos.flotantes.map(function (o) { return [o.id, R(o.x), R(o.y), R(o.t), o.puntos, o.numero]; }),
      j: KF.jugadores.map(function (j) {
        return [R(j.x), R(j.vx), est.indexOf(j.estado), R(j.escudo), KF.powerups.PODERES.indexOf(j.poder),
          j.recambio, j.puntos, j.salvas,
          j.disparos.map(function (d) { return [d.id, d.x, R(d.y), d.bomba ? 1 : 0]; }), j.racha, j.capsulas];
      })
    };
  },

  // Invitado: guarda la foto en orden; los mensajes pueden llegar desordenados.
  meterFoto: function (m) {
    if (m.g !== this.partidaNumero) {
      // Foto de una partida anterior, o la primera de otra nueva.
      if (m.g < this.partidaNumero) return;
      this.partidaNumero = m.g;
      this.pideOtra = false;
      this.fotos = [];
      this.fotoAplicada = null;
    }
    var fotos = this.fotos;
    var muestra = m.t - performance.now();
    // Desfase entre los relojes: el de la foto que antes ha llegado manda, y
    // si no, se ajusta poco a poco.
    if (this.desfase === null || muestra > this.desfase) this.desfase = muestra;
    else this.desfase += (muestra - this.desfase) * 0.02;
    if (fotos.length && m.t <= fotos[fotos.length - 1].t) {
      if (this.fotoAplicada && m.t <= this.fotoAplicada.t) return;
      fotos.push(m);
      fotos.sort(function (a, b) { return a.t - b.t; });
    } else {
      fotos.push(m);
    }
    while (fotos.length > 20) fotos.shift();
  },

  // Invitado: pone el juego como lo dicen las fotos, interpolando las
  // posiciones entre las dos que rodean al momento a dibujar.
  aplicarFotos: function () {
    var fotos = this.fotos;
    if (!fotos.length) return;
    var momento = performance.now() + this.desfase - this.RETRASO;
    var a = fotos[0], b = fotos[0];
    for (var i = 0; i < fotos.length; i++) {
      b = fotos[i];
      if (b.t >= momento) break;
      a = b;
    }
    var k = b.t > a.t ? Math.max(0, Math.min(1, (momento - a.t) / (b.t - a.t))) : 1;
    if (b !== this.fotoAplicada && (!this.fotoAplicada || b.t > this.fotoAplicada.t)) {
      this.aplicarCambios(b);
      this.fotoAplicada = b;
    }
    var mismaOleada = a.o === b.o;
    var M = KF.mezclar;
    KF.formacion.x = mismaOleada ? M(a.fx, b.fx, k) : b.fx;

    // Naves en picado, por su posición en la formación.
    var naves = KF.formacion.naves, antes = {};
    if (mismaOleada) a.a.forEach(function (x) { antes[x[0]] = x; });
    KF.ataque.atacantes = b.a.filter(function (x) { return naves[x[0]]; }).map(function (x) {
      var y = antes[x[0]] || x;
      return {
        nave: naves[x[0]],
        x: M(y[1], x[1], k),
        y: M(y[2], x[2], k),
        angulo: KF.mezclarAngulo(y[3] / 100, x[3] / 100, k),
        fase: x[4] ? 'vuelta' : 'picado'
      };
    });
    KF.ataque.bombas = KF.interpolarLista(a.b, b.b, k).map(function (o) { return { id: o[0], x: o[1], y: o[2], vx: 0 }; });
    KF.powerups.capsulas = KF.interpolarLista(a.c, b.c, k).map(function (o) { return { id: o[0], x: o[1], y: o[2], t: o[3] }; });
    KF.powerups.ondas = KF.interpolarLista(a.w, b.w, k).map(function (o) { return { id: o[0], x: o[1], y: o[2], t: o[3] }; });
    // Los puntos flotantes de los combos, con su tiempo interpolado.
    var flotantesAntes = {};
    (a.p || []).forEach(function (o) { flotantesAntes[o[0]] = o; });
    KF.combos.flotantes = (b.p || []).map(function (o) {
      var p = flotantesAntes[o[0]];
      return { id: o[0], x: o[1], y: o[2], t: p ? M(p[3], o[3], k) : o[3], puntos: o[4], numero: o[5] };
    });
    // El desafío: sus naves se colocan solas a partir de su tiempo.
    if (b.d) KF.desafio.t = a.d && a.d[1] <= b.d[1] ? M(a.d[1], b.d[1], k) : b.d[1];
    for (i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i], ja = a.j[i], jb = b.j[i];
      if (!ja || !jb) continue;
      j.disparos = KF.interpolarLista(ja[8], jb[8], k).map(function (o) { return { id: o[0], x: o[1], y: o[2], bomba: !!o[3] }; });
      if (j.remoto && j.estado === 'viva') {
        j.x = M(ja[0], jb[0], k);
        j.vx = jb[1];
      }
    }
  },

  // Invitado: lo que cambia de golpe entre fotos (oleada, naves destruidas,
  // naves de jugador que explotan o aparecen, puntos, poderes).
  aplicarCambios: function (f) {
    var p = KF.partida;
    if (f.o !== p.oleada || (f.e === 'jugando' && p.estado !== 'jugando')) p.ponerOleada(f.o);
    // Al empezar la partida, la posición del móvil del invitado es su centro.
    if (f.e === 'jugando' && p.estado !== 'jugando') KF.inclinacion.calibrar();
    if (f.e === 'fin' && p.estado !== 'fin') p.tiempoFin = 0;
    p.estado = f.e;

    var naves = KF.formacion.naves, atacantes = KF.ataque.atacantes;
    for (var i = 0; i < naves.length && i < f.n.length; i++) {
      var n = naves[i], c = f.n[i];
      if (n.viva && c === '0') {
        // Destruida: explota donde se la veía, con su sonido.
        var pos = KF.formacion.posicionHueco(n);
        for (var q = 0; q < atacantes.length; q++) if (atacantes[q].nave === n) pos = atacantes[q];
        KF.enemigos.destruir(n, pos.x, pos.y, 'disparo', null);
      }
      n.viva = c !== '0';
      n.enFormacion = c === '1';
    }
    KF.powerups.recogidas = f.r;
    KF.desafio.aplicarCambios(f.d);

    for (i = 0; i < KF.jugadores.length; i++) {
      var j = KF.jugadores[i], d = f.j[i];
      if (!d) continue;
      var estado = this.ESTADOS_NAVE[d[2]];
      if (estado === 'explotando' && j.estado !== 'explotando') {
        j.x = d[0];
        j.estado = 'viva';
        j.escudo = 0;
        j.explotar();
      } else if (estado === 'viva' && j.estado !== 'viva') {
        j.aparecer();
      } else if (estado === 'ausente' && j.estado !== 'ausente') {
        j.retirar();
      }
      j.escudo = d[3];
      j.poder = d[4] >= 0 ? KF.powerups.PODERES[d[4]] : null;
      j.recambio = d[5];
      j.puntos = d[6];
      j.racha = d[9] || 0;
      j.capsulas = d[10] || 0;
      if (d[7] > j.salvas) j.destello = j.DURACION_DESTELLO;
      j.salvas = d[7];
    }
  },

  // QR del enlace en un lienzo, un píxel por módulo, con su margen blanco.
  crearQR: function (texto) {
    if (typeof qrcode === 'undefined') return null;
    var qr = qrcode(0, 'M');
    qr.addData(texto);
    qr.make();
    var n = qr.getModuleCount(), borde = 2;
    var lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = n + borde * 2;
    var c = lienzo.getContext('2d');
    c.fillStyle = '#fff';
    c.fillRect(0, 0, lienzo.width, lienzo.height);
    c.fillStyle = '#000';
    for (var f = 0; f < n; f++) {
      for (var k = 0; k < n; k++) if (qr.isDark(f, k)) c.fillRect(k + borde, f + borde, 1, 1);
    }
    return lienzo;
  },

  // Texto centrado en la altura y, a la escala dada.
  escribir: function (ctx, letras, texto, y, escala) {
    var g = KF.graficos;
    g.escribir(ctx, letras, texto, (KF.ANCHO - g.anchoTexto(texto, escala)) / 2, y, escala);
  },

  ALTURA_CANCELAR: 262,    // altura de la opción 'CANCEL' / 'EXIT'

  dibujar: function (ctx) {
    var f = this.fase;
    if (!f || f === 'jugando' || f === 'solo' || f === 'menu') return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, KF.ANCHO, KF.ALTO);
    if (f === 'sala') {
      this.escribir(ctx, this.LETRAS, 'ROOM', 40, 2);
      this.escribir(ctx, this.LETRAS, this.codigo, 62, 4);
      if (this.qr) {
        var lado = this.qr.width * 2, x = Math.round((KF.ANCHO - lado) / 2);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.qr, x, 108, lado, lado);
      }
      var texto = this.peer && this.peer.open ? 'WAITING FOR P2' : 'CREATING ROOM';
      this.escribir(ctx, this.LETRAS_SECUNDARIO, texto, 236, 1);
      this.escribir(ctx, this.LETRAS_SECUNDARIO, 'CANCEL', this.ALTURA_CANCELAR, 1);
    } else if (f === 'uniendo') {
      this.escribir(ctx, this.LETRAS, 'CONNECTING', 110, 2);
      this.escribir(ctx, this.LETRAS, this.codigo, 140, 2);
      this.escribir(ctx, this.LETRAS_SECUNDARIO, 'CANCEL', this.ALTURA_CANCELAR, 1);
    } else if (f === 'pausa') {
      this.escribir(ctx, this.LETRAS, 'WAITING FOR P' + (this.anfitrion ? 2 : 1), 120, 1.5);
      var quedan = Math.ceil(this.ESPERA_VUELTA - this.tiempoPausa);
      this.escribir(ctx, this.LETRAS, String(Math.max(0, quedan)), 140, 2);
    } else if (f === 'error') {
      this.escribir(ctx, this.LETRAS_ERROR, this.mensaje, 120, 1.5);
      this.escribir(ctx, this.LETRAS_SECUNDARIO, 'EXIT', this.ALTURA_CANCELAR, 1);
    }
  },

  // En la sala, al unirse o tras un error, cualquier tecla (o tocar
  // 'CANCEL' / 'EXIT') vuelve al menú. Partida pasa aquí las teclas y los
  // toques mientras la partida a dos está en marcha.
  tecla: function () {
    if (this.fase === 'sala' || this.fase === 'uniendo' || this.fase === 'error') this.salir();
  },

  toque: function (p) {
    if (p && Math.abs(p.y - (this.ALTURA_CANCELAR + 3)) < 12) this.tecla();
  },

  salir: function () {
    this.cerrar();
    KF.partida.irAInicio();
  }
};

// Utilidades de la interpolación.
KF.redondear = function (v) { return Math.round(v * 10) / 10; };
KF.mezclar = function (a, b, k) { return a + (b - a) * k; };
KF.mezclarAngulo = function (a, b, k) {
  var d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + d * k;
};
// Listas de [id, x, y, ...] de dos fotos: las de la más reciente, con su
// posición interpolada si ya estaban en la anterior.
KF.interpolarLista = function (antes, despues, k) {
  var porId = {};
  for (var i = 0; i < antes.length; i++) porId[antes[i][0]] = antes[i];
  return despues.map(function (o) {
    var p = porId[o[0]];
    if (!p) return o;
    var r = o.slice();
    r[1] = KF.mezclar(p[1], o[1], k);
    r[2] = KF.mezclar(p[2], o[2], k);
    return r;
  });
};

// Posiciones recibidas de la nave del invitado, en el reloj de su
// dispositivo: muestra(retraso) da las dos que rodean al momento a dibujar.
KF.Muestras = function () {
  this.lista = [];
  this.ultima = null;
  this.desfase = null;
};
KF.Muestras.prototype = {
  meter: function (m) {
    var muestra = m.t - performance.now();
    if (this.desfase === null || muestra > this.desfase) this.desfase = muestra;
    else this.desfase += (muestra - this.desfase) * 0.02;
    if (this.ultima && m.t <= this.ultima.t) return;  // llegó tarde: ya hay otra más nueva
    this.ultima = m;
    this.lista.push(m);
    if (this.lista.length > 20) this.lista.shift();
  },
  muestra: function (retraso) {
    var l = this.lista;
    if (!l.length) return null;
    var momento = performance.now() + this.desfase - retraso;
    var a = l[0], b = l[0];
    for (var i = 0; i < l.length; i++) {
      b = l[i];
      if (b.t >= momento) break;
      a = b;
    }
    var k = b.t > a.t ? Math.max(0, Math.min(1, (momento - a.t) / (b.t - a.t))) : 1;
    return { a: a, b: b, k: k };
  }
};

(function () {
  var r = KF.red;
  r.LETRAS = KF.graficos.crearFuente(r.COLOR);
  r.LETRAS_SECUNDARIO = KF.graficos.crearFuente(r.COLOR_SECUNDARIO);
  r.LETRAS_ERROR = KF.graficos.crearFuente('#f02828');


  // Con la pestaña oculta el bucle del juego se detiene (y la partida se
  // pausa): se sigue enviando un mensaje por segundo para que el otro no dé
  // la conexión por perdida.
  setInterval(function () {
    if (document.hidden) r.enviarYa();
  }, 1000);

  // Enlace del QR: entra directamente en la sala.
  var m = /[?&]room=([A-Za-z]{4})/.exec(location.search);
  if (m) {
    if (window.history && history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search.replace(/([?&])room=[A-Za-z]{4}&?/, '$1').replace(/[?&]$/, ''));
    }
    r.unirse(m[1].toUpperCase());
  }
})();

KF.registrar(KF.red);
