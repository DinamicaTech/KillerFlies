// Comprueba empezar tras un perfect (partida/empezar-tras-perfect) sin
// navegador: carga js/dificultad.js, js/perfect.js, js/ataque.js y
// js/partida.js con el resto del juego simulado y mira que limpiar una oleada
// sin perder naves guarda la siguiente con sus puntos, por dificultad y solo a
// uno; que perder una nave no la guarda; que el menú muestra '< FROM WAVE n >'
// y empieza desde ahí con 2 naves de recambio, y que se recuerda al volver.
// Uso: node tools/comprobar-perfect.mjs (desde la raíz del repositorio).
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
  const KF = {
    ANCHO: 224, ALTO: 288,
    graficos: { SPRITE_BOMBA: {}, FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada },
    enemigos: { alDestruir: nada },
    registrar: nada,
    formacion: { naves: [], VELOCIDAD_INICIAL: 40, reiniciar(v) { this.velocidad = v; this.naves = [{ viva: true }]; } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { activo: false, hecho: false, quitar: nada, empezar() { this.activo = true; } },
    jefe: { CADA: 3, activo: false, hecho: false, quitar: nada, empezar() { this.activo = true; } },
    powerups: { recogidas: 0 },
    combos: {}, inclinacion: { calibrar: nada },
    red: { activa: () => false, fase: '', cerrar: nada },
    jugador: nave, jugadores: [nave], alPulsarCorto: nada, tactil: {},
    navesVivas: () => [nave].filter((n) => n.estado === 'viva')
  };
  const ventana = {
    addEventListener: nada,
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const ctx = vm.createContext({ KF, window: ventana, Math, JSON, String, parseInt, performance: { now: () => 0 } });
  for (const f of ['js/dificultad.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  return { KF, almacen, nave };
}

// Destruye la última nave de la oleada en curso y deja pasar un fotograma.
const limpiarOleada = (KF) => {
  KF.formacion.naves = [];
  KF.partida.actualizar(0.016);
};

let { KF, almacen, nave } = cargar([]);
let p = KF.partida, pf = KF.perfect;
const NORMAL = 'killerflies.perfect.NORMAL';

// Sin nada guardado no hay línea '< FROM WAVE n >'.
comprobar(!pf.marcado() && pf.texto() === '', 'sin perfects no debe haber línea en el menú');
comprobar(p.filas() === p.opciones().length, 'sin perfects las flechas solo deben recorrer las opciones');

// Perfect en la oleada 1 con 1500 puntos: se guarda la 2 con esos puntos.
p.empezar();
nave.puntos = 1500;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL) || '{}')[2] === 1500, 'un perfect en la oleada 1 debe guardar la 2 con sus puntos');
nave.puntos = 1800;
p.actualizar(0.016);
comprobar(JSON.parse(almacen.get(NORMAL))[2] === 1500, 'el perfect se anota al destruir la última nave, no después');

// Perder una nave durante la oleada: no hay perfect.
p.ponerOleada(2);
nave.estado = 'explotando';
p.actualizar(0.016);
nave.estado = 'viva';
nave.puntos = 4000;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL))[3] === undefined, 'perder una nave en la oleada no debe dar perfect');

// Repetir el perfect: se queda la mejor puntuación.
p.ponerOleada(1);
nave.puntos = 1200;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL))[2] === 1500, 'un perfect con menos puntos no debe sustituir al mejor');
p.ponerOleada(1);
nave.puntos = 2500;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL))[2] === 2500, 'un perfect con más puntos debe sustituir al anterior');

// Perfect en la oleada 3, la de la nave nodriza: cuenta la oleada principal.
p.ponerOleada(3);
nave.puntos = 12340;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL))[4] === 12340, 'un perfect en la oleada 3 debe guardar la 4');

// A dos no se anota nada.
KF.companero = {};
p.ponerOleada(4);
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get(NORMAL))[5] === undefined, 'en la partida a dos no debe haber perfects');
delete KF.companero;

// Menú: la línea marca el de oleada más alta; las flechas lo cambian con ella
// marcada y, si no, cambian la dificultad.
p.irAInicio();
comprobar(pf.texto() === '< FROM WAVE 4 >', 'el menú debe marcar el perfect de oleada más alta');
comprobar(p.filas() === p.opciones().length + 1, 'con perfects las flechas deben llegar a su línea');
p.opcion = p.opciones().length;
comprobar(p.enPerfect(), 'la fila siguiente a la última opción debe ser la línea del perfect');
p.cambiarConFlechas(1);
comprobar(pf.texto() === '< FROM WAVE 2 >' && KF.dificultad.elegido === 1, 'con la línea marcada, la flecha cambia el perfect y no la dificultad');
p.tocarPerfect();
comprobar(pf.texto() === '< FROM WAVE 4 >', 'tocar la línea marcada debe pasar al perfect siguiente');

// Elegirla empieza en la oleada 4 con 12340 puntos y 2 naves de recambio; la
// siguiente vida extra, a los 20.000.
p.elegir();
comprobar(p.estado === 'jugando' && p.oleada === 4, 'debe empezar en la oleada del perfect');
comprobar(nave.puntos === 12340 && nave.recambio === 2, 'debe empezar con los puntos del perfect y 2 naves de recambio');
comprobar(nave.proximaVida === 20000, 'la siguiente vida extra debe llegar en el siguiente múltiplo de 10.000');
comprobar(p.inicio && p.inicio.oleada === 4, 'RESTART debe poder repetir el punto de partida');
p.empezar();
comprobar(p.oleada === 1 && nave.puntos === 0 && p.inicio === null, "'1 PLAYER' debe empezar en la oleada 1 con 0 puntos");

// Por dificultad: HARD no tiene los perfects de NORMAL, y los suyos se guardan aparte.
p.irAInicio();
p.cambiarDificultad(1);
comprobar(!pf.marcado() && p.filas() === p.opciones().length, 'HARD no debe mostrar los perfects de NORMAL');
p.empezar();
nave.puntos = 900;
limpiarOleada(KF);
comprobar(JSON.parse(almacen.get('killerflies.perfect.HARD'))[2] === 900, 'el perfect en HARD debe guardarse para HARD');
comprobar(JSON.parse(almacen.get(NORMAL))[2] === 2500, 'el perfect en HARD no debe tocar los de NORMAL');

// Al volver a abrir el juego se recuerdan; lo que no tenga sentido se ignora.
({ KF } = cargar([[NORMAL, JSON.stringify({ 2: 2500, 4: 12340 })]]));
comprobar(KF.perfect.texto() === '< FROM WAVE 4 >', 'al volver a abrir el juego debe recordar los perfects');
({ KF } = cargar([[NORMAL, '{"1":50,"x":3,"5":"a","6":-1,"3":700}']]));
comprobar(KF.perfect.lista().length === 1 && KF.perfect.texto() === '< FROM WAVE 3 >', 'los valores guardados sin sentido deben ignorarse');
({ KF } = cargar([[NORMAL, 'no es json']]));
comprobar(!KF.perfect.marcado(), 'un valor guardado roto debe ignorarse');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Empezar tras un perfect correcto: se guarda por dificultad y se empieza desde el menú.');
