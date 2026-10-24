// Comprueba las monedas y las mejoras en la partida a dos (mejoras/dos-jugadores)
// sin navegador: carga dos veces js/dificultad.js, js/perfiles.js,
// js/perfect.js, js/ataque.js, js/partida.js, js/monedas.js, js/tienda.js y
// js/red.js, una para el anfitrión y otra para el invitado, con el resto del
// juego simulado, y les pasa los mensajes del uno al otro. Mira que cada
// jugador recibe solo las monedas que le faltan, que no puede coger las del
// otro, que el invitado guarda las suyas en su perfil, que las mejoras de
// cada nave son las de su jugador y que BOMBS, YELLOW y ESCORT usan la media.
// Uso: node tools/comprobar-dos-jugadores.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};
const CLAVE = 'killerflies.cuenta.default';
const reloj = { t: 1000 };   // milisegundos, el mismo para los dos dispositivos

// Un dispositivo con lo guardado en su navegador.
function cargar(guardado) {
  const almacen = new Map(guardado);
  const oyentes = [];
  const proto = {
    Y: 264, OPACIDAD_FANTASMA: 0.4, DURACION_DESTELLO: 0.06,
    caja() { return this.estado === 'viva' ? { x: this.x - 6.5, y: this.Y - 5.5, ancho: 13, alto: 11 } : null; },
    retirar() { this.estado = 'ausente'; this.blindaje = false; this.apoyos = []; },
    aparecer() { this.estado = 'viva'; },
    explotar() { this.estado = 'explotando'; }
  };
  const Nave = function (numero) {
    Object.assign(this, { numero, x: 112, vx: 0, estado: 'ausente', escudo: 0, poder: null, recambio: 0, puntos: 0, salvas: 0,
      disparos: [], racha: 0, capsulas: 0, blindaje: false, apoyos: [], peticiones: 0, remoto: false, proximaVida: 0 });
  };
  Nave.prototype = proto;
  const sprite = { width: 7, height: 7 };
  const KF = {
    ANCHO: 224, ALTO: 288,
    graficos: { SPRITE_BOMBA: {}, SPRITES_MONEDA: [sprite], SPRITE_MONEDA: sprite, SPRITE_TIENDA: sprite, SPRITES_PILOTO: [sprite, sprite],
      FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada, dibujar: nada },
    enemigos: { alDestruir: (f) => oyentes.push(f), destruir: (n) => { n.viva = false; } },
    registrar: nada,
    formacion: { naves: [], x: 0, VELOCIDAD_INICIAL: 40, posicionHueco: () => ({ x: 50, y: 50 }),
      reiniciar() { this.naves = Array.from({ length: 40 }, (_, i) => ({ i, viva: true, enFormacion: true })); } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { activo: false, hecho: false, naves: [], quitar: nada, empezar() { this.activo = true; }, foto: () => null, aplicarCambios: nada },
    jefe: { CADA: 3, activo: false, hecho: false, quitar: nada, empezar() { this.activo = true; }, foto: () => null, aplicarCambios: nada },
    powerups: { recogidas: 0, capsulas: [], ondas: [], PODERES: ['triple', 'profundo', 'bomba', 'aniquilacion', 'lento', 'acelerado', 'vida'] },
    pausa: { activa: false, quien: 0, version: 0, recibir: nada },
    combos: { flotantes: [] }, inclinacion: { calibrar: nada },
    alPulsarCorto: nada, tactil: {},
    Nave,
    nuevoId: (() => { let n = 0; return () => ++n; })()
  };
  KF.jugador = new Nave(1);
  KF.jugadores = [KF.jugador];
  KF.companero = null;
  KF.navesVivas = () => KF.jugadores.filter((n) => n.estado === 'viva');
  const ventana = {
    addEventListener: nada,
    location: { pathname: '/', search: '', hash: '' },
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const ctx = vm.createContext({
    KF, window: ventana, Math, JSON, String, Array, parseInt,
    location: { search: '', origin: 'http://x', pathname: '/' }, history: {}, document: { hidden: false },
    setInterval: nada, performance: { now: () => reloj.t }
  });
  for (const f of ['js/dificultad.js', 'js/perfiles.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js', 'js/monedas.js', 'js/tienda.js', 'js/red.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  const buzon = [];
  KF.red.conexion = { open: true, send: (m) => buzon.push(JSON.parse(JSON.stringify(m))) };
  const destruir = (n, x = 50, y = 50) => {
    n.viva = false;
    for (const f of oyentes) f(n, 'disparo', KF.jugador, x, y);
  };
  return { KF, almacen, buzon, destruir };
}

// Anfitrión, con NORMAL: SPEED 2, BOMBS 2, YELLOW 1, ESCORT, BONUS y la skin
// dorada; ya tiene 3 monedas de la oleada 1.
const anfitrion = cargar([[CLAVE, JSON.stringify({ NORMAL: { saldo: 0, oleadas: { 1: 3 },
  mejoras: { SPEED: 2, BOMBS: 2, YELLOW: 1, ESCORT: 1, BONUS: 1, 'SKIN GOLD': 1 } } })]]);
// Invitado, que tiene marcada EASY: en NORMAL, FIRE 3, SHIELD, WINGMAN 2,
// BOMBS 1, YELLOW 4, RED SLOW y la skin azul, sin monedas de la oleada 1.
const invitado = cargar([[CLAVE, JSON.stringify({ NORMAL: { saldo: 0,
  mejoras: { FIRE: 3, SHIELD: 1, WINGMAN: 2, BOMBS: 1, YELLOW: 4, 'RED SLOW': 1, 'SKIN BLUE': 1 } } })]]);
const A = anfitrion.KF, I = invitado.KF;

// Se conectan como en js/red.js: el anfitrión empieza la partida en NORMAL.
A.red.anfitrion = true; A.red.fase = 'jugando'; A.red.entradas = new A.Muestras(); A.red.partidaNumero = 1;
A.tienda.otro = {}; A.monedas.empezarDos();
A.companero = new A.Nave(2); A.companero.remoto = true;
A.jugadores = [A.jugador, A.companero];
A.dificultad.elegido = 1;
A.partida.empezar();
I.red.invitado = true; I.red.fase = 'jugando'; I.red.fotos = []; I.red.fotoAplicada = null; I.red.desfase = null;
I.tienda.otro = {}; I.monedas.empezarDos();
I.companero = new I.Nave(1); I.companero.remoto = true;
I.jugador = new I.Nave(2);
I.jugadores = [I.companero, I.jugador];
I.dificultad.elegido = I.dificultad.nivel = 0;

// Una vuelta de mensajes: la foto del anfitrión llega al invitado y el
// mensaje del invitado, al anfitrión.
const vuelta = () => {
  A.monedas.actualizar(0);
  A.red.enviarYa();
  for (const m of anfitrion.buzon.splice(0)) I.red.recibir(m);
  I.red.aplicarFotos();
  I.red.enviarYa();
  for (const m of invitado.buzon.splice(0)) A.red.recibir(m);
  reloj.t += 100;
};

// El invitado aún no sabe la dificultad: su primer mensaje no lleva mejoras.
I.red.enviarYa();
comprobar(!invitado.buzon[0].u && !invitado.buzon[0].mo, 'el invitado no debe mandar sus mejoras antes de saber la dificultad de la partida');
invitado.buzon.length = 0;
A.monedas.actualizar(0);
comprobar(A.monedas.planes[1] && A.monedas.planes[1].length === 2 && !A.monedas.planes[2], 'el anfitrión debe planificar sus 2 monedas y esperar a saber las del invitado');
vuelta();
comprobar(I.dificultad.nivel === 1, 'el invitado debe jugar en la dificultad del anfitrión');
comprobar(A.monedas.planes[2] && A.monedas.planes[2].length === 5, 'al saber que al invitado le faltan 5, deben caer 5 para él');

// Mejoras de cada nave: cada una las de su jugador.
const t = A.tienda;
comprobar(t.factorVelocidad(A.jugador) === 1.1 && t.factorVelocidad(A.companero) === 1, 'SPEED debe ser de la nave de quien la compró');
comprobar(Math.abs(t.factorDisparo(A.companero) - 1.15) < 1e-9 && t.factorDisparo(A.jugador) === 1, 'FIRE debe ser de la nave de quien la compró');
comprobar(A.companero.blindaje && A.companero.apoyos.length === 2 && !A.jugador.blindaje && A.jugador.apoyos.length === 0,
  'el escudo y las naves de apoyo del invitado deben llegar a su nave en el anfitrión');
comprobar(A.partida.navesAlEmpezar(A.jugador) === 2 && t.nivelDe(A.companero, 'SKIN BLUE') === 1 && I.tienda.nivelDe(I.companero, 'SKIN GOLD') === 1,
  'cada dispositivo debe saber las skins del otro jugador');
// La foto lleva el escudo y las naves de apoyo de cada nave al invitado.
vuelta();
comprobar(I.jugador.blindaje && I.jugador.apoyos.length === 2 && !I.companero.blindaje, 'el invitado debe ver su escudo y sus naves de apoyo');

// BOMBS, YELLOW y ESCORT: la media, redondeando hacia abajo.
comprobar(t.nivelJuego('BOMBS') === 1 && t.nivelJuego('YELLOW') === 2 && t.nivelJuego('ESCORT') === 0, 'BOMBS, YELLOW y ESCORT deben usar la media de los dos');
comprobar(Math.abs(t.factorBombas() - 0.95) < 1e-9, 'las bombas deben ir con la media de BOMBS');

// Se destruye la oleada: 2 monedas para el anfitrión y 5 para el invitado;
// las dos últimas, del último enemigo, una al lado de la otra.
// (El último enemigo, en otro sitio: dos jugadores también pueden compartir
// otro enemigo al azar.)
A.formacion.naves.forEach((n, i, todas) => anfitrion.destruir(n, i === todas.length - 1 ? 150 : 80, 60));
const suyas = (n) => A.monedas.monedas.filter((m) => m.dueno === n);
comprobar(suyas(1).length === 2 && suyas(2).length === 5, 'deben caer 2 monedas para el anfitrión y 5 para el invitado, no ' + suyas(1).length + ' y ' + suyas(2).length);
const ultimas = A.monedas.monedas.filter((m) => m.x > 120);
comprobar(ultimas.length === 2 && ultimas[0].x === 146 && ultimas[1].x === 154, 'las dos monedas del último enemigo deben caer una al lado de la otra');

// El invitado las ve todas, las del anfitrión semitransparentes.
vuelta();
comprobar(I.monedas.monedas.length === 7, 'el invitado debe ver las 7 monedas');
const alfas = [];
I.graficos.dibujar = (c) => alfas.push(c.globalAlpha);
const lienzo = { globalAlpha: 1 };
I.monedas.dibujar(lienzo);
comprobar(alfas.filter((a) => a === 0.4).length === 2 && alfas.filter((a) => a === 1).length === 5, 'en el invitado las monedas del anfitrión deben verse semitransparentes');

// Las monedas del invitado pasan por la nave del anfitrión: no las coge.
A.companero.x = 30;
A.monedas.monedas.forEach((m) => { m.x = A.jugador.x; m.y = A.jugador.Y; });
A.monedas.actualizar(0.001);
comprobar(A.monedas.saldo() === 2 && suyas(2).length === 5 && suyas(1).length === 0, 'el anfitrión debe coger solo sus monedas');
A.monedas.monedas.forEach((m) => { m.x = A.companero.x; m.y = A.companero.Y; });
A.monedas.actualizar(0.001);
comprobar(A.monedas.monedas.length === 0 && A.monedas.saldo() === 2 && A.monedas.entregadas === 5, 'la nave del invitado debe coger sus 5 monedas sin sumarlas al anfitrión');

// El invitado las guarda en su perfil, en NORMAL, una sola vez.
vuelta();
vuelta();
const guardado = JSON.parse(invitado.almacen.get(CLAVE)).NORMAL;
comprobar(I.monedas.saldo(1) === 5 && guardado.saldo === 5 && guardado.oleadas[1] === 5, 'el invitado debe guardar sus 5 monedas en su perfil, no ' + I.monedas.saldo(1));
comprobar(I.monedas.recogidas === 5, 'cada moneda del invitado debe sonar en su dispositivo');
comprobar(A.monedas.invitado[1] === 0, 'el invitado debe decir que ya no le falta ninguna en la oleada 1');

// El desafío: sus monedas solo caen para quien tiene BONUS.
A.desafio.activo = true;
A.desafio.naves = Array.from({ length: 6 }, () => ({ grupo: 0, viva: true }));
A.desafio.naves.forEach((n) => anfitrion.destruir(n));
comprobar(A.monedas.monedas.length === 1 && A.monedas.monedas[0].dueno === 1 && A.monedas.monedas[0].desafio, 'las monedas del desafío deben caer solo para quien tiene BONUS');
A.desafio.activo = false;

// La cápsula del slow fire llega al invitado sabiendo que es la roja.
A.powerups.capsulas = [{ id: 99, x: 50, y: 50, t: 0, poder: 'lento' }];
vuelta();
comprobar(I.powerups.capsulas.length === 1 && I.powerups.capsulas[0].poder === 'lento', 'el invitado debe saber cuál es la cápsula del slow fire, para RED SLOW');

// SHOP en la pausa también a dos.
A.pausa.activa = true;
A.tienda.abrir();
comprobar(A.tienda.abierta(), 'la tienda debe abrirse en la partida a dos');
A.tienda.cerrar();
A.pausa.activa = false;

// El invitado se va: sus monedas desaparecen y el anfitrión sigue a uno.
A.monedas.monedas.push({ id: 100, x: 10, y: 10, t: 0, oleada: 1, dueno: 2 });
A.companero = null;
A.jugadores = [A.jugador];
A.monedas.actualizar(0.001);
comprobar(A.monedas.monedas.every((m) => m.dueno !== 2), 'sin el invitado sus monedas deben desaparecer');
comprobar(t.nivelJuego('BOMBS') === 2 && t.factorVelocidad(A.jugador) === 1.1, 'a uno las mejoras vuelven a ser solo las propias');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Partida a dos correcta: monedas de cada jugador, mejoras por nave y la media de BOMBS, YELLOW y ESCORT.');
