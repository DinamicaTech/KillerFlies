// Comprueba el 'hall of fame' (marcador/hall-of-fame) sin navegador: carga
// js/dificultad.js, js/perfect.js, js/ataque.js, js/partida.js y
// js/salon-fama.js con el resto del juego simulado y mira que, tras
// 'GAME OVER' de una partida a uno, se pide el nombre solo si los puntos
// entran entre los 10 mejores; que se escribe con el teclado y con el teclado
// en pantalla; que se guarda con la oleada y los puntos, en orden y como mucho
// 10; que la tabla se muestra siempre y vuelve a 'START GAME', y que a dos no
// se abre.
// Uso: node tools/comprobar-salon-fama.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};
const CLAVE = 'killerflies.salonFama';

// Un juego simulado de un jugador, con el almacenamiento del navegador en memoria.
function cargar(guardado) {
  const almacen = new Map(guardado);
  const nave = {
    estado: 'ausente', puntos: 0, recambio: 0, proximaVida: 0, racha: 0, disparos: [],
    retirar() { this.estado = 'ausente'; }, aparecer() { this.estado = 'viva'; }
  };
  const teclado = [], toques = [];
  const KF = {
    ANCHO: 224, ALTO: 288,
    graficos: { SPRITE_BOMBA: {}, FUENTE_ANCHO: 5, FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada },
    enemigos: { alDestruir: nada },
    registrar: nada,
    formacion: { naves: [], VELOCIDAD_INICIAL: 40, reiniciar() { this.naves = [{ viva: true }]; } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { activo: false, hecho: false, quitar: nada, empezar: nada },
    jefe: { CADA: 3, activo: false, hecho: false, quitar: nada, empezar: nada },
    powerups: { recogidas: 0 },
    combos: {}, tienda: { nivel: () => 0, nivelDe: () => 0, nivelJuego: () => 0 }, inclinacion: { calibrar: nada },
    red: { activa: () => false, fase: null, cerrar: nada, alMenu: nada },
    jugador: nave, jugadores: [nave], tactil: {},
    alPulsarCorto: (f) => toques.push(f),
    navesVivas: () => [nave].filter((n) => n.estado === 'viva')
  };
  const ventana = {
    addEventListener: (tipo, f) => { if (tipo === 'keydown') teclado.push(f); },
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const ctx = vm.createContext({ KF, window: ventana, Math, JSON, String, Array, parseInt, performance: { now: () => 0 } });
  for (const f of ['js/dificultad.js', 'js/perfiles.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js', 'js/salon-fama.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  // Una tecla como la da el navegador (keydown) y una pulsación corta en (x, y).
  const tecla = (key, code) => teclado.forEach((f) => f({ key, code: code || 'Key' + key, repeat: false, preventDefault: nada }));
  const tocar = (p) => { KF.ultimoToque = p; toques.forEach((f) => f()); };
  return { KF, almacen, nave, tecla, tocar };
}

// Juega una partida a uno que acaba en la oleada dada con esos puntos y sale
// de 'GAME OVER' con una tecla.
function acabarPartida(j, oleada, puntos) {
  const p = j.KF.partida;
  p.empezar();
  p.ponerOleada(oleada);
  j.nave.puntos = puntos;
  j.nave.recambio = 0;
  j.nave.estado = 'ausente';
  p.actualizar(0.016);
  comprobar(p.estado === 'fin', "sin naves debe salir 'GAME OVER'");
  p.actualizar(p.ESPERA_FIN);
  j.tecla('x', 'KeyX');
}
const escribe = (j, texto) => { for (const c of texto) j.tecla(c, c === ' ' ? 'Space' : 'Key' + c); };
const pasa = (j, s) => j.KF.salonFama.actualizar(s);
const guardada = (j) => JSON.parse(j.almacen.get(CLAVE) || '[]');

// Primera partida, con la tabla vacía: entra, se pide el nombre, escrito ya
// con el del perfil de jugador (PLAYER).
let j = cargar([]);
let p = j.KF.partida, s = j.KF.salonFama;
acabarPartida(j, 4, 1230);
comprobar(p.estado === 'fama' && s.fase === 'nombre', 'con la tabla vacía, unos puntos deben pedir el nombre');
comprobar(s.nombre === 'PLAYER', 'el nombre debe venir escrito con el del perfil');
comprobar(s.nombre === 'PLAYER', "la tecla que sale de 'GAME OVER' no debe escribirse");
for (let i = 0; i < 6; i++) j.tecla('Backspace', 'Backspace');
escribe(j, 'ronaldo99x');
comprobar(s.nombre === 'RONALDO9', 'el nombre se escribe en mayúsculas y como mucho con 8 caracteres');
j.tecla('Backspace', 'Backspace');
j.tecla('-', 'Minus');
comprobar(s.nombre === 'RONALDO', 'Retroceso borra y lo que no está en la fuente se ignora');
j.tecla('Enter', 'Enter');
comprobar(s.fase === 'tabla' && s.nueva === 0, 'Enter guarda y muestra la tabla con la entrada nueva marcada');
let t = guardada(j);
comprobar(t.length === 1 && t[0].nombre === 'RONALDO' && t[0].oleada === 4 && t[0].puntos === 1230, 'debe guardarse nombre, oleada y puntos');
j.tecla('x', 'KeyX');
comprobar(p.estado === 'fama', 'la tabla no debe cerrarse con una tecla nada más abrirse');
pasa(j, s.ESPERA);
j.tecla('x', 'KeyX');
comprobar(p.estado === 'inicio' && s.fase === null, "una tecla en la tabla debe volver a 'START GAME'");

// Segunda partida: el nombre viene otra vez con el del perfil; con el teclado en pantalla.
acabarPartida(j, 2, 500);
comprobar(s.fase === 'nombre' && s.nombre === 'PLAYER', 'el nombre debe venir con el del perfil, no con el último escrito');
const tecla = (nombre) => s.teclas().find((k) => k.tecla === nombre);
const centro = (k) => ({ x: k.x + k.ancho / 2, y: k.y + k.alto / 2 });
for (let i = 0; i < 6; i++) j.tocar(centro(tecla('DEL')));
j.tocar(centro(tecla('A')));
j.tocar(centro(tecla('SPACE')));
j.tocar(centro(tecla('SPACE')));
j.tocar(centro(tecla('7')));
j.tocar({ x: 2, y: 2 });
comprobar(s.nombre === 'A 7', 'el teclado en pantalla escribe, borra y no pone dos espacios seguidos');
j.tocar(centro(tecla('END')));
t = guardada(j);
comprobar(t.length === 2 && t[1].nombre === 'A 7' && t[1].puntos === 500 && s.nueva === 1, 'END guarda, y la tabla va de más a menos puntos');
pasa(j, s.ESPERA);
j.tocar({ x: 100, y: 100 });
comprobar(p.estado === 'inicio', "un toque en la tabla debe volver a 'START GAME'");

// Con 0 puntos no se pide nombre, pero se muestra la tabla.
acabarPartida(j, 1, 0);
comprobar(p.estado === 'fama' && s.fase === 'tabla' && s.nueva === -1, 'con 0 puntos debe mostrarse la tabla sin pedir el nombre');
pasa(j, s.ESPERA);
j.tecla('x', 'KeyX');

// Nombre vacío: se guarda como PLAYER.
acabarPartida(j, 1, 10);
for (let i = 0; i < 8; i++) j.tecla('Backspace', 'Backspace');
j.tecla('Enter', 'Enter');
comprobar(guardada(j)[2].nombre === 'PLAYER', 'un nombre vacío debe guardarse como PLAYER');

// Tabla llena: solo entra quien supera al último; a igualdad, queda el que estaba.
const llena = Array.from({ length: 10 }, (_, i) => ({ nombre: 'P' + i, oleada: 10 - i, puntos: (10 - i) * 1000 }));
j = cargar([[CLAVE, JSON.stringify(llena)]]);
p = j.KF.partida; s = j.KF.salonFama;
acabarPartida(j, 3, 1000);
comprobar(s.fase === 'tabla', 'empatar con el décimo no debe entrar en la tabla');
pasa(j, s.ESPERA);
j.tecla('x', 'KeyX');
acabarPartida(j, 5, 4500);
comprobar(s.fase === 'nombre', 'superar al décimo debe pedir el nombre');
for (let i = 0; i < 8; i++) j.tecla('Backspace', 'Backspace');
escribe(j, 'NEW');
j.tecla('Enter', 'Enter');
t = guardada(j);
comprobar(t.length === 10 && t[6].nombre === 'NEW' && t[6].oleada === 5 && s.nueva === 6, 'la entrada nueva debe ir en su puesto');
comprobar(t[9].nombre === 'P8' && !t.some((e) => e.nombre === 'P9'), 'la tabla debe quedarse en 10, sin el último');
acabarPartida(j, 5, 4000);
for (let i = 0; i < 8; i++) j.tecla('Backspace', 'Backspace');
escribe(j, 'TIE');
j.tecla('Enter', 'Enter');
t = guardada(j);
comprobar(t[7].nombre === 'P6' && t[8].nombre === 'TIE', 'a igualdad de puntos, la entrada nueva va detrás de la que estaba');

// A dos no se abre el hall of fame.
j = cargar([]);
p = j.KF.partida; s = j.KF.salonFama;
j.KF.companero = {};
acabarPartida(j, 3, 5000);
comprobar(p.estado === 'inicio' && s.fase === null, "a dos, de 'GAME OVER' se vuelve a 'START GAME' sin hall of fame");

// Lo guardado sin sentido se ignora.
j = cargar([[CLAVE, JSON.stringify([{ nombre: 'ok', oleada: 2, puntos: 300 }, { nombre: 3, oleada: 1, puntos: 5 }, { nombre: 'x', oleada: 0, puntos: 9 }, null, { nombre: 'neg', oleada: 1, puntos: -4 }])]]);
let l = j.KF.salonFama.lista();
comprobar(l.length === 1 && l[0].nombre === 'OK' && l[0].puntos === 300, 'las entradas guardadas sin sentido deben ignorarse');
j = cargar([[CLAVE, 'no es json']]);
comprobar(j.KF.salonFama.lista().length === 0, 'una tabla guardada rota debe ignorarse');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log("Hall of fame correcto: pide el nombre al entrar en el top 10, lo guarda y muestra la tabla.");
