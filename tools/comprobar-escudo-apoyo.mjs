// Comprueba el escudo y las naves de apoyo (mejoras/escudo-y-apoyo) sin
// navegador: carga js/graficos.js, js/jugador.js y js/ataque.js con un lienzo
// y el resto del juego simulados y mira que el escudo aguanta un golpe y
// vuelve con la nave siguiente, que las naves de apoyo disparan con la nave
// sin contar para su máximo, que lo que las toca las destruye y que en la
// partida a dos no hay ni escudo ni naves de apoyo.
// Uso: node tools/comprobar-escudo-apoyo.mjs (desde la raíz del repositorio).
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
const destruidas = [];
const KF = {
  ANCHO: 224, ALTO: 288, RESOLUCION: 4,
  registrar: nada,
  teclas: {}, tactil: { dx: 0, disparar: false }, inclinacion: { grados: () => 0 },
  formacion: { naves: [], ANCHO_NAVE: 11, ALTO_NAVE: 9, tocar: () => null },
  desafio: { tocar: () => null },
  jefe: { alcanza: () => false },
  enemigos: { alDestruir: nada, explosiones: [], destruir(n) { n.viva = false; destruidas.push(n); } },
  dificultad: { ataquesDeMas: () => 0, factorPausa: () => 1 },
  partida: { sumarRecambio: nada },
  red: { invitado: false },
  combos: { cortar: nada },
  tienda: { nivel: (id) => (KF.companero ? 0 : niveles[id] || 0), factorVelocidad: () => 1, factorDisparo: () => 1, factorBombas: () => 1 }
};
const ctx = vm.createContext({ KF, document: documento, window: { addEventListener: nada }, Math, Object, Array, parseInt });
for (const f of ['js/graficos.js', 'js/jugador.js', 'js/ataque.js']) {
  vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
}
const j = KF.jugador, at = KF.ataque;

// Sin mejoras: ni escudo ni naves de apoyo, y un golpe la hace explotar.
j.aparecer();
comprobar(!j.blindaje && j.apoyos.length === 0, 'sin mejoras no debe haber escudo ni naves de apoyo');
j.escudo = 0;
j.explotar();
comprobar(j.estado === 'explotando', 'sin escudo un golpe debe hacer explotar la nave');

// Con SHIELD: el primer golpe rompe el escudo, el segundo (pasada la
// invulnerabilidad) destruye la nave, y la nave siguiente lo trae otra vez.
niveles.SHIELD = 1;
j.aparecer();
comprobar(j.blindaje, 'con SHIELD la nave debe aparecer con escudo');
j.escudo = 0;
j.explotar();
comprobar(j.estado === 'viva' && !j.blindaje && j.golpes === 1, 'el primer golpe debe romper el escudo sin destruir la nave');
comprobar(j.escudo > 0, 'al romperse el escudo la nave debe quedar un momento invulnerable');
j.explotar();
comprobar(j.estado === 'viva', 'durante la invulnerabilidad otro golpe no debe destruirla');
j.escudo = 0;
j.explotar();
comprobar(j.estado === 'explotando', 'sin escudo, el siguiente golpe debe destruir la nave');
j.aparecer();
comprobar(j.blindaje, 'la nave siguiente debe traer el escudo otra vez');

// Con WINGMAN: una nave de apoyo a la izquierda; con nivel 2, una a cada lado.
niveles.WINGMAN = 1;
j.aparecer();
comprobar(j.apoyos.length === 1 && j.apoyos[0].lado === -1, 'WINGMAN nivel 1 debe dar una nave de apoyo a la izquierda');
niveles.WINGMAN = 2;
j.aparecer();
comprobar(j.apoyos.length === 2 && j.apoyos[1].lado === 1, 'WINGMAN nivel 2 debe dar una nave de apoyo a cada lado');

// Disparan a la vez que la nave, desde su sitio, sin contar para el máximo.
j.disparos = [];
j.disparar();
const xs = j.disparos.map((d) => d.x).sort((a, b) => a - b);
comprobar(j.disparos.length === 3 && xs[0] < j.x && xs[2] > j.x, 'cada nave de apoyo debe disparar a la vez que la nave, desde su lado');
comprobar(j.disparos.every((d) => d.salva === j.disparos[0].salva) && j.disparos[0].salva.quedan === 3, 'los disparos de las naves de apoyo deben ser de la misma salva');
j.disparos = j.disparos.filter((d) => d.apoyo);
j.disparar();
comprobar(j.disparos.filter((d) => !d.apoyo).length === 1, 'los disparos de apoyo no deben impedir que la nave dispare');

// La nave no se acerca al borde más de lo que dejan sus naves de apoyo.
KF.teclas.ArrowLeft = true;
for (let i = 0; i < 200; i++) j.actualizar(0.05);
KF.teclas.ArrowLeft = false;
comprobar(j.xApoyo(j.apoyos[0]) - j.ANCHO_APOYO / 2 >= 0, 'la nave de apoyo de la izquierda no debe salirse de la pantalla');

// Una bomba que toca una nave de apoyo la destruye y desaparece; la nave sigue.
j.escudo = 0;
j.blindaje = false;
const izquierda = j.apoyos[0];
at.bombas = [{ id: 1, x: j.xApoyo(izquierda), y: j.Y, vx: 0 }];
at.atacantes = [];
at.comprobarChoques();
comprobar(j.apoyos.length === 1 && j.apoyos[0].lado === 1, 'una bomba debe destruir la nave de apoyo que toca');
comprobar(at.bombas.length === 0 && j.estado === 'viva', 'la bomba debe desaparecer y la nave seguir viva');

// Una nave en picado que choca con una nave de apoyo la destruye y se destruye.
const atacante = { nave: { viva: true }, x: j.xApoyo(j.apoyos[0]), y: j.Y };
at.atacantes = [atacante];
at.comprobarChoques();
comprobar(j.apoyos.length === 0 && destruidas.includes(atacante.nave) && j.estado === 'viva', 'una nave que choca con la nave de apoyo debe destruirse con ella');

// Al explotar la nave pierde sus naves de apoyo; la siguiente las trae.
j.aparecer();
j.escudo = 0; j.blindaje = false;
j.explotar();
comprobar(j.apoyos.length === 0, 'al explotar la nave se pierden sus naves de apoyo');
j.aparecer();
comprobar(j.apoyos.length === 2, 'la nave siguiente debe traer las naves de apoyo');

// A dos, nada de esto.
KF.companero = new KF.Nave(2);
j.aparecer();
comprobar(!j.blindaje && j.apoyos.length === 0, 'en la partida a dos no debe haber escudo ni naves de apoyo');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Escudo y naves de apoyo correctos: un golpe, disparo a la vez y vuelta con cada nave.');
