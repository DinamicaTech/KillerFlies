// Comprueba las mejoras de la fase 4 (mejoras/skins) sin navegador: carga
// js/graficos.js, js/enemigos.js, js/jugador.js y js/ataque.js con un lienzo
// y el resto del juego simulados y mira que YELLOW hace atacar más a las
// amarillas, que con ESCORT cae cápsula con la amarilla y una sola escolta,
// que KEEP POWER guarda el power-up una vez por partida, que cada skin tiene
// su variante para cada power-up y que TRAIL, BLAST y STARS cambian lo que se
// dibuja; y que la nave del otro jugador no lleva nada de esto.
// Uso: node tools/comprobar-skins.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};

const crearContexto = () => new Proxy({}, {
  get(obj, nombre) {
    if (nombre in obj) return obj[nombre];
    if (nombre === 'createLinearGradient' || nombre === 'createRadialGradient') return () => ({ addColorStop: nada });
    return () => {};
  },
  set(obj, nombre, valor) { obj[nombre] = valor; return true; }
});
const documento = { createElement: () => ({ getContext: crearContexto }) };
const niveles = {};
const KF = {
  ANCHO: 224, ALTO: 288, RESOLUCION: 4,
  registrar: nada,
  teclas: {}, tactil: { dx: 0, disparar: false }, inclinacion: { grados: () => 0 },
  formacion: { naves: [], ANCHO_NAVE: 11, ALTO_NAVE: 9, tocar: () => null, posicionHueco: (n) => ({ x: n.columna * 16, y: 40 }) },
  desafio: { tocar: () => null },
  jefe: { alcanza: () => false },
  dificultad: { ataquesDeMas: () => 0, factorPausa: () => 1 },
  partida: { sumarRecambio: nada },
  red: { invitado: false },
  combos: { cortar: nada },
  tienda: { nivel: (id) => niveles[id] || 0, factorVelocidad: () => 1, factorDisparo: () => 1, factorBombas: () => 1 }
};
const ctx = vm.createContext({ KF, document: documento, window: { addEventListener: nada }, Math, Object, Array, parseInt });
for (const f of ['js/graficos.js', 'js/enemigos.js', 'js/jugador.js', 'js/ataque.js']) {
  vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
}
const g = KF.graficos, j = KF.jugador, at = KF.ataque;

// Lo que se dibuja: cada sprite que pasa por KF.graficos.dibujar.
let dibujados = [];
const dibujarOriginal = g.dibujar;
g.dibujar = function (c, sprite, x, y) { dibujados.push(sprite); };
const lienzo = crearContexto();

// YELLOW: una amarilla entre nueve azules ataca 3 veces más a menudo que cada
// una (3 de 12); con 5 niveles, un 50% más (4,5 de 13,5).
const formacion = [{ tipo: 'amarilla', columna: 5, viva: true, enFormacion: true }];
for (let i = 0; i < 9; i++) formacion.push({ tipo: 'azul', columna: i, viva: true, enFormacion: true });
at.naves = formacion;
const frecuencia = () => {
  let amarillas = 0;
  for (let i = 0; i < 20000; i++) if (at.elegirNave().tipo === 'amarilla') amarillas++;
  return amarillas / 20000;
};
comprobar(Math.abs(frecuencia() - 3 / 12) < 0.02, 'sin YELLOW la amarilla debe atacar 3 veces más que cada una de las demás');
niveles.YELLOW = 5;
comprobar(Math.abs(frecuencia() - 4.5 / 13.5) < 0.02, 'YELLOW nivel 5 debe subir un 50% los ataques de la amarilla');
delete niveles.YELLOW;

// ESCORT: la amarilla y una de sus dos rojas bastan para la cápsula, y con
// una sola roja de escolta también hay grupo.
let capsulas = 0;
at.alDestruirEscolta(() => { capsulas++; });
const grupo = (rojas) => {
  const amarilla = { tipo: 'amarilla', columna: 5, viva: true, enFormacion: true };
  const lista = [amarilla];
  for (let i = 0; i < rojas; i++) lista.push({ tipo: 'roja', columna: 4 + 2 * i, viva: true, enFormacion: true });
  at.naves = lista;
  at.atacantes = [];
  at.lanzar(amarilla);
  return lista;
};
let naves = grupo(2);
at.contarCaida(naves[0]); at.contarCaida(naves[1]);
comprobar(capsulas === 0, 'sin ESCORT la amarilla y una escolta no deben soltar cápsula');
at.contarCaida(naves[2]);
comprobar(capsulas === 1, 'sin ESCORT la amarilla y sus dos escoltas deben soltar cápsula');
naves = grupo(1);
comprobar(!at.atacantes[0].grupo, 'sin ESCORT una amarilla con una sola escolta no forma grupo');
niveles.ESCORT = 1;
capsulas = 0;
naves = grupo(2);
at.contarCaida(naves[1]); at.contarCaida(naves[2]);
comprobar(capsulas === 0, 'con ESCORT las dos escoltas sin la amarilla no deben soltar cápsula');
naves = grupo(2);
at.contarCaida(naves[0]); at.contarCaida(naves[1]);
comprobar(capsulas === 1, 'con ESCORT la amarilla y una escolta deben soltar cápsula');
naves = grupo(2);
at.contarCaida(naves[0]); at.contarCaida(naves[1]); at.contarCaida(naves[2]);
comprobar(capsulas === 2, 'con ESCORT el grupo entero debe soltar una sola cápsula');
naves = grupo(1);
at.contarCaida(naves[0]); at.contarCaida(naves[1]);
comprobar(capsulas === 3, 'con ESCORT una amarilla con una sola escolta debe soltar cápsula');
delete niveles.ESCORT;

