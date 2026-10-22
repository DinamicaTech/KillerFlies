// Comprueba los perfiles de jugador (mejoras/cuentas) sin navegador: carga
// js/dificultad.js, js/perfiles.js, js/perfect.js, js/ataque.js,
// js/partida.js, js/monedas.js y js/salon-fama.js con el resto del juego
// simulado y mira que los datos de antes pasan al perfil PLAYER, que la línea
// del perfil del menú cambia de perfil y crea uno nuevo con su nombre, que
// cada perfil tiene sus monedas, sus mejoras y sus perfects, que cada
// dificultad tiene sus perfiles (4 como mucho), que se recuerda el activo y
// que el hall of fame trae escrito su nombre.
// Uso: node tools/comprobar-perfiles.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};

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
    graficos: { SPRITE_BOMBA: {}, SPRITES_MONEDA: [{}], SPRITE_MONEDA: {}, FUENTE_ANCHO: 5, FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada },
    enemigos: { alDestruir: nada }, nuevoId: () => 1,
    registrar: nada,
    formacion: { naves: [], VELOCIDAD_INICIAL: 40, reiniciar() { this.naves = [{ viva: true }]; } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { activo: false, hecho: false, quitar: nada, empezar: nada },
    jefe: { CADA: 3, activo: false, hecho: false, quitar: nada, empezar: nada },
    powerups: { recogidas: 0 },
    combos: {}, tienda: { nivel: () => 0 }, inclinacion: { calibrar: nada },
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
  for (const f of ['js/dificultad.js', 'js/perfiles.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js', 'js/monedas.js', 'js/salon-fama.js']) {
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

// Datos de antes de haber perfiles: son del perfil PLAYER.
let j = cargar([
  ['killerflies.cuenta.default', JSON.stringify({ NORMAL: { saldo: 7, oleadas: {}, desafios: {}, mejoras: { SPEED: 2 } } })],
  ['killerflies.perfect.NORMAL', JSON.stringify({ 3: 1200 })]
]);
let { KF } = j, p = KF.partida, pf = KF.perfiles, m = KF.monedas;
comprobar(pf.texto() === '< PLAYER >' && m.saldo() === 7 && m.delNivel().mejoras.SPEED === 2, 'los datos de antes deben ser del perfil PLAYER');
comprobar(KF.perfect.texto() === '< FROM WAVE 3 >', 'los perfects de antes deben ser del perfil PLAYER');
comprobar(p.filas() === p.opciones().length + 2, 'el menú debe tener la línea del perfil y la del perfect');

// La línea del perfil: la flecha lleva a NEW PROFILE, sin perfects.
p.opcion = p.opciones().length;
comprobar(p.enPerfil(), 'la fila tras la última opción debe ser la del perfil');
j.tecla('ArrowRight', 'ArrowRight');
comprobar(pf.texto() === '< NEW PROFILE >' && !KF.perfect.marcado() && KF.dificultad.elegido === 1, 'la flecha en la línea del perfil debe llevar a NEW PROFILE sin cambiar la dificultad');
j.tecla('ArrowRight', 'ArrowRight');
comprobar(pf.texto() === '< PLAYER >', 'tras NEW PROFILE debe volver al primer perfil');
j.tecla('ArrowLeft', 'ArrowLeft');

// Empezar con NEW PROFILE pide el nombre y crea el perfil, vacío y activo.
j.tecla('Enter', 'Enter');
comprobar(p.estado === 'fama' && KF.salonFama.perfil && KF.salonFama.nombre === '', 'con NEW PROFILE, empezar debe pedir el nombre del perfil');
escribe(j, 'ana');
j.tecla('Enter', 'Enter');
comprobar(p.estado === 'inicio' && pf.texto() === '< ANA >', 'el nombre escrito debe crear el perfil y dejarlo activo');
comprobar(m.saldo() === 0 && !m.delNivel().mejoras.SPEED && !KF.perfect.marcado(), 'un perfil nuevo debe empezar sin monedas, mejoras ni perfects');
m.delNivel().saldo = 3;
m.guardar();
KF.perfect.anotar(1, 4, 800);
comprobar(KF.perfect.texto() === '< FROM WAVE 5 >' && j.almacen.has('killerflies.perfect.NORMAL.1'), 'los perfects del perfil nuevo deben guardarse aparte');

// Volver a PLAYER: sus datos siguen ahí.
p.opcion = p.opciones().length;
p.cambiarConFlechas(-1);
comprobar(pf.texto() === '< PLAYER >' && m.saldo() === 7 && KF.perfect.texto() === '< FROM WAVE 3 >', 'el perfil PLAYER debe conservar sus monedas y sus perfects');
p.cambiarConFlechas(1);
comprobar(pf.texto() === '< ANA >' && m.saldo() === 3, 'el perfil ANA debe conservar sus monedas');

// El hall of fame trae escrito el nombre del perfil.
p.empezar();
j.nave.puntos = 500; j.nave.recambio = 0; j.nave.estado = 'ausente';
p.actualizar(0.016); p.actualizar(p.ESPERA_FIN);
j.tecla('x', 'KeyX');
comprobar(KF.salonFama.fase === 'nombre' && KF.salonFama.nombre === 'ANA', 'el hall of fame debe traer escrito el nombre del perfil');
j.tecla('Enter', 'Enter');
KF.salonFama.actualizar(1);
j.tecla('x', 'KeyX');

// Escape cancela el perfil nuevo.
p.opcion = p.opciones().length;
p.cambiarConFlechas(1);
j.tecla('Enter', 'Enter');
escribe(j, 'X');
j.tecla('Escape', 'Escape');
comprobar(p.estado === 'inicio' && pf.deNivel(1).lista.length === 2 && pf.texto() === '< ANA >', 'Escape debe cancelar el perfil nuevo');

// Cada dificultad tiene sus perfiles.
p.cambiarDificultad(1);
comprobar(pf.texto() === '< PLAYER >' && pf.deNivel(2).lista.length === 1 && m.saldo() === 0, 'HARD debe tener sus propios perfiles');
p.cambiarDificultad(-1);
comprobar(pf.texto() === '< ANA >', 'al volver a NORMAL debe seguir activo su perfil');

// Como mucho 4 por dificultad; sin nombre, 'PLAYER n'.
p.opcion = p.opciones().length;
for (const nombre of ['BEA', '']) { while (!pf.nuevo) p.cambiarConFlechas(1); j.tecla('Enter', 'Enter'); escribe(j, nombre); j.tecla('Enter', 'Enter'); p.opcion = p.opciones().length; }
comprobar(pf.deNivel(1).lista.length === 4 && pf.texto() === '< PLAYER 4 >', 'sin nombre el perfil debe llamarse PLAYER n');
let vistos = new Set();
for (let i = 0; i < 6; i++) { p.cambiarConFlechas(1); vistos.add(pf.texto()); }
comprobar(vistos.size === 4 && !vistos.has('< NEW PROFILE >'), 'con 4 perfiles no debe ofrecerse NEW PROFILE');

// Tocar la línea del perfil la marca y después pasa al siguiente.
p.opcion = 0;
const antes = pf.texto();
j.tocar({ x: 112, y: p.alturaPerfil() + 2 });
comprobar(p.enPerfil() && pf.texto() === antes, 'tocar la línea del perfil debe marcarla');
j.tocar({ x: 112, y: p.alturaPerfil() + 2 });
comprobar(pf.texto() !== antes, 'tocar la línea marcada debe pasar al perfil siguiente');

// Al volver a abrir el juego se recuerdan los perfiles y el activo.
while (pf.texto() !== '< ANA >') p.cambiarConFlechas(1);
j = cargar([...j.almacen]);
({ KF } = j); pf = KF.perfiles; m = KF.monedas;
comprobar(pf.texto() === '< ANA >' && m.saldo() === 3 && pf.deNivel(1).lista.length === 4, 'al volver a abrir el juego deben recordarse los perfiles y el activo');
j = cargar([['killerflies.perfiles', JSON.stringify({ NORMAL: { activo: 9, lista: [{ id: 0, nombre: 'X' }, { id: 2, nombre: 'B' }, { id: 2, nombre: 'C' }, { id: 'a', nombre: 'D' }] } })]]);
pf = j.KF.perfiles;
comprobar(pf.deNivel(1).lista.length === 2 && pf.nombre(1) === 'PLAYER' && pf.deNivel(1).lista[1].nombre === 'B', 'los perfiles guardados sin sentido deben ignorarse');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Perfiles correctos: PLAYER con los datos de antes, nuevos con su nombre, separados por perfil y por dificultad.');
