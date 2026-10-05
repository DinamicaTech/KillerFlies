// La nave del jugador: se mueve en horizontal por la parte inferior con las
// flechas o deslizando el dedo, y dispara con la barra espaciadora o con una
// pulsación corta en la pantalla táctil. Solo hay un disparo en pantalla:
// no se puede volver a disparar hasta que da en un blanco o sale por arriba.
// El power-up activo (KF.powerups.activo) cambia el disparo: hasta tres a la
// vez, que atraviese las naves, una bomba, la aniquilación, la mitad de
// velocidad o tres proyectiles paralelos que cuentan como un solo disparo.
// Explota si la alcanza una nave alienígena o una bomba (KF.jugador.explotar).
// No reaparece sola: Partida la hace aparecer (KF.jugador.aparecer) al empezar
// la partida y con cada nave de recambio; fuera de la partida no está.
// Al aparecer, parpadea dos segundos y mientras tanto es invulnerable: lo que
// choca con ella no la hace explotar (la nave alienígena que choca se destruye
// igualmente y la bomba desaparece).
KF.jugador = {
  Y: KF.ALTO - 24,         // altura del centro de la nave
  VELOCIDAD: 90,           // píxeles por segundo
  VELOCIDAD_DISPARO: 300,  // píxeles por segundo
  ANCHO: 13,
  ALTO: 11,
  DURACION_FASE: 0.15,     // segundos de cada fase de la explosión
  DURACION_DESTELLO: 0.06, // segundos que dura el destello del cañón al disparar
  DURACION_ESCUDO: 2,      // segundos de invulnerabilidad al aparecer
  PARPADEO: 0.1,           // segundos visible o invisible al parpadear

  x: KF.ANCHO / 2,
  estado: 'ausente',       // 'ausente' | 'viva' | 'explotando'
  tiempoExplosion: 0,      // segundos desde que explotó
  destello: 0,             // segundos que le quedan al destello del cañón
  escudo: 0,               // segundos que le quedan de invulnerabilidad
  disparos: [],            // {x, y, bomba} del extremo superior de cada proyectil
  salvas: 0,               // cuántas veces ha disparado (para Sonido)
  SEPARACION_TRIPLE: 6,    // píxeles entre los proyectiles del disparo triple
  objetivo: null,          // x a la que va la nave al deslizar el dedo, o null
  pulsacion: false,        // se ha pulsado el espacio (sin contar la repetición)

  // Rectángulo de choque de la nave, o null si no se la puede alcanzar.
  caja: function () {
    if (this.estado !== 'viva') return null;
    return { x: this.x - this.ANCHO / 2, y: this.Y - this.ALTO / 2, ancho: this.ANCHO, alto: this.ALTO };
  },

  // La llama quien detecta el choque con una nave alienígena o una bomba.
  explotar: function () {
    if (this.estado !== 'viva' || this.escudo > 0) return;
    this.estado = 'explotando';
    this.tiempoExplosion = 0;
  },

  // La nave aparece en el centro; la llama Partida.
  aparecer: function () {
    this.estado = 'viva';
    this.x = KF.ANCHO / 2;
    this.objetivo = null;
    this.escudo = this.DURACION_ESCUDO;
  },

  // La nave deja de estar en pantalla (fin de partida); la llama Partida.
  retirar: function () {
    this.estado = 'ausente';
    this.escudo = 0;
  },

  actualizar: function (dt) {
    this.moverDisparo(dt);
    this.destello = Math.max(0, this.destello - dt);
    this.escudo = Math.max(0, this.escudo - dt);

    if (this.estado === 'explotando') this.tiempoExplosion += dt;
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
    var margen = this.ANCHO / 2;
    var limitar = function (x) { return Math.max(margen, Math.min(KF.ANCHO - margen, x)); };
    if (dir) {
      this.objetivo = null;
    } else if (dx || this.objetivo !== null) {
      // Al deslizar el dedo la nave va hacia donde la lleva el dedo, pero
      // sin pasar de su velocidad normal.
      this.objetivo = limitar((this.objetivo === null ? this.x : this.objetivo) + dx);
      var falta = this.objetivo - this.x;
      var paso = this.VELOCIDAD * dt;
      if (Math.abs(falta) <= paso) {
        this.x = this.objetivo;
        this.objetivo = null;
      } else {
        dir = falta > 0 ? 1 : -1;
      }
    }
    this.x = limitar(this.x + dir * this.VELOCIDAD * dt);

    // Con el disparo acelerado, cada pulsación lanza un solo disparo:
    // mantener pulsado el espacio no dispara más.
    var pulsado = KF.powerups.activo === 'acelerado' ? pulsacion : t.Space;
    if (pulsado || tocado) this.disparar();
  },

  // Lanza un disparo si se puede, según el power-up activo.
  disparar: function () {
    var poder = KF.powerups.activo;
    var maximo = poder === 'acelerado' ? 3 : 1;
    if (this.disparos.length >= maximo) return;
    this.salvas++;
    if (poder === 'aniquilacion') {
      KF.powerups.aniquilar();
      return;
    }
    this.destello = this.DURACION_DESTELLO;
    var x = Math.round(this.x), y = this.Y - this.ALTO / 2 - this.SPRITE_DISPARO.height;
    if (poder === 'triple') {
      for (var i = -1; i <= 1; i++) this.disparos.push({ x: x + i * this.SEPARACION_TRIPLE, y: y, bomba: false });
    } else {
      this.disparos.push({ x: x, y: y, bomba: poder === 'bomba' });
    }
  },

  // Los disparos siguen su camino aunque la nave explote. El disparo profundo
  // no se detiene al dar en una nave; la bomba explota al darle.
  moverDisparo: function (dt) {
    var poder = KF.powerups.activo;
    var v = this.VELOCIDAD_DISPARO * (poder === 'lento' ? 0.5 : 1);
    var h = this.SPRITE_DISPARO.height;
    this.disparos = this.disparos.filter(function (d) {
      d.y -= v * dt;
      if (d.y + h < 0) return false;
      var r = d.bomba ? { x: d.x - 1, y: d.y, ancho: 3, alto: 3 } : { x: d.x, y: d.y, ancho: 1, alto: h };
      var nave = KF.formacion.tocar(r) || KF.ataque.tocar(r);
      if (!nave) return true;
      if (d.bomba) {
        KF.powerups.explotarBomba(d.x, d.y + 1);
        return false;
      }
      if (poder !== 'profundo') return false;
      // Atraviesa: también caen las demás naves que toque en este instante.
      while (KF.formacion.tocar(r) || KF.ataque.tocar(r)) {}
      return true;
    });
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
      g.dibujar(ctx, this.SPRITE, this.x, this.Y);
      // El destello va justo encima de la punta del cañón y sigue a la nave.
      if (this.destello > 0) g.dibujar(ctx, this.SPRITE_DESTELLO, this.x, this.Y - 8);
    } else if (this.estado === 'explotando') {
      var fase = Math.floor(this.tiempoExplosion / this.DURACION_FASE);
      if (fase < this.SPRITES_EXPLOSION.length) {
        g.dibujar(ctx, this.SPRITES_EXPLOSION[fase], this.x, this.Y);
      }
    }
  }
};

KF.jugador.SPRITE = KF.graficos.SPRITE_JUGADOR;
KF.jugador.SPRITE_DISPARO = KF.graficos.SPRITE_DISPARO;
KF.jugador.SPRITE_DESTELLO = KF.graficos.SPRITE_DESTELLO;
KF.jugador.SPRITE_BOMBA = KF.graficos.SPRITE_BOMBA_JUGADOR;
KF.jugador.SPRITES_EXPLOSION = KF.graficos.SPRITES_EXPLOSION_JUGADOR;

window.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !e.repeat) KF.jugador.pulsacion = true;
});

KF.registrar(KF.jugador);
