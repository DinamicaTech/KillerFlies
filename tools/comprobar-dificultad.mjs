// Comprueba los niveles de dificultad (partida/dificultad) sin navegador:
// carga js/dificultad.js, js/perfect.js, js/ataque.js y js/partida.js con el resto del juego
// simulado y mira que NORMAL deja el juego como estaba, que EASY va un 25% más
// lento y HARD un 25% más rápido (formación, picados y bombas), los atacantes a
// la vez y la pausa entre ataques, y que el nivel elegido se recuerda.
// Uso: node tools/comprobar-dificultad.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const cerca = (a, b) => Math.abs(a - b) < 1e-9;
const nada = () => {};

// Un juego simulado, con el almacenamiento del navegador en memoria.
function cargar(guardado) {
  const almacen = new Map(guardado);
  const KF = {
    ANCHO: 224, ALTO: 288,
    graficos: { SPRITE_BOMBA: {}, FUENTE_ALTO: 7, crearFuente: () => ({}), anchoTexto: () => 0, escribir: nada },
    enemigos: { alDestruir: nada },
    registrar: nada,
    formacion: { naves: [], VELOCIDAD_INICIAL: 40, reiniciar(v) { this.velocidad = v; } },
    marcador: { ponerOleada: nada, cambiarModo: nada },
    desafio: { quitar: nada }, jefe: { quitar: nada },
    combos: {}, tienda: { nivel: () => 0 }, inclinacion: { calibrar: nada },
    red: { activa: () => false, fase: '', cerrar: nada },
    jugadores: [], alPulsarCorto: nada, tactil: {}
  };
  const ventana = {
    addEventListener: nada,
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const ctx = vm.createContext({ KF, window: ventana, Math, performance: { now: () => 0 } });
  for (const f of ['js/dificultad.js', 'js/perfiles.js', 'js/perfect.js', 'js/ataque.js', 'js/partida.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  return { KF, almacen };
}

// Sin nada guardado, NORMAL, y el juego como antes de los niveles.
let { KF, almacen } = cargar([]);
const d = KF.dificultad, p = KF.partida, a = KF.ataque;
comprobar(d.NIVELES[d.elegido] === 'NORMAL', 'sin nada guardado el nivel debe ser NORMAL');
comprobar(d.texto() === '< NORMAL >', 'la línea del menú debe decir < NORMAL >');

const medir = (nivel, oleada) => {
  d.nivel = nivel;
  p.ponerOleada(oleada);
  const azar = Math.random;
  Math.random = () => 0.5;
  const pausa = a.pausa();
  Math.random = azar;
  return { velocidad: KF.formacion.velocidad, factor: a.factorVelocidad, ataques: a.maximoAtaques(), pausa };
};
for (const oleada of [1, 4, 8]) {
  const base = Math.pow(1.05, oleada - 1);
  const pausaAntes = (1.5 + 0.5 * 1.5) / (1 + 0.1 * (oleada - 1));
  const ataquesAntes = Math.min(1 + oleada, 6);
  const n = medir(1, oleada), e = medir(0, oleada), h = medir(2, oleada);
  comprobar(cerca(n.factor, base) && cerca(n.velocidad, 40 * base), `NORMAL, oleada ${oleada}: la velocidad debe ser la de siempre`);
  comprobar(n.ataques === ataquesAntes && cerca(n.pausa, pausaAntes), `NORMAL, oleada ${oleada}: los ataques deben ser los de siempre`);
  comprobar(cerca(e.factor, base * 0.75) && cerca(e.velocidad, 40 * base * 0.75), `EASY, oleada ${oleada}: debe ir un 25% más lento`);
  comprobar(cerca(h.factor, base * 1.25) && cerca(h.velocidad, 40 * base * 1.25), `HARD, oleada ${oleada}: debe ir un 25% más rápido`);
  comprobar(e.ataques === Math.max(1, ataquesAntes - 1) && h.ataques === ataquesAntes + 1, `oleada ${oleada}: EASY un atacante menos y HARD uno más`);
  comprobar(e.pausa > n.pausa && h.pausa < n.pausa, `oleada ${oleada}: ataques más espaciados en EASY y más seguidos en HARD`);
}

// Cambiar el nivel en el menú da la vuelta, lo aplica a la formación de detrás
// y lo guarda; empezar la partida usa el elegido.
p.irAInicio();
p.cambiarDificultad(1);
comprobar(d.NIVELES[d.elegido] === 'HARD' && d.nivel === 2, 'derecha desde NORMAL debe pasar a HARD');
comprobar(cerca(KF.formacion.velocidad, 40 * 1.25), 'la formación del menú debe ir a la velocidad de HARD');
p.cambiarDificultad(1);
comprobar(d.NIVELES[d.elegido] === 'EASY', 'derecha desde HARD debe dar la vuelta a EASY');
p.cambiarDificultad(-1);
comprobar(d.NIVELES[d.elegido] === 'HARD', 'izquierda desde EASY debe dar la vuelta a HARD');
comprobar(almacen.get('killerflies.dificultad') === 'HARD', 'el nivel elegido debe guardarse en el navegador');
d.nivel = 1;
p.empezar();
comprobar(d.nivel === 2 && cerca(a.factorVelocidad, 1.25), 'la partida debe empezar con el nivel elegido');

// Al volver a abrir el juego se recuerda el nivel; un valor raro da NORMAL.
({ KF } = cargar([['killerflies.dificultad', 'EASY']]));
comprobar(KF.dificultad.NIVELES[KF.dificultad.elegido] === 'EASY', 'al volver a abrir el juego debe recordar EASY');
({ KF } = cargar([['killerflies.dificultad', 'XYZ']]));
comprobar(KF.dificultad.NIVELES[KF.dificultad.elegido] === 'NORMAL', 'un nivel guardado desconocido debe dar NORMAL');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Niveles de dificultad correctos: EASY, NORMAL y HARD.');
