// Los cuatro tipos de nave alienígena: puntos y máximo de bombas por ataque.
KF.TIPOS_NAVE = {
  azul:     { puntos: 10, bombas: 2 },
  lila:     { puntos: 20, bombas: 3 },
  roja:     { puntos: 30, bombas: 4 },
  amarilla: { puntos: 50, bombas: 4 }
};

// Cada tipo toma su sprite, ya coloreado, de js/graficos.js.
Object.keys(KF.TIPOS_NAVE).forEach(function (tipo) {
  KF.TIPOS_NAVE[tipo].sprite = KF.graficos.SPRITES_NAVE[tipo];
});
