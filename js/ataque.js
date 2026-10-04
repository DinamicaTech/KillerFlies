// Los ataques en picado (sources/KillerFlies.txt §§ 4 a 7). Una nave deja su
// hueco con una pequeña parábola en la que gira 180°, baja hacia el jugador
// con una trayectoria suavemente irregular soltando bombas, sale por abajo,
// reaparece arriba y vuelve a su hueco. La amarilla sale escoltada por las
// dos rojas que tiene debajo (o las más próximas) que bajan bajo ella.
KF.ataque = {
  RADIO_SALIDA: 12,        // radio de la parábola de salida, en píxeles
  DURACION_SALIDA: 0.8,    // segundos que dura la parábola
  VELOCIDAD_BAJADA: 70,    // píxeles por segundo hacia abajo
  VELOCIDAD_LATERAL: 55,   // máximo de la velocidad horizontal
  VELOCIDAD_VUELTA: 60,    // píxeles por segundo de vuelta al hueco
  GIRO: 5,                 // radianes por segundo al orientarse
  VELOCIDAD_BOMBA: 110,    // píxeles por segundo hacia abajo
  SEPARACION_BOMBAS: 0.3,  // segundos entre bombas de una misma nave
  ESCOLTA_DX: 11,          // posición de cada escolta respecto a la amarilla
  ESCOLTA_DY: 11,
  PRIMER_ATAQUE: 2,        // segundos hasta el primer ataque de la oleada o
                           // tras aparecer la nave de recambio

  // Oleada en curso: con cada oleada hay más ataques a la vez y más seguidos.
  // Partida la cambiará al empezar cada oleada.
  oleada: 1,
  // Multiplicador de las velocidades del picado y las bombas, para Partida.
  factorVelocidad: 1,

  atacantes: [],  // naves fuera de su hueco
  bombas: [],     // {x, y, vx}
  espera: 0,      // segundos hasta el próximo ataque
  naves: null,    // lista de la formación a la que pertenecen los atacantes
  oyentesEscolta: [],

  // fn(x, y) se llama cuando una amarilla y sus dos rojas de escolta son
  // destruidas las tres fuera de la formación; (x, y) es donde cayó la última.
  // Lo usa power-ups para soltar la cápsula.
  alDestruirEscolta: function (fn) {
    this.oyentesEscolta.push(fn);
  },

  // Cuenta las naves de un grupo amarilla + dos rojas que caen fuera de la
  // formación; la que vuelve a su hueco ya no está en atacantes.
  contarCaida: function (nave) {
    for (var i = 0; i < this.atacantes.length; i++) {
      var a = this.atacantes[i];
      if (a.nave !== nave || !a.grupo) continue;
      if (++a.grupo.caidas === 3) {
        for (var k = 0; k < this.oyentesEscolta.length; k++) this.oyentesEscolta[k](a.x, a.y);
      }
      return;
    }
  },

  // Máximo de ataques a la vez (la amarilla con su escolta cuenta como uno):
  // dos en la primera oleada y uno más en cada oleada siguiente, hasta seis.
  maximoAtaques: function () {
    return Math.min(1 + this.oleada, 6);
  },

  // Segundos entre un ataque y el siguiente, más corto con cada oleada.
  pausa: function () {
    return (1.5 + Math.random() * 1.5) / (1 + 0.1 * (this.oleada - 1));
  },

  // Al aparecer la nave de recambio, los ataques esperan antes de empezar.
  tregua: function () {
    this.espera = this.PRIMER_ATAQUE;
  },

  reiniciar: function () {
    this.atacantes = [];
    this.bombas = [];
    this.espera = this.PRIMER_ATAQUE;
    this.naves = KF.formacion.naves;
  },

  // Si el rectángulo {x, y, ancho, alto} toca una nave en picado viva, la
  // destruye y la devuelve; si no, devuelve null. Lo usa el disparo del jugador.
  tocar: function (r) {
    var f = KF.formacion;
    for (var i = 0; i < this.atacantes.length; i++) {
      var a = this.atacantes[i];
      if (!a.nave.viva) continue;
      if (r.x < a.x + f.ANCHO_NAVE / 2 && r.x + r.ancho > a.x - f.ANCHO_NAVE / 2 &&
          r.y < a.y + f.ALTO_NAVE / 2 && r.y + r.alto > a.y - f.ALTO_NAVE / 2) {
        KF.enemigos.destruir(a.nave, a.x, a.y, 'disparo');
        return a.nave;
      }
    }
    return null;
  },

  // Número de ataques en curso: cada grupo cuenta una vez.
  ataquesEnCurso: function () {
    var n = 0;
    for (var i = 0; i < this.atacantes.length; i++) {
      if (!this.atacantes[i].lider) n++;
    }
    return n;
  },

  // Elige al azar una nave en su hueco; las amarillas, algo más a menudo.
  elegirNave: function () {
    var candidatas = [];
    for (var i = 0; i < this.naves.length; i++) {
      var n = this.naves[i];
      if (!n.viva || !n.enFormacion) continue;
      candidatas.push(n);
      if (n.tipo === 'amarilla') candidatas.push(n, n);
    }
    if (!candidatas.length) return null;
    return candidatas[Math.floor(Math.random() * candidatas.length)];
  },

  // Las dos rojas en su hueco más próximas a la columna de la amarilla: las
  // de debajo si están, si no las más cercanas.
  elegirEscolta: function (amarilla) {
    var rojas = this.naves.filter(function (n) {
      return n.viva && n.enFormacion && n.tipo === 'roja';
    });
    rojas.sort(function (a, b) {
      return Math.abs(a.columna - amarilla.columna) - Math.abs(b.columna - amarilla.columna) ||
        Math.random() - 0.5;
    });
    return rojas.slice(0, 2);
  },

  lanzar: function (nave) {
    var p = KF.formacion.posicionHueco(nave);
    // Sale hacia el lado de la pantalla en el que está.
    var lado = p.x < KF.ANCHO / 2 ? -1 : 1;
    var lider = this.crearAtacante(nave, lado, null, 0);
    if (nave.tipo === 'amarilla') {
      var escolta = this.elegirEscolta(nave);
      // Solo la amarilla con dos rojas forma un grupo que suelta power-up.
      var grupo = escolta.length === 2 ? { caidas: 0 } : null;
      lider.grupo = grupo;
      for (var i = 0; i < escolta.length; i++) {
        // Con dos escoltas, una a cada lado; con una, del lado en que estaba.
        var hueco = escolta.length === 2 ? (i === 0 ? -1 : 1)
          : (escolta[i].columna < nave.columna ? -1 : 1);
        if (escolta.length === 2 && escolta[1].columna < escolta[0].columna) hueco = -hueco;
        this.crearAtacante(escolta[i], lado, lider, hueco).grupo = grupo;
      }
    }
  },

  crearAtacante: function (nave, lado, lider, hueco) {
    var p = KF.formacion.posicionHueco(nave);
    var tipo = KF.TIPOS_NAVE[nave.tipo];
    var a = {
      nave: nave,
      fase: 'salida',   // 'salida' | 'picado' | 'vuelta'
      t: 0,
      lado: lado,
      origen: { x: p.x, y: p.y },
      x: p.x,
      y: p.y,
      vx: 0,
      angulo: 0,        // 0 = cañones hacia arriba, en radianes y en sentido horario
      lider: lider,     // la amarilla a la que escolta, o null
      hueco: hueco,     // -1 o 1: lado de la amarilla en que va la escolta
      puesto: null,     // posición de la escolta respecto a la amarilla
      grupo: null,      // {caidas}: grupo amarilla + dos rojas, para power-ups
      oscilacion: Math.random() * Math.PI * 2,
      // Cuántas bombas soltará en este ataque, hasta el máximo de su tipo.
      bombas: 1 + Math.floor(Math.random() * tipo.bombas),
      esperaBomba: 0
    };
    nave.enFormacion = false;
    this.atacantes.push(a);
    return a;
  },

  actualizar: function (dt) {
    // Una formación nueva (otra oleada) deja atrás los ataques de la anterior.
    if (this.naves !== KF.formacion.naves) this.reiniciar();

    var j = KF.jugador;
    this.espera -= dt;
    if (this.espera <= 0) {
      this.espera = this.pausa();
      if (j.estado === 'viva' && this.ataquesEnCurso() < this.maximoAtaques()) {
        var nave = this.elegirNave();
        if (nave) this.lanzar(nave);
      }
    }

    for (var i = 0; i < this.atacantes.length; i++) {
      this.moverAtacante(this.atacantes[i], dt);
    }
    // Fuera los que han vuelto a su hueco o han sido destruidos.
    this.atacantes = this.atacantes.filter(function (a) {
      return a.nave.viva && !a.nave.enFormacion;
    });

    this.moverBombas(dt);
    this.comprobarChoques();
  },

  moverAtacante: function (a, dt) {
    var v = this.factorVelocidad;
    a.t += dt;

    if (a.fase === 'salida') {
      // Media vuelta hacia arriba: sube, gira 180° y queda apuntando abajo.
      var th = Math.min(a.t / this.DURACION_SALIDA, 1) * Math.PI;
      var r = this.RADIO_SALIDA;
      a.x = a.origen.x + a.lado * r * (1 - Math.cos(th));
      a.y = a.origen.y - r * Math.sin(th);
      a.angulo = a.lado * th;
      if (th >= Math.PI) {
        a.fase = 'picado';
        a.vx = 0;
      }
      return;
    }

    if (a.fase === 'picado') {
      var lider = a.lider && a.lider.nave.viva && a.lider.fase === 'picado' ? a.lider : null;
      var xAntes = a.x;
      if (lider) {
        // Escolta: en paralelo debajo de la amarilla, a su lado. Se acerca
        // poco a poco a su puesto y luego la sigue sin retraso.
        if (!a.puesto) a.puesto = { x: a.x - lider.x, y: a.y - lider.y };
        var k = Math.min(1, dt * 6);
        a.puesto.x += (a.hueco * this.ESCOLTA_DX - a.puesto.x) * k;
        a.puesto.y += (this.ESCOLTA_DY - a.puesto.y) * k;
        a.x = lider.x + a.puesto.x;
        a.y = lider.y + a.puesto.y;
        a.vx = dt > 0 ? (a.x - xAntes) / dt : 0;
        a.angulo = lider.angulo;
      } else {
        // Hacia el jugador, con una oscilación suave que la hace irregular.
        var objetivo = KF.jugador.estado === 'viva' ? KF.jugador.x : a.x;
        var deseada = 0;
        if (a.y < KF.jugador.Y - 30) {
          deseada = Math.max(-this.VELOCIDAD_LATERAL, Math.min(this.VELOCIDAD_LATERAL, (objetivo - a.x) * 1.2));
          deseada += 25 * Math.sin(a.oscilacion + a.t * 2.5);
        } else {
          deseada = a.vx; // ya ha pasado al jugador: sigue recto
        }
        a.vx += (deseada - a.vx) * Math.min(1, dt * 2);
        a.x = Math.max(6, Math.min(KF.ANCHO - 6, a.x + a.vx * v * dt));
        a.y += this.VELOCIDAD_BAJADA * v * dt;
        // Cañones hacia el jugador mientras está por encima de él.
        if (a.y < KF.jugador.Y - 16) {
          this.girarHacia(a, Math.atan2(KF.jugador.x - a.x, -(KF.jugador.Y - a.y)), dt);
        }
      }
      this.soltarBombas(a, dt);
      if (a.y > KF.ALTO + 8) {
        // Sale por abajo y reaparece arriba, encima de su hueco.
        a.fase = 'vuelta';
        a.y = -8;
        a.x = KF.formacion.posicionHueco(a.nave).x;
      }
      return;
    }

    // Vuelta: baja hasta su hueco, que se mueve con la formación, y se endereza.
    var p = KF.formacion.posicionHueco(a.nave);
    var dx = p.x - a.x, dy = p.y - a.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var paso = this.VELOCIDAD_VUELTA * dt;
    this.girarHacia(a, d < 60 ? 0 : Math.PI, dt);
    if (d <= paso + 0.5) {
      a.nave.enFormacion = true;
    } else {
      a.x += dx / d * paso;
      a.y += dy / d * paso;
    }
  },

  // Gira el ángulo de la nave hacia el objetivo por el camino más corto.
  girarHacia: function (a, objetivo, dt) {
    var diferencia = objetivo - a.angulo;
    diferencia = Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
    var maximo = this.GIRO * dt;
    a.angulo += Math.max(-maximo, Math.min(maximo, diferencia));
    a.angulo = Math.atan2(Math.sin(a.angulo), Math.cos(a.angulo));
  },

  // Suelta sus bombas espaciadas mientras baja por encima del jugador.
  soltarBombas: function (a, dt) {
    a.esperaBomba -= dt;
    if (a.bombas <= 0 || a.esperaBomba > 0) return;
    if (a.y < 90 || a.y > KF.jugador.Y - 60) return;
    if (Math.random() > dt * 4) return; // no siempre en el mismo sitio
    a.bombas--;
    a.esperaBomba = this.SEPARACION_BOMBAS;
    // La bomba conserva la inercia horizontal de la nave.
    this.bombas.push({ x: a.x, y: a.y + 5, vx: a.vx * this.factorVelocidad });
  },

  moverBombas: function (dt) {
    var vy = this.VELOCIDAD_BOMBA * this.factorVelocidad;
    for (var i = 0; i < this.bombas.length; i++) {
      this.bombas[i].x += this.bombas[i].vx * dt;
      this.bombas[i].y += vy * dt;
    }
    this.bombas = this.bombas.filter(function (b) { return b.y < KF.ALTO + 8; });
  },

  // Una nave en picado o una bomba que toca al jugador lo hace explotar. La
  // nave alienígena que choca también se destruye, como en el arcade.
  comprobarChoques: function () {
    var c = KF.jugador.caja();
    if (!c) return;
    var f = KF.formacion, h = this.SPRITE_BOMBA;
    var toca = function (x, y, ancho, alto) {
      return x < c.x + c.ancho && x + ancho > c.x && y < c.y + c.alto && y + alto > c.y;
    };
    for (var i = 0; i < this.bombas.length; i++) {
      var b = this.bombas[i];
      if (toca(b.x - h.width / 2, b.y - h.height / 2, h.width, h.height)) {
        this.bombas.splice(i, 1);
        KF.jugador.explotar();
        return;
      }
    }
    for (i = 0; i < this.atacantes.length; i++) {
      var a = this.atacantes[i];
      if (a.nave.viva && toca(a.x - f.ANCHO_NAVE / 2, a.y - f.ALTO_NAVE / 2, f.ANCHO_NAVE, f.ALTO_NAVE)) {
        KF.enemigos.destruir(a.nave, a.x, a.y, 'choque');
        KF.jugador.explotar();
        return;
      }
    }
  },

  dibujar: function (ctx) {
    var g = KF.graficos;
    for (var i = 0; i < this.bombas.length; i++) {
      g.dibujar(ctx, this.SPRITE_BOMBA, this.bombas[i].x, this.bombas[i].y);
    }
    for (i = 0; i < this.atacantes.length; i++) {
      var a = this.atacantes[i];
      if (a.nave.viva) g.dibujarGirado(ctx, KF.TIPOS_NAVE[a.nave.tipo].sprite, a.x, a.y, a.angulo);
    }
  }
};

KF.ataque.SPRITE_BOMBA = KF.graficos.SPRITE_BOMBA;
KF.ataque.reiniciar();
KF.enemigos.alDestruir(function (nave) { KF.ataque.contarCaida(nave); });
KF.registrar(KF.ataque);
