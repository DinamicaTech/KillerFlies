// Los cuatro tipos de nave alienígena: color, puntos y máximo de bombas por ataque.
KF.TIPOS_NAVE = {
  azul:     { puntos: 10, bombas: 2 },
  lila:     { puntos: 20, bombas: 3 },
  roja:     { puntos: 30, bombas: 4 },
  amarilla: { puntos: 50, bombas: 4 }
};

(function () {
  var g = KF.graficos;
  KF.TIPOS_NAVE.azul.sprite = g.crearSprite(g.MAPA_NAVE, { C: '#3ec8d8', A: '#2a3cff', O: '#ff2a2a' });
  KF.TIPOS_NAVE.lila.sprite = g.crearSprite(g.MAPA_NAVE, { C: '#b030e8', A: '#7a18c8', O: '#ffffff' });
  KF.TIPOS_NAVE.roja.sprite = g.crearSprite(g.MAPA_NAVE, { C: '#f02828', A: '#2a3cff', O: '#ffff40' });
  KF.TIPOS_NAVE.amarilla.sprite = g.crearSprite(g.MAPA_NODRIZA, { Y: '#ffd820', R: '#f03020' });
})();