// KEEP POWER: la primera vez que destruyen la nave con un power-up lo
// conserva; la segunda, no; y en la partida siguiente vuelve a valer.
const destruir = () => { j.escudo = 0; j.blindaje = false; j.explotar(); j.aparecer(); };
j.retirar(); j.aparecer();
j.poder = 'triple';
destruir();
comprobar(j.poder === null, 'sin KEEP POWER el power-up se pierde al destruir la nave');
niveles['KEEP POWER'] = 1;
j.poder = 'triple';
destruir();
comprobar(j.poder === 'triple', 'con KEEP POWER la primera destrucción debe conservar el power-up');
destruir();
comprobar(j.poder === null, 'con KEEP POWER la segunda destrucción debe perder el power-up');
j.retirar(); j.aparecer();
j.poder = 'bomba';
destruir();
comprobar(j.poder === 'bomba', 'en una partida nueva KEEP POWER debe volver a valer');
delete niveles['KEEP POWER'];

// Skins: cada una con su nave normal y su variante para cada power-up.
const poderes = Object.keys(g.INTERIOR_PODER);
for (const id of ['SKIN BLUE', 'SKIN GOLD']) {
  const s = g.SPRITES_SKIN[id];
  comprobar(s && s.normal && poderes.every((p) => s.poder[p] && s.poder[p] !== s.normal), id + ' debe tener su variante para cada power-up');
  niveles[id] = 1;
  j.poder = null;
  comprobar(j.spriteActual() === s.normal, 'con ' + id + ' puesta la nave debe verse con esa skin');
  j.poder = 'profundo';
  comprobar(j.spriteActual() === s.poder.profundo, 'con ' + id + ' y un power-up la nave debe verse con su variante');
  delete niveles[id];
}
j.poder = null;
comprobar(j.spriteActual() === j.SPRITE, 'sin skin la nave debe ser la normal');
niveles['SKIN GOLD'] = 1;
const otra = new KF.Nave(2);
comprobar(otra.spriteActual() === otra.SPRITE, 'la nave del otro jugador no debe llevar la skin');
delete niveles['SKIN GOLD'];

// TRAIL: la llama del motor, azul.
const llama = () => { dibujados = []; j.vx = 10; j.dibujar(lienzo); j.vx = 0; return dibujados; };
comprobar(llama().some((s) => g.SPRITES_LLAMA.includes(s)), 'sin TRAIL la llama debe ser la normal');
niveles.TRAIL = 1;
comprobar(llama().some((s) => g.SPRITES_LLAMA_AZUL.includes(s)), 'con TRAIL la llama debe ser azul');
delete niveles.TRAIL;

// BLAST: explosiones de plasma, de las naves alienígenas y de la nave.
KF.enemigos.explosiones = [{ x: 50, y: 50, tiempo: 0 }];
dibujados = []; KF.enemigos.dibujar(lienzo);
comprobar(dibujados[0] === g.SPRITES_EXPLOSION_NAVE[0], 'sin BLAST la explosión debe ser la normal');
niveles.BLAST = 1;
dibujados = []; KF.enemigos.dibujar(lienzo);
comprobar(dibujados[0] === g.SPRITES_EXPLOSION_NAVE_PLASMA[0], 'con BLAST la explosión de las naves debe ser de plasma');
j.escudo = 0; j.blindaje = false; j.fragmentos = [];
j.explotar();
dibujados = []; j.dibujar(lienzo);
comprobar(dibujados[0] === g.SPRITES_EXPLOSION_JUGADOR_PLASMA[0], 'con BLAST la explosión de la nave debe ser de plasma');
comprobar(j.fragmentos.every((f) => g.COLORES_FRAGMENTOS_PLASMA.includes(f.color)), 'con BLAST los fragmentos deben ser de plasma');
delete niveles.BLAST;

// STARS: las estrellas, de otros colores.
const colores = () => {
  const usados = new Set();
  const pincel = new Proxy({}, { set(o, k, v) { if (k === 'fillStyle') usados.add(v); return true; }, get: () => nada });
  g.fondo.estrellas.forEach((e) => { e.fase = 0; });
  g.fondo.dibujar(pincel);
  return [...usados];
};
comprobar(colores().every((c) => g.fondo.COLORES_ESTRELLAS.includes(c)), 'sin STARS las estrellas deben tener sus colores');
niveles.STARS = 1;
comprobar(colores().every((c) => g.fondo.COLORES_ESTRELLAS_STARS.includes(c)), 'con STARS las estrellas deben tener los otros colores');
delete niveles.STARS;
g.dibujar = dibujarOriginal;

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Fase 4 correcta: YELLOW, ESCORT, KEEP POWER, skins, TRAIL, BLAST y STARS.');
