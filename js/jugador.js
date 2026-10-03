// La nave del jugador: se mueve en horizontal por la parte inferior con las
// flechas y dispara con la barra espaciadora. Solo hay un disparo en pantalla:
// no se puede volver a disparar hasta que da en un blanco o sale por arriba.
// Explota si la alcanza una nave alienígena o una bomba (KF.jugador.explotar).
KF.jugador = {
  Y: KF.ALTO - 24,         // altura del centro de la nave
  VELOCIDAD: 90,           // píxeles por segundo
  VELOCIDAD_DISPARO: 300,  // píxeles por segundo
  ANCHO: 13,
  ALTO: 11,
  DURACION_FASE: 0.15,     // segundos de cada fase de la explosión
  // Provisional hasta que Partida gestione las naves de recambio: segundos
  // tras explotar hasta que la nave vuelve a aparecer en el centro.
  ESPERA_REAPARICION: 2,

  x: KF.ANCHO / 2,
  estado: 'viva',          // 'viva' | 'explotando'
  tiempoExplosion: 0,
  disparo: null,           // {x, y} del extremo superior, o null si no hay

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

  actualizar: function (dt) {
    this.moverDisparo(dt);

    if (this.estado === 'explotando') {
      this.tiempoExplosion += dt;
      if (this.tiempoExplosion >= this.ESPERA_REAPARICION) {
        this.estado = 'viva';
        this.x = KF.ANCHO / 2;
      }
      return;
    }

    var t = KF.teclas;
    var dir = (t.ArrowRight ? 1 : 0) - (t.ArrowLeft ? 1 : 0);
    var margen = this.ANCHO / 2;
    this.x = Math.max(margen, Math.min(KF.ANCHO - margen, this.x + dir * this.VELOCIDAD * dt));

    if (t.Space && !this.disparo) {
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
    } else {
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
