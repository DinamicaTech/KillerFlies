// Comprueba las monedas y la tienda de mejoras (mejoras) sin navegador: carga
// js/dificultad.js, js/perfect.js, js/ataque.js, js/partida.js, js/monedas.js
// y js/tienda.js con el resto del juego simulado y mira que cada oleada suelta
// solo las monedas que le faltan (5 como mucho, la última del último enemigo),
// que se guardan por dificultad y sobreviven al volver a abrir el juego, que
// la tienda cobra, avisa sin saldo y aplica cada mejora, y que en la partida a
// dos no hay monedas ni mejoras.
// Uso: node tools/comprobar-mejoras.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};
const CLAVE = 'killerflies.cuenta.default';

function cargar(guardado, busqueda) {
  const almacen = new Map(guardado);
  const oyentes = [];
  const nave = {
    estado: 'ausente', x: 112, Y: 264, puntos: 0, recambio: 0, proximaVida: 0, racha: 0, disparos: [],
    retirar() { this.estado = 'ausente'; }, aparecer() { this.estado = 'viva'; },
    caja() { return this.estado === 'viva' ? { x: this.x - 6.5, y: this.Y - 5.5, ancho: 13, alto: 11 } : null; }
  };
  const sprite = { width: 7, height: 7 };
  const KF = {
    ANCHO: 224, ALTO: 288,
    graficos: { SPRITE_BOMBA: {}, SPRITES_MONEDA: [sprite], SPRITE_MONEDA: sprite, SPRITE_TIENDA: sprite, SPRITES_PILOTO: [sprite, sprite],
      FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada, dibujar: nada },
    enemigos: { alDestruir: (f) => oyentes.push(f) },
    registrar: nada,
    formacion: { naves: [], VELOCIDAD_INICIAL: 40,
      reiniciar(v) { this.naves = Array.from({ length: 40 }, (_, i) => ({ i, viva: true })); } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { activo: false, hecho: false, naves: [], quitar: nada, empezar() { this.activo = true; } },
    jefe: { CADA: 3, activo: false, hecho: false, quitar: nada, empezar() { this.activo = true; } },
    powerups: { recogidas: 0, capsulas: [] },
    pausa: { activa: true },
    combos: {}, inclinacion: { calibrar: nada },
    red: { activa: () => false, fase: '', cerrar: nada, invitado: false },
    jugador: nave, jugadores: [nave], alPulsarCorto: nada, tactil: {},
    Nave: { prototype: { Y: 264 } },
    nuevoId: (() => { let n = 0; return () => ++n; })(),
    navesVivas: () => [nave].filter((n) => n.estado === 'viva')
  };
  const alCargar = [];
  const ventana = {
    addEventListener: (tipo, f) => { if (tipo === 'DOMContentLoaded') alCargar.push(f); },
    location: { pathname: '/', search: busqueda || '', hash: '' },
    history: { replaceState(e, t, url) { ventana.direccion = url; } },
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const ctx = vm.createContext({ KF, window: ventana, Math, JSON, String, Array, parseInt, performance: { now: () => 0 } });
  for (const f of ['js/dificultad.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js', 'js/monedas.js', 'js/tienda.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  alCargar.forEach((f) => f());
  // Destruye la nave i de la formación, en (x, y).
  const destruir = (n, x = 50, y = 50) => {
    n.viva = false;
    for (const f of oyentes) f(n, 'disparo', nave, x, y);
  };
  return { KF, almacen, nave, destruir, ventana };
}

// Destruye todas las naves de la oleada en curso y devuelve las monedas que
// cayeron, con el número de enemigo destruido que soltó cada una.
function limpiar(KF, destruir) {
  const m = KF.monedas, soltadas = [];
  KF.formacion.naves.forEach((n, i) => {
    const antes = m.monedas.length;
    destruir(n);
    if (m.monedas.length > antes) soltadas.push(i + 1);
  });
  return soltadas;
}

// Recoge (o deja escapar) las monedas que estén cayendo.
function caer(KF, nave, recoger) {
  for (const mo of KF.monedas.monedas) { mo.x = recoger ? nave.x : 10; mo.y = recoger ? nave.Y : KF.ALTO + 20; }
  KF.monedas.actualizar(0.001);
}

let { KF, almacen, nave, destruir } = cargar([]);
let m = KF.monedas, t = KF.tienda, p = KF.partida;

// Oleada 1 sin nada recogido: caen 5 monedas y la última es del último enemigo.
p.empezar();
m.actualizar(0);
let soltadas = limpiar(KF, destruir);
comprobar(soltadas.length === 5, 'la oleada 1 debe soltar 5 monedas, no ' + soltadas.length);
comprobar(soltadas[soltadas.length - 1] === 40, 'la última moneda debe caer del último enemigo');
comprobar(m.monedas.every((mo) => mo.oleada === 1), 'las monedas deben ser de la oleada 1');

// Se recogen 4 y una se escapa: saldo 4, y la oleada 1 solo ofrece la que falta.
const escapada = m.monedas.pop();
caer(KF, nave, true);
m.monedas.push(escapada);
caer(KF, nave, false);
comprobar(m.saldo() === 4 && m.faltan(1) === 1, 'tras recoger 4 debe haber 4 monedas y faltar 1 en la oleada 1');
comprobar(m.monedas.length === 0, 'la moneda que se escapa por abajo debe desaparecer');
comprobar(JSON.parse(almacen.get(CLAVE)).NORMAL.oleadas[1] === 4, 'lo recogido debe guardarse en el navegador al momento');
comprobar(m.recogidas === 4, 'cada moneda recogida debe contar para su sonido');

p.empezar();
m.actualizar(0);
soltadas = limpiar(KF, destruir);
comprobar(soltadas.length === 1 && soltadas[0] === 40, 'con 4 recogidas, la oleada 1 debe soltar solo una, del último enemigo');
caer(KF, nave, true);
p.empezar();
m.actualizar(0);
comprobar(limpiar(KF, destruir).length === 0, 'una oleada con sus 5 monedas recogidas no debe soltar más');
comprobar(m.saldo() === 5, 'el saldo debe ser 5');

// Oleada 2, aparte de la 1.
p.ponerOleada(2);
m.actualizar(0);
comprobar(limpiar(KF, destruir).length === 5, 'la oleada 2 debe tener sus propias 5 monedas');
caer(KF, nave, true);
comprobar(m.saldo() === 10, 'el saldo debe sumar las monedas de cada oleada');

// La oleada desafío y la nave nodriza no sueltan monedas (no son de la formación).
p.ponerOleada(3);
m.actualizar(0);
const antes = m.monedas.length;
destruir({ tipo: 'nodriza', viva: true });
comprobar(m.monedas.length === antes, 'la nave nodriza y el desafío no deben soltar monedas');

// La tienda: comprar SPEED cobra 5 y sube la velocidad un 5%.
t.abrir();
t.fase = 'lista';
t.opcion = 0;
t.elegir();
comprobar(m.saldo() === 5 && t.nivel('SPEED') === 1, 'comprar SPEED debe costar 5 y subirla a nivel 1');
comprobar(Math.abs(t.factorVelocidad() - 1.05) < 1e-9, 'SPEED nivel 1 debe dar +5% de velocidad');
t.elegir();
comprobar(m.saldo() === 0 && Math.abs(t.factorVelocidad() - 1.10) < 1e-9, 'SPEED es acumulable: nivel 2, +10%');
t.elegir();
comprobar(t.nivel('SPEED') === 2 && t.aviso === 'NEED 5 MORE COINS', 'sin saldo no debe comprar y debe decir cuántas faltan');

// Las demás mejoras.
const d = m.delNivel();
d.saldo = 100;
const comprar = (id) => { t.opcion = t.MEJORAS.findIndex((x) => x.id === id); t.elegir(); };
comprar('FIRE');
comprobar(Math.abs(t.factorDisparo() - 1.05) < 1e-9, 'FIRE nivel 1 debe dar +5% de velocidad de disparo');
comprar('BOMBS'); comprar('BOMBS');
comprobar(Math.abs(t.factorBombas() - 0.9025) < 1e-9, 'BOMBS nivel 2 debe dejar las bombas al 95% del 95%');
comprar('MAGNET');
comprar('MAGNET');
comprobar(t.nivel('MAGNET') === 1 && t.aviso === 'ALREADY OWNED', 'MAGNET solo se compra una vez');
comprar('RED SLOW');
comprobar(t.nivel('RED SLOW') === 1, 'RED SLOW debe poder comprarse');
comprar('SHIPS');
comprobar(t.aviso === 'FROM NEXT GAME', 'SHIPS debe avisar de que vale desde la partida siguiente');
p.empezar();
comprobar(nave.recambio === 3, 'con SHIPS nivel 1 debe empezar con 3 naves de recambio');
for (let i = 0; i < 3; i++) comprar('SHIPS');
p.empezar();
comprobar(nave.recambio === 5 && t.nivel('SHIPS') === 3 && t.aviso === 'ALREADY AT MAX', 'SHIPS no debe pasar del tope de 5 naves de recambio');
comprobar(m.saldo() === 100 - 5 - 10 - 10 - 3 - 15 * 3, 'cada compra debe descontar su precio');
// Cada fila tiene su explicación, de una o dos líneas que caben en la pantalla
// y solo con letras de la fuente.
const fuente = readFileSync('js/graficos.js', 'utf8');
for (let i = 0; i <= t.MEJORAS.length; i++) {
  t.opcion = i;
  const lineas = t.explicacion();
  comprobar(lineas.length >= 1 && lineas.length <= 2, 'la fila ' + i + ' debe tener una explicación de una o dos líneas');
  for (const l of lineas) {
    comprobar(l.length * 6 <= KF.ANCHO - 8, 'la explicación "' + l + '" no cabe en la pantalla');
    for (const c of l) comprobar(fuente.includes("'" + c + "': ["), 'la letra "' + c + '" de "' + l + '" no está en la fuente');
  }
}
t.opcion = t.MEJORAS.length;
t.elegir();
comprobar(t.fase === 'vuelta', 'BACK debe devolver el piloto a la nave');

// El imán acerca las monedas y las cápsulas cercanas.
m.actualizar(0);
const capsula = { x: nave.x + 20, y: nave.Y - 30 };
KF.powerups.capsulas = [capsula];
m.monedas = [{ id: 1, x: nave.x - 20, y: nave.Y - 30, t: 0, oleada: 9 }];
m.actualizar(0.1);
comprobar(capsula.x < nave.x + 20 && m.monedas[0].x > nave.x - 20, 'con MAGNET las monedas y cápsulas cercanas deben ir hacia la nave');

// Por dificultad: EASY tiene su saldo y sus mejoras, a cero.
KF.dificultad.nivel = 0;
comprobar(m.saldo() === 0 && t.nivel('SPEED') === 0 && m.faltan(1) === 5, 'EASY no debe tener las monedas ni las mejoras de NORMAL');
KF.dificultad.nivel = 1;

// A dos, ni monedas ni mejoras.
KF.companero = {};
comprobar(t.nivel('SPEED') === 0 && t.factorVelocidad() === 1, 'en la partida a dos las mejoras no deben contar');
p.ponerOleada(4);
m.actualizar(0);
comprobar(limpiar(KF, destruir).length === 0, 'en la partida a dos no deben caer monedas');
delete KF.companero;

// Al volver a abrir el juego se recuerda todo; lo que no tenga sentido se ignora.
const guardado = almacen.get(CLAVE);
({ KF } = cargar([[CLAVE, guardado]]));
comprobar(KF.monedas.saldo() === 27 && KF.tienda.nivel('SPEED') === 2 && KF.monedas.faltan(1) === 0, 'al volver a abrir el juego debe recordar saldo, mejoras y monedas recogidas');
({ KF } = cargar([[CLAVE, '{"NORMAL":{"saldo":-3,"oleadas":{"1":9,"x":2},"mejoras":{"SPEED":"a","FIRE":2}}}']]));
comprobar(KF.monedas.saldo() === 0 && KF.monedas.faltan(1) === 0 && KF.tienda.nivel('SPEED') === 0 && KF.tienda.nivel('FIRE') === 2, 'los valores guardados sin sentido deben ignorarse');
({ KF } = cargar([[CLAVE, 'no es json']]));
comprobar(KF.monedas.saldo() === 0, 'un valor guardado roto debe ignorarse');

// BONUS: sin ella, tras limpiar una oleada llega la siguiente, sin desafío;
// con ella, sale el desafío.
({ KF, almacen, nave, destruir } = cargar([]));
m = KF.monedas; t = KF.tienda; p = KF.partida;
const limpiarYEsperar = () => {
  KF.formacion.naves.forEach((n) => { n.viva = false; });
  for (let i = 0; i < 4; i++) p.actualizar(0.6);
};
p.empezar();
limpiarYEsperar();
comprobar(!KF.desafio.activo && p.oleada === 2, 'sin BONUS no debe haber desafío: tras la oleada 1 llega la 2');
m.delNivel().saldo = 10;
t.abrir(); t.fase = 'lista';
t.opcion = t.MEJORAS.findIndex((x) => x.id === 'BONUS');
t.elegir();
comprobar(t.nivel('BONUS') === 1 && m.saldo() === 0, 'BONUS debe costar 10');
limpiarYEsperar();
comprobar(KF.desafio.activo, 'con BONUS debe salir el desafío tras la oleada');
KF.desafio.activo = false;
KF.companero = {};
p.ponerOleada(4);
KF.tienda.nivel = () => 0;
comprobar(p.conDesafio(), 'en la partida a dos el desafío sale siempre');
delete KF.companero;

// Monedas del desafío: una por grupo destruido entero, hasta 4, y una sola vez.
({ KF, almacen, nave, destruir } = cargar([]));
m = KF.monedas; p = KF.partida;
p.empezar();
m.actualizar(0);
const desafio = (KF.desafio.naves = []);
for (let g = 0; g < 4; g++) for (let k = 0; k < 6; k++) desafio.push({ grupo: g, viva: true });
KF.desafio.activo = true;
const antesDesafio = m.monedas.length;
desafio.filter((n) => n.grupo === 0).slice(0, 5).forEach((n) => destruir(n));
comprobar(m.monedas.length === antesDesafio, 'un grupo del desafío a medias no debe soltar moneda');
destruir(desafio[5]);
comprobar(m.monedas.length === antesDesafio + 1 && m.monedas[m.monedas.length - 1].desafio, 'el grupo destruido entero debe soltar una moneda del desafío');
desafio.slice(6, 12).forEach((n) => destruir(n));
m.monedas = m.monedas.filter((mo) => mo.desafio);
caer(KF, nave, true);
comprobar(m.faltanDesafio(1) === 2 && m.delNivel().desafios[1] === 2 && m.faltan(1) === 5, 'las monedas del desafío deben contar aparte de las de la oleada');
KF.desafio.naves = [];
const otra = (KF.desafio.naves = []);
for (let g = 0; g < 4; g++) for (let k = 0; k < 6; k++) otra.push({ grupo: g, viva: true });
otra.forEach((n) => destruir(n));
comprobar(m.monedas.filter((mo) => mo.desafio).length === 2, 'repetir el desafío de la oleada 1 solo debe soltar las 2 monedas que faltan');

// La lista de la tienda se desplaza: se ven 8 filas y la marca siempre se ve.
t = KF.tienda;
t.abrir(); t.fase = 'lista';
comprobar(t.filas() > t.VISIBLES && t.hayAbajo() && !t.hayArriba(), 'con más de 8 filas la lista debe poder bajar');
for (let i = 0; i < t.filas() - 1; i++) t.tecla({ code: 'ArrowDown' });
comprobar(t.opcion === t.filas() - 1 && t.primera === t.filas() - t.VISIBLES && t.hayArriba() && !t.hayAbajo(), 'al bajar hasta BACK la lista debe desplazarse para verla');
t.tecla({ code: 'ArrowDown' });
comprobar(t.opcion === 0 && t.primera === 0, 'desde BACK, abajo debe volver a la primera fila');
t.toque({ x: 112, y: t.alturaFlechaAbajo() + 2 });
comprobar(t.primera === 1 && t.opcion === 1, 'tocar la flecha de abajo debe desplazar la lista una fila');

// Skins y cosméticos (mejoras/skins): comprados quedan puestos, su fila los
// quita y los pone, solo hay una skin puesta y se recuerda al volver a abrir.
({ KF, almacen } = cargar([]));
t = KF.tienda; m = KF.monedas;
m.delNivel().saldo = 50;
t.abrir(); t.fase = 'lista';
const elegirId = (id) => { t.opcion = t.MEJORAS.findIndex((x) => x.id === id); t.elegir(); };
const fila = (id) => t.textoMejora(t.mejora(id)).trim();
elegirId('SKIN BLUE');
comprobar(m.saldo() === 40 && t.nivel('SKIN BLUE') === 1 && fila('SKIN BLUE').endsWith('ON'), 'comprar SKIN BLUE debe costar 10 y dejarla puesta');
elegirId('SKIN BLUE');
comprobar(m.saldo() === 40 && t.nivel('SKIN BLUE') === 0 && t.aviso === 'OFF' && fila('SKIN BLUE').endsWith('OFF'), 'elegir una skin comprada debe quitarla sin cobrar');
elegirId('SKIN BLUE');
elegirId('SKIN GOLD');
comprobar(t.nivel('SKIN GOLD') === 1 && t.nivel('SKIN BLUE') === 0, 'poner una skin debe quitar la otra');
elegirId('SKIN BLUE');
comprobar(t.nivel('SKIN GOLD') === 0 && t.nivel('SKIN BLUE') === 1 && m.saldo() === 30, 'volver a poner la primera skin debe quitar la segunda sin cobrar');
elegirId('TRAIL'); elegirId('STARS'); elegirId('STARS');
comprobar(t.nivel('TRAIL') === 1 && t.nivel('STARS') === 0 && t.nivel('SKIN BLUE') === 1 && m.saldo() === 20, 'los cosméticos se ponen y se quitan sin tocar la skin');
t.opcion = t.MEJORAS.findIndex((x) => x.id === 'STARS');
comprobar(t.explicacion()[1] === t.TEXTO_QUITADO, 'la explicación de un cosmético quitado debe decir cómo ponerlo');
m.delNivel().saldo = 30;
elegirId('YELLOW'); elegirId('YELLOW'); elegirId('KEEP POWER');
comprobar(t.nivel('YELLOW') === 2 && t.nivel('KEEP POWER') === 1 && m.saldo() === 5, 'YELLOW es acumulable y KEEP POWER se compra una vez');
let regalo = cargar([[CLAVE, almacen.get(CLAVE)]]);
comprobar(regalo.KF.tienda.nivel('SKIN BLUE') === 1 && regalo.KF.tienda.nivel('SKIN GOLD') === 0 && regalo.KF.tienda.nivel('STARS') === 0 && regalo.KF.tienda.nivel('TRAIL') === 1, 'al volver a abrir el juego debe recordar qué skins y cosméticos están puestos');
KF.companero = {};
comprobar(t.nivel('SKIN BLUE') === 0 && t.nivel('TRAIL') === 0, 'en la partida a dos no debe haber skins ni cosméticos');
delete KF.companero;

// Puerta trasera de pruebas: ?monedas=N suma N a cada dificultad y se quita de la dirección.
regalo = cargar([[CLAVE, '{"NORMAL":{"saldo":3}}']], '?room=ABCD&monedas=100');
comprobar(regalo.KF.monedas.saldo(0) === 100 && regalo.KF.monedas.saldo(1) === 103 && regalo.KF.monedas.saldo(2) === 100, '?monedas=100 debe sumar 100 monedas a cada dificultad');
comprobar(JSON.parse(regalo.almacen.get(CLAVE)).HARD.saldo === 100, 'las monedas regaladas deben quedar guardadas');
comprobar(regalo.ventana.direccion === '/?room=ABCD', 'el parámetro monedas debe quitarse de la dirección');
regalo = cargar([], '?monedas=abc');
comprobar(regalo.KF.monedas.saldo(1) === 0 && !regalo.ventana.direccion, 'un ?monedas no numérico no debe hacer nada');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Monedas y tienda correctas: 5 por oleada, guardadas por dificultad, mejoras aplicadas.');
