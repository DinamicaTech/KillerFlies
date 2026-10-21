// La nave del jugador: se mueve en horizontal por la parte inferior con las
// flechas, deslizando el dedo o inclinando el móvil (las flechas y el dedo
// mandan sobre la inclinación), y dispara con la barra espaciadora o con una
// pulsación corta en la pantalla táctil. Solo hay un disparo en pantalla:
// no se puede volver a disparar hasta que da en un blanco o sale por arriba.
// El power-up activo de la nave (poder) cambia el disparo: hasta tres a la
// vez, que atraviese las naves, una bomba, la aniquilación, la mitad de
// velocidad o tres proyectiles paralelos que cuentan como un solo disparo.
// Un disparo que sale por arriba sin haber dado a nada corta la racha de
// naves seguidas del jugador (js/combos.js). Cada impacto en la nave nodriza
// jefe (js/jefe.js) le quita una de vida.
// Explota si la alcanza una nave alienígena o una bomba (KF.jugador.explotar).
// No reaparece sola: Partida la hace aparecer (KF.jugador.aparecer) al empezar
// la partida y con cada nave de recambio; fuera de la partida no está.
// Mientras se mueve, una llamita parpadea bajo ella (estela del motor).
// Al aparecer, parpadea dos segundos y mientras tanto es invulnerable: lo que
// choca con ella no la hace explotar (la nave alienígena que choca se destruye
// igualmente y la bomba desaparece).
// No se mueve a velocidad fija: acelera hasta su velocidad máxima y frena
// hasta pararse de forma suave, con las flechas, al deslizar el dedo y al
// inclinar el móvil. Con las flechas va como mucho a 90 píxeles por segundo y
// en el móvil (dedo o inclinación) a 120, porque allí es más difícil jugar.
// Al explotar lanza fragmentos que se dispersan y se apagan en un segundo;
// terminan su recorrido aunque la nave vuelva a aparecer o acabe la partida.
// En la partida a dos (js/red.js) hay dos naves: KF.jugador es siempre la de
// este dispositivo y KF.companero la del otro jugador; KF.jugadores las lista.
// Cada nave tiene su número (1 o 2), su color, su poder, sus naves de
// recambio y sus puntos.
KF.Nave = function (numero) {
  this.numero = numero;
  this.x = KF.ANCHO / 2;
  this.vx = 0;
  this.estado = 'ausente';
  this.tiempoExplosion = 0;
  this.destello = 0;
  this.escudo = 0;
  this.tiempoLlama = 0;
  this.fragmentos = [];
  this.disparos = [];
  this.salvas = 0;
  this.objetivo = null;
  this.pulsacion = false;
  this.poder = null;       // power-up activo de esta nave, o null
  this.recambio = 0;       // naves de recambio que le quedan
  this.puntos = 0;
  this.proximaVida = 0;    // puntos con los que gana la próxima vida extra (js/partida.js)
  this.racha = 0;          // naves destruidas seguidas sin fallar (js/combos.js)
  this.capsulas = 0;       // cápsulas de power-up recogidas (js/vibracion.js)
  this.remoto = false;     // la mueve el otro dispositivo (js/red.js)
  this.peticiones = 0;     // invitado: disparos pedidos al anfitrión
  this.SPRITE = KF.graficos.SPRITES_JUGADOR[numero - 1];
  this.SPRITES_PODER = KF.graficos.SPRITES_JUGADOR_PODER[numero - 1];
};

