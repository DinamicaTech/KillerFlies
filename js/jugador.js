// La nave del jugador: se mueve en horizontal por la parte inferior con las
// flechas o deslizando el dedo, y dispara con la barra espaciadora o con una
// pulsación corta en la pantalla táctil. Solo hay un disparo en pantalla:
// no se puede volver a disparar hasta que da en un blanco o sale por arriba.
// Explota si la alcanza una nave alienígena o una bomba (KF.jugador.explotar).
// No reaparece sola: Partida la hace aparecer (KF.jugador.aparecer) al empezar
// la partida y con cada nave de recambio; fuera de la partida no está.
KF.jugador = {
  Y: KF.ALTO - 24,         // altura del centro de la nave
  VELOCIDAD: 90,           // píxeles por segundo
  VELOCIDAD_DISPARO: 300,  // píxeles por segundo
  ANCHO: 13,
  ALTO: 11,
  DURACION_FASE: 0.15,     // segundos de cada fase de la explosión

  x: KF.ANCHO / 2,
  estado: 'ausente',       // 'ausente' | 'viva' | 'explotando'
  tiempoExplosion: 0,      // segundos desde que explotó
  disparo: null,           // {x, y} del extremo superior, o null si no hay
  objetivo: null,          // x a la que va la nave al deslizar el dedo, o null

  // Rectángulo de choque de la nave, o null si no se la puede alcanzar.
  caja: function () {
    if (this.estado !== 'viva') return null;
    return { x: this.x - this.ANCHO / 2, y: this.Y - this.ALTO / 2, ancho: this.ANCHO, alto: this.ALTO };
  },

  // La llama quien detecta el choque con una nave alienígena o una bomba.
  explotar: function () {
    if (this.estado !== 'viva') return;
    this.estado = 'explotando';
    this.tiempoExplosion = 0;
  },

  // La nave aparece en el centro; la llama Partida.
  aparecer: function () {
    this.estado = 'viva';
    this.x = KF.ANCHO / 2;
    this.objetivo = null;
  },

  // La nave deja de estar en pantalla (fin de partida); la llama Partida.
  retirar: function () {
    this.estado = 'ausente';
  },

  actualizar: function (dt) {
    this.moverDisparo(dt);

    if (this.estado === 'explotando') this.tiempoExplosion += dt;
    // Lo pedido por la pantalla táctil se recoge siempre, aunque la nave no
    // esté, para que no se acumule.
    var tactil = KF.tactil;
    var dx = tactil.dx, tocado = tactil.disparar;
    tactil.dx = 0;
    tactil.disparar = false;
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

    if ((t.Space || tocado) && !this.disparo) {
      this.disparo = { x: Math.round(this.x), y: this.Y - this.ALTO / 2 - this.SPRITE_DISPARO.height };
    }
  },

  // El disparo sigue su camino aunque la nave explote.
  moverDisparo: function (dt) {
    var d = this.disparo;
    if (!d) return;
    d.y -= this.VELOCIDAD_DISPARO * dt;
    var h = this.SPRITE_DISPARO.height;
    var r = { x: d.x, y: d.y, ancho: 1, alto: h };
    if (d.y + h < 0 || KF.formacion.tocar(r) || KF.ataque.tocar(r)) {
      this.disparo = null;
    }
  },

  dibujar: function (ctx) {
    var g = KF.graficos;
    if (this.disparo) {
      ctx.drawImage(this.SPRITE_DISPARO, this.disparo.x, Math.round(this.disparo.y));
    }
    if (this.estado === 'viva') {
      g.dibujar(ctx, this.SPRITE, this.x, this.Y);
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
KF.jugador.SPRITES_EXPLOSION = KF.graficos.SPRITES_EXPLOSION_JUGADOR;

KF.registrar(KF.jugador);
