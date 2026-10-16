// Vibración del móvil: un vibrazo largo cuando explota la nave de este
// dispositivo (KF.jugador) y uno corto cuando recoge una cápsula de power-up.
// Las vidas extra de la oleada desafío y de los puntos no vibran. En la
// partida a dos solo vibra el móvil del jugador al que le pasa; el invitado lo
// sabe por la foto del anfitrión (estado de su nave y sus cápsulas). Sin
// navigator.vibrate (el iPhone y la mayoría de los PC) no hace nada.
KF.vibracion = {
  EXPLOSION: 400,          // milisegundos al explotar la nave
  POWER_UP: 60,            // milisegundos al recoger una cápsula

  nave: null,              // nave observada; cambia al entrar o salir de la partida a dos
  estado: null,
  capsulas: 0,

  vibrar: function (ms) {
    if (document.hidden || KF.pausa.activa || !navigator.vibrate) return;
    try { navigator.vibrate(ms); } catch (e) { /* el navegador puede negarse */ }
  },

  actualizar: function () {
    var j = KF.jugador;
    if (j !== this.nave) {
      this.nave = j;
      this.estado = j.estado;
      this.capsulas = j.capsulas;
      return;
    }
    if (j.estado === 'explotando' && this.estado !== 'explotando') this.vibrar(this.EXPLOSION);
    else if (j.capsulas > this.capsulas) this.vibrar(this.POWER_UP);
    this.estado = j.estado;
    this.capsulas = j.capsulas;
  }
};

KF.registrar(KF.vibracion);