KF.Nave.prototype = {
  Y: KF.ALTO - 24,         // altura del centro de la nave
  VELOCIDAD: 90,           // velocidad máxima con las flechas, en píxeles por segundo
  VELOCIDAD_MOVIL: 120,    // velocidad máxima con el dedo o inclinando el móvil
  INCLINACION_MINIMA: 3,   // grados: hasta aquí la nave no se mueve
  INCLINACION_MAXIMA: 30,  // grados: desde aquí va a la velocidad máxima
  RADIO_HALO: 9,           // halo de la nave con la aniquilación lista
  LATIDO_HALO: 10,         // radianes por segundo del latido del halo
  ACELERACION: 450,        // píxeles por segundo cada segundo (de parada a máxima en 0,2 s)
  FRENADO: 600,            // píxeles por segundo cada segundo (de máxima a parada en 0,15 s)
  VELOCIDAD_DISPARO: 300,  // píxeles por segundo
  ANCHO: 13,
  ALTO: 11,
  DURACION_FASE: 0.15,     // segundos de cada fase de la explosión
  DURACION_DESTELLO: 0.06, // segundos que dura el destello del cañón al disparar
  DURACION_ESCUDO: 2,      // segundos de invulnerabilidad al aparecer
  PARPADEO: 0.1,
  CAMBIO_LLAMA: 0.05,      // segundos de cada forma de la llama del motor
  FRAGMENTOS: 16,          // fragmentos que lanza la explosión
  VELOCIDAD_FRAGMENTO: [30, 90], // píxeles por segundo al salir (mínima y máxima)
  FRENADO_FRAGMENTO: 0.5,  // fracción de la velocidad que pierden en cada segundo
  DURACION_FRAGMENTO: 1,   // segundos hasta que se apagan del todo

  SEPARACION_TRIPLE: 6,    // píxeles entre los proyectiles del disparo triple
  SEPARACION_DOS: 30,      // a dos, cada nave aparece a esta distancia del centro
  OPACIDAD_FANTASMA: 0.4,  // a dos, la nave del otro jugador se ve así de transparente
  // Estado de cada nave: x, vx (velocidad horizontal, negativa hacia la
  // izquierda), estado ('ausente' | 'viva' | 'explotando'), tiempoExplosion,
  // destello y escudo (segundos que les quedan), tiempoLlama, fragmentos
  // {x, y, vx, vy, tam, color, vida}, disparos {id, x, y, bomba, salva}
  // (extremo superior de cada proyectil; salva {quedan, acierto} la comparten
  // los proyectiles de un mismo disparo), salvas (veces que ha disparado, para Sonido),
  // objetivo (x a la que va al deslizar el dedo, o null) y pulsacion (se ha
  // pulsado el espacio, sin contar la repetición).

  // Rectángulo de choque de la nave, o null si no se la puede alcanzar.
  caja: function () {
    if (this.estado !== 'viva') return null;
    return { x: this.x - this.ANCHO / 2, y: this.Y - this.ALTO / 2, ancho: this.ANCHO, alto: this.ALTO };
  },

  // La llama quien detecta el choque con una nave alienígena o una bomba.
  explotar: function () {
    if (this.estado !== 'viva' || this.escudo > 0) return;
    this.estado = 'explotando';
    this.vx = 0;
    this.tiempoExplosion = 0;
    this.poder = null;
    KF.combos.cortar(this);
    this.lanzarFragmentos();
  },

  // Fragmentos desde el centro de la nave, en direcciones y velocidades al azar.
  lanzarFragmentos: function () {
    var colores = KF.graficos.COLORES_FRAGMENTOS;
    var v = this.VELOCIDAD_FRAGMENTO;
    for (var i = 0; i < this.FRAGMENTOS; i++) {
      var angulo = Math.random() * Math.PI * 2;
      var rapidez = v[0] + Math.random() * (v[1] - v[0]);
      this.fragmentos.push({
        x: this.x, y: this.Y,
        vx: Math.cos(angulo) * rapidez, vy: Math.sin(angulo) * rapidez,
        tam: Math.random() < 0.5 ? 1 : 2,
        color: colores[Math.floor(Math.random() * colores.length)],
        vida: this.DURACION_FRAGMENTO
      });
    }
  },

  moverFragmentos: function (dt) {
    var frenado = Math.pow(1 - this.FRENADO_FRAGMENTO, dt);
    this.fragmentos = this.fragmentos.filter(function (f) {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vx *= frenado;
      f.vy *= frenado;
      f.vida -= dt;
      return f.vida > 0;
    });
  },

  // La nave aparece en el centro (a dos, cada una a un lado); la llama Partida.
  aparecer: function () {
    this.estado = 'viva';
    this.x = KF.ANCHO / 2;
    if (KF.companero) this.x += (this.numero === 1 ? -1 : 1) * this.SEPARACION_DOS;
    this.objetivo = null;
    this.vx = 0;
    this.escudo = this.DURACION_ESCUDO;
  },

  // La nave deja de estar en pantalla (fin de partida); la llama Partida.
  retirar: function () {
    this.estado = 'ausente';
    this.vx = 0;
    this.escudo = 0;
    this.poder = null;
  },

  actualizar: function (dt) {
    // El invitado no decide los impactos: sus disparos llegan del anfitrión.
    if (!KF.red.invitado) this.moverDisparo(dt);
    this.moverFragmentos(dt);
    this.destello = Math.max(0, this.destello - dt);
    this.escudo = Math.max(0, this.escudo - dt);
    this.tiempoLlama += dt;

    if (this.estado === 'explotando') this.tiempoExplosion += dt;
    // La nave del otro jugador la mueve su dispositivo (js/red.js).
    if (this.remoto) return;
    // Lo pedido por la pantalla táctil se recoge siempre, aunque la nave no
    // esté, para que no se acumule.
    var tactil = KF.tactil;
    var dx = tactil.dx, tocado = tactil.disparar;
    tactil.dx = 0;
    tactil.disparar = false;
    var pulsacion = this.pulsacion;
    this.pulsacion = false;
    if (this.estado !== 'viva') return;

    var t = KF.teclas;
    var dir = (t.ArrowRight ? 1 : 0) - (t.ArrowLeft ? 1 : 0);
    // La mejora SPEED (js/tienda.js) sube las dos velocidades máximas.
    var mejora = KF.tienda.factorVelocidad();
    var maxima = this.VELOCIDAD * mejora, maximaMovil = this.VELOCIDAD_MOVIL * mejora;
    var margen = this.ANCHO / 2;
    var limitar = function (x) { return Math.max(margen, Math.min(KF.ANCHO - margen, x)); };
    var deseada = dir * maxima;
    if (dir) {
      this.objetivo = null;
    } else if (dx || this.objetivo !== null) {
      // Al deslizar el dedo la nave va hacia donde la lleva el dedo, sin pasar
      // de su velocidad máxima, y frena a tiempo para pararse justo allí.
      this.objetivo = limitar((this.objetivo === null ? this.x : this.objetivo) + dx);
      var falta = this.objetivo - this.x;
      var rapidez = Math.min(maximaMovil, Math.sqrt(2 * this.FRENADO * Math.abs(falta)));
      deseada = falta > 0 ? rapidez : -rapidez;
    } else {
      // Sin flechas ni dedo, manda la inclinación del móvil: más rápido cuanto
      // más inclinado, a partir de INCLINACION_MINIMA.
      var g = KF.inclinacion.grados();
      var exceso = Math.abs(g) - this.INCLINACION_MINIMA;
      if (exceso > 0) {
        var parte = Math.min(1, exceso / (this.INCLINACION_MAXIMA - this.INCLINACION_MINIMA));
        deseada = (g > 0 ? 1 : -1) * maximaMovil * parte;
      }
    }
    this.vx = this.acercarVelocidad(this.vx, deseada, dt);
    var antes = this.x;
    this.x += this.vx * dt;
    if (this.objetivo !== null && (this.x - this.objetivo) * (antes - this.objetivo) <= 0) {
      // Ha llegado (o se pasaría): se queda en el destino, parada.
      this.x = this.objetivo;
      this.objetivo = null;
      this.vx = 0;
    }
    var dentro = limitar(this.x);
    if (dentro !== this.x) {
      // Contra el borde de la pantalla se para en seco.
      this.x = dentro;
      this.vx = 0;
    }

    // Con el disparo acelerado, cada pulsación lanza un solo disparo:
    // mantener pulsado el espacio no dispara más.
    var pulsado = this.poder === 'acelerado' ? pulsacion : t.Space;
    if (!pulsado && !tocado) return;
    // El invitado pide el disparo al anfitrión, que es quien lo lanza.
    if (KF.red.invitado) this.peticiones++;
    else this.disparar();
  },

  // Lleva la velocidad v hacia la deseada: frena si tiene que ir más despacio
  // o hacia el otro lado (primero hasta pararse) y si no, acelera.
  acercarVelocidad: function (v, deseada, dt) {
    var hacia, ritmo;
    if (v !== 0 && (v * deseada < 0 || Math.abs(deseada) < Math.abs(v))) {
      hacia = v * deseada < 0 ? 0 : deseada;
      ritmo = this.FRENADO;
    } else {
      hacia = deseada;
      ritmo = this.ACELERACION;
    }
    var paso = ritmo * dt;
    if (Math.abs(hacia - v) <= paso) return hacia;
    return v + (hacia > v ? paso : -paso);
  },

  // Lanza un disparo si se puede, según el power-up activo.
  disparar: function () {
    var poder = this.poder;
    var maximo = poder === 'acelerado' ? 3 : 1;
    if (this.disparos.length >= maximo) return;
    this.salvas++;
    if (poder === 'aniquilacion') {
      KF.powerups.aniquilar(this);
      return;
    }
    this.destello = this.DURACION_DESTELLO;
    var x = Math.round(this.x), y = this.Y - this.ALTO / 2 - this.SPRITE_DISPARO.height;
    if (poder === 'triple') {
      var salva = { quedan: 3, acierto: false };
      for (var i = -1; i <= 1; i++) this.disparos.push({ id: KF.nuevoId(), x: x + i * this.SEPARACION_TRIPLE, y: y, bomba: false, salva: salva });
    } else {
      this.disparos.push({ id: KF.nuevoId(), x: x, y: y, bomba: poder === 'bomba', salva: { quedan: 1, acierto: false } });
    }
  },

  // Los disparos siguen su camino aunque la nave explote. El disparo profundo
  // no se detiene al dar en una nave; la bomba explota al darle. Cuando el
  // último proyectil de un disparo sale por arriba sin que ninguno haya dado
  // en una nave, se corta la racha.
  moverDisparo: function (dt) {
    var poder = this.poder, autor = this;
    // La mejora FIRE (js/tienda.js) acelera el disparo.
    var v = this.VELOCIDAD_DISPARO * (poder === 'lento' ? 0.5 : 1) * KF.tienda.factorDisparo();
    var h = this.SPRITE_DISPARO.height;
    this.disparos = this.disparos.filter(function (d) {
      d.y -= v * dt;
      if (d.y + h < 0) {
        if (--d.salva.quedan === 0 && !d.salva.acierto) KF.combos.cortar(autor);
        return false;
      }
      var r = d.bomba ? { x: d.x - 1, y: d.y, ancho: 3, alto: 3 } : { x: d.x, y: d.y, ancho: 1, alto: h };
      var nave = KF.formacion.tocar(r, autor) || KF.ataque.tocar(r, autor) || KF.desafio.tocar(r, autor);
      if (!nave && KF.jefe.alcanza(r)) {
        // La nave nodriza para cualquier disparo, también el profundo; la
        // bomba le quita vida al explotar.
        d.salva.acierto = true;
        d.salva.quedan--;
        if (d.bomba) KF.powerups.explotarBomba(d.x, d.y + 1, autor);
        else KF.jefe.danar(1, autor);
        return false;
      }
      if (!nave) return true;
      d.salva.acierto = true;
      if (poder !== 'profundo') d.salva.quedan--;
      if (d.bomba) {
        KF.powerups.explotarBomba(d.x, d.y + 1, autor);
        return false;
      }
      if (poder !== 'profundo') return false;
      // Atraviesa: también caen las demás naves que toque en este instante.
      while (KF.formacion.tocar(r, autor) || KF.ataque.tocar(r, autor) || KF.desafio.tocar(r, autor)) {}
      return true;
    });
  },

  // El aspecto de la nave depende de su power-up (power-ups/aspecto-nave):
  // sin poder, o con uno sin aspecto propio, es la nave normal.
  spriteActual: function () {
    return (this.poder && this.SPRITES_PODER[this.poder]) || this.SPRITE;
  },

  dibujar: function (ctx) {
    var g = KF.graficos;
    for (var i = 0; i < this.disparos.length; i++) {
      var d = this.disparos[i];
      if (d.bomba) g.dibujar(ctx, this.SPRITE_BOMBA, d.x, d.y + 1);
      else ctx.drawImage(this.SPRITE_DISPARO, d.x, Math.round(d.y));
    }
    // Con el escudo, la nave se ve y se deja de ver a intervalos (parpadeo).
    var oculta = this.escudo > 0 && Math.floor(this.escudo / this.PARPADEO) % 2 === 1;
    if (this.estado === 'viva' && !oculta) {
      // A dos, la nave del otro jugador se ve como un fantasma para no
      // confundirla con la propia; sus disparos y su explosión, no.
      if (this.remoto) ctx.globalAlpha = this.OPACIDAD_FANTASMA;
      // Con la aniquilación lista, un halo blanco late alrededor de la nave.
      if (this.poder === 'aniquilacion') {
        var alfa = ctx.globalAlpha;
        ctx.globalAlpha = alfa * (0.25 + 0.2 * Math.sin(this.tiempoLlama * this.LATIDO_HALO));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.Y, this.RADIO_HALO, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alfa;
      }
      g.dibujar(ctx, this.spriteActual(), this.x, this.Y);
      // El destello va justo encima de la punta del cañón y sigue a la nave.
      if (this.destello > 0) g.dibujar(ctx, this.SPRITE_DESTELLO, this.x, this.Y - 8);
      // Mientras se mueve, una llama parpadeante justo bajo la nave.
      if (this.vx !== 0) {
        var forma = Math.floor(this.tiempoLlama / this.CAMBIO_LLAMA) % this.SPRITES_LLAMA.length;
        g.dibujar(ctx, this.SPRITES_LLAMA[forma], this.x, this.Y + 8);
      }
      ctx.globalAlpha = 1;
    } else if (this.estado === 'explotando') {
      var fase = Math.floor(this.tiempoExplosion / this.DURACION_FASE);
      if (fase < this.SPRITES_EXPLOSION.length) {
        g.dibujar(ctx, this.SPRITES_EXPLOSION[fase], this.x, this.Y);
      }
    }
    // Los fragmentos van encima y se apagan a medida que se les acaba la vida.
    for (var j = 0; j < this.fragmentos.length; j++) {
      var f = this.fragmentos[j];
      ctx.globalAlpha = f.vida / this.DURACION_FRAGMENTO;
      ctx.fillStyle = f.color;
      ctx.fillRect(Math.round(f.x - f.tam / 2), Math.round(f.y - f.tam / 2), f.tam, f.tam);
    }
    ctx.globalAlpha = 1;
  }
};

