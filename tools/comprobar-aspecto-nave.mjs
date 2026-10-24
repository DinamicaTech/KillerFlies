// Comprueba el aspecto de la nave con poder (power-ups/aspecto-nave) sin
// navegador: carga js/graficos.js, js/jugador.js y js/powerups.js con un
// lienzo simulado y mira que cada power-up que dura tiene su propio aspecto
// para los dos jugadores, que sin poder o con la vida extra la nave es la
// normal, que la nave se dibuja con el aspecto de su poder (con el halo de la
// aniquilación) y que vuelve a la normal al perder el poder o empezar oleada.
// Uso: node tools/comprobar-aspecto-nave.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};

// Contexto 2D simulado: acepta cualquier llamada y anota las que interesan.
const llamadas = [];
const crearContexto = () => new Proxy({}, {
  get(obj, nombre) {
    if (nombre in obj) return obj[nombre];
    if (nombre === 'createLinearGradient' || nombre === 'createRadialGradient') return () => ({ addColorStop: nada });
    return (...args) => { llamadas.push([nombre, ...args]); };
  },
  set(obj, nombre, valor) { obj[nombre] = valor; return true; }
});
const documento = { createElement: () => ({ getContext: crearContexto }) };
const KF = {
  ANCHO: 224, ALTO: 288, RESOLUCION: 4,
  registrar: nada,
  formacion: { naves: [] },
  ataque: { alDestruirEscolta: nada },
  partida: { sumarRecambio: nada },
  red: { invitado: false },
  combos: { cortar: nada },
  tienda: { nivel: () => 0, nivelDe: () => 0, nivelJuego: () => 0 }
};
const ctx = vm.createContext({ KF, document: documento, window: { addEventListener: nada }, Math, Object, Array, parseInt });
for (const f of ['js/graficos.js', 'js/jugador.js', 'js/powerups.js']) {
  vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
}

const g = KF.graficos, pu = KF.powerups;
const conAspecto = pu.PODERES.filter((p) => p !== 'vida');
const uno = KF.jugador, dos = new KF.Nave(2);

for (const [nave, nombre] of [[uno, 'jugador 1'], [dos, 'jugador 2']]) {
  nave.poder = null;
  comprobar(nave.spriteActual() === nave.SPRITE, `${nombre}: sin poder la nave debe ser la normal`);
  const vistos = new Set([nave.SPRITE]);
  for (const poder of conAspecto) {
    nave.poder = poder;
    const s = nave.spriteActual();
    comprobar(s && s.hd && s.width === 13 && s.height === 13, `${nombre}: con ${poder} la nave debe seguir midiendo 13×13`);
    comprobar(!vistos.has(s), `${nombre}: ${poder} debe tener un aspecto propio`);
    vistos.add(s);
  }
  nave.poder = 'vida';
  comprobar(nave.spriteActual() === nave.SPRITE, `${nombre}: la vida extra no cambia la nave`);
}
for (const poder of conAspecto) {
  comprobar(g.SPRITES_JUGADOR_PODER[0][poder] !== g.SPRITES_JUGADOR_PODER[1][poder],
    `${poder}: cada jugador debe tener su propia nave (color del morro)`);
}

// Al dibujarse, la nave usa el aspecto de su poder; el halo solo con la aniquilación.
const dibujar = (poder) => {
  llamadas.length = 0;
  uno.estado = 'viva'; uno.escudo = 0; uno.vx = 0; uno.remoto = false; uno.poder = poder;
  uno.dibujar(crearContexto());
  return {
    imagen: llamadas.filter((l) => l[0] === 'drawImage').map((l) => l[1]),
    halo: llamadas.some((l) => l[0] === 'arc')
  };
};
for (const poder of [null, ...conAspecto]) {
  const d = dibujar(poder);
  const esperado = poder ? g.SPRITES_JUGADOR_PODER[0][poder] : g.SPRITES_JUGADOR[0];
  comprobar(d.imagen.includes(esperado.imagen), `con ${poder || 'ningún poder'} la nave debe dibujarse con su aspecto`);
  comprobar(d.halo === (poder === 'aniquilacion'), `el halo solo debe verse con la aniquilación (${poder || 'sin poder'})`);
}

// Al perder el poder, la nave vuelve a la normal: al morir (explotar) y al
// empezar oleada o partida.
uno.poder = 'bomba';
pu.reiniciar();
comprobar(uno.spriteActual() === uno.SPRITE, 'al empezar oleada la nave debe volver a la normal');
uno.poder = 'triple'; uno.estado = 'viva'; uno.escudo = 0;
uno.explotar();
comprobar(uno.spriteActual() === uno.SPRITE, 'al explotar la nave debe perder su aspecto con poder');

if (errores.length) {
  console.error('Fallos en el aspecto de la nave con poder:\n- ' + errores.join('\n- '));
  process.exit(1);
}
console.log('Aspecto de la nave con poder: todo correcto.');