(function () {
  var P = KF.Nave.prototype, g = KF.graficos;
  P.SPRITE_DISPARO = g.SPRITE_DISPARO;
  P.SPRITE_DESTELLO = g.SPRITE_DESTELLO;
  P.SPRITES_LLAMA = g.SPRITES_LLAMA;
  P.SPRITE_BOMBA = g.SPRITE_BOMBA_JUGADOR;
  P.SPRITES_EXPLOSION = g.SPRITES_EXPLOSION_JUGADOR;
})();

// Identificador único de cada disparo, bomba, cápsula u onda, para que el
// invitado de una partida a dos sepa qué es qué entre una foto y la siguiente.
KF.ultimoId = 0;
KF.nuevoId = function () { return ++KF.ultimoId; };

// Nave de este dispositivo; en la partida a dos, js/red.js añade la del otro
// jugador (KF.companero) y, en el invitado, esta es la número 2.
KF.jugador = new KF.Nave(1);
KF.companero = null;
KF.jugadores = [KF.jugador];

// Todas las naves en juego que se pueden alcanzar ahora mismo.
KF.navesVivas = function () {
  return KF.jugadores.filter(function (j) { return j.estado === 'viva'; });
};

window.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !e.repeat) KF.jugador.pulsacion = true;
});

// Las naves se actualizan y se dibujan juntas, en orden.
KF.registrar({
  actualizar: function (dt) {
    for (var i = 0; i < KF.jugadores.length; i++) KF.jugadores[i].actualizar(dt);
  },
  dibujar: function (ctx) {
    for (var i = 0; i < KF.jugadores.length; i++) KF.jugadores[i].dibujar(ctx);
  }
});
