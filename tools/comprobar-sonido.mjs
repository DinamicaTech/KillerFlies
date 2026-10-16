// Comprueba los ajustes de sonido (sonido/ajustes-sonido) sin navegador: carga
// js/sonido.js y js/pausa.js con el resto del juego y Web Audio simulados y
// mira que la música y los demás sonidos van por ganancias separadas, que el
// menú de pausa cambia cada volumen con Enter y con las flechas, que tocar
// fuera de las opciones continúa y que los volúmenes se recuerdan.
// Uso: node tools/comprobar-sonido.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const errores = [];
const comprobar = (cond, texto) => { if (!cond) errores.push(texto); };
const nada = () => {};

// Web Audio simulado: cada nodo recuerda a qué está conectado.
class Nodo { constructor() { this.destino = null; } connect(d) { this.destino = d; } }
class Contexto {
  constructor() { this.destination = new Nodo(); this.state = 'running'; this.currentTime = 0; this.fuentes = []; }
  createGain() { const g = new Nodo(); g.gain = { value: 1, setTargetAtTime(v) { this.value = v; } }; return g; }
  createBufferSource() {
    const f = new Nodo();
    f.playbackRate = { setTargetAtTime: nada };
    f.start = nada; f.stop = nada;
    this.fuentes.push(f);
    return f;
  }
  decodeAudioData(datos, bien) { bien({ sampleRate: 1, getChannelData: () => [1, 1] }); }
  suspend() {} resume() {}
}

function cargar(guardado) {
  const almacen = new Map(guardado);
  const oyentes = {};
  const KF = {
    ANCHO: 224, ALTO: 288,
    SONIDOS_MP3: { 'disparo': '', 'musica-fondo': '', 'inicio-oleada': '', 'ataque': '' },
    graficos: { FUENTE_ALTO: 7, crearFuente: () => ({}) },
    enemigos: { alDestruir: nada },
    registrar: nada,
    alPulsarCorto: (f) => { oyentes.toque = f; },
    tactil: {}, inclinacion: { calibrar: nada },
    partida: { estado: 'jugando', empezar() { this.empezada = true; } },
    red: { activa: () => false, fase: '', enviarYa: nada, cerrar: nada },
    jugador: { numero: 1 },
    ultimoToque: null
  };
  const ventana = {
    AudioContext: Contexto,
    addEventListener: (tipo, f) => { (oyentes[tipo] = oyentes[tipo] || []).push(f); },
    localStorage: { getItem: (k) => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, v) }
  };
  const documento = { hidden: false, addEventListener: nada };
  const ctx = vm.createContext({ KF, window: ventana, document: documento, navigator: {}, atob: (t) => t, Uint8Array, Math, Object, String, parseInt });
  for (const f of ['js/sonido.js', 'js/pausa.js']) {
    vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: f });
  }
  const tecla = (code) => {
    for (const f of oyentes.keydown) f({ code, repeat: false });
    for (const f of oyentes.keyup || []) f({ code });
  };
  return { KF, almacen, oyentes, tecla };
}

// Sin nada guardado, todo al 100%, con la música y los sonidos separados.
let { KF, almacen, oyentes, tecla } = cargar([]);
const s = KF.sonido, z = KF.pausa;
comprobar(s.textoVolumen('musica') === '100%' && s.textoVolumen('sonidos') === '100%', 'sin nada guardado los volúmenes deben estar al 100%');
comprobar(s.salidas.musica.destino === s.salida && s.salidas.sonidos.destino === s.salida, 'las dos ganancias deben ir a la general');
const salidaDe = (nombre) => { const f = s.tocar(nombre); return f.destino.destino; };
comprobar(salidaDe('musica-fondo') === s.salidas.musica, 'la música de fondo debe ir por la ganancia de la música');
comprobar(salidaDe('inicio-oleada') === s.salidas.musica, 'la música de inicio de oleada debe ir por la ganancia de la música');
comprobar(salidaDe('disparo') === s.salidas.sonidos, 'el disparo debe ir por la ganancia de los sonidos');
comprobar(s.ataque && s.ataque.ganancia.destino === s.salidas.sonidos, 'el sonido de ataque debe ir por la ganancia de los sonidos');

// El menú de pausa: cuatro opciones con los volúmenes.
z.pausar();
comprobar(z.activa && z.opcion === 0, 'P debe pausar con CONTINUE marcada');
const textos = () => z.OPCIONES.map((o, i) => z.textoOpcion(i)).join(' / ');
comprobar(textos() === 'CONTINUE / MUSIC 100% / SOUNDS 100% / RESTART', 'el menú debe ser CONTINUE, MUSIC 100%, SOUNDS 100% y RESTART, no ' + textos());

// Enter sobre MUSIC baja un paso cada vez, sin reanudar, y de OFF vuelve a 100%.
tecla('ArrowDown');
comprobar(z.opcion === 1, 'la flecha abajo debe marcar MUSIC');
const vistos = [];
for (let i = 0; i < 5; i++) { tecla('Enter'); vistos.push(s.textoVolumen('musica')); }
comprobar(vistos.join(' ') === '75% 50% 25% OFF 100%', 'Enter en MUSIC debe pasar por 75% 50% 25% OFF 100%, no ' + vistos.join(' '));
comprobar(z.activa, 'cambiar el volumen no debe reanudar la partida');
comprobar(s.textoVolumen('sonidos') === '100%', 'cambiar la música no debe tocar los sonidos');

// Las flechas izquierda y derecha bajan y suben, sin dar la vuelta.
tecla('ArrowDown');
comprobar(z.opcion === 2, 'la flecha abajo debe marcar SOUNDS');
tecla('ArrowRight');
comprobar(s.textoVolumen('sonidos') === '100%', 'la flecha derecha al 100% debe quedarse en 100%');
for (let i = 0; i < 6; i++) tecla('ArrowLeft');
comprobar(s.textoVolumen('sonidos') === 'OFF' && s.salidas.sonidos.gain.value === 0, 'la flecha izquierda debe bajar los sonidos hasta OFF y quedarse');
tecla('ArrowRight');
comprobar(s.textoVolumen('sonidos') === '25%' && s.salidas.sonidos.gain.value === 0.25, 'la flecha derecha debe subir los sonidos a 25%');
comprobar(s.salidas.musica.gain.value === 1, 'cambiar los sonidos no debe tocar la música');
comprobar(almacen.get('killerflies.sonidos') === '25' && almacen.get('killerflies.musica') === '100', 'los volúmenes deben guardarse en el navegador');

// La flecha arriba vuelve atrás, y abajo desde RESTART da la vuelta a CONTINUE.
tecla('ArrowUp');
comprobar(z.opcion === 1, 'la flecha arriba debe volver a MUSIC');
tecla('ArrowDown'); tecla('ArrowDown'); tecla('ArrowDown');
comprobar(z.opcion === 0, 'la flecha abajo desde RESTART debe volver a CONTINUE');

// En la pantalla táctil, tocar MUSIC la baja y tocar fuera continúa.
const toque = (p) => { KF.ultimoToque = p; oyentes.toque(); };
toque({ x: 112, y: z.alturaOpcion(1) + 3 });
comprobar(s.textoVolumen('musica') === '75%' && z.activa, 'tocar MUSIC debe bajarla a 75% sin reanudar');
toque({ x: 112, y: 20 });
comprobar(!z.activa, 'tocar fuera de las opciones debe continuar aunque esté marcada MUSIC');

// RESTART sigue empezando una partida nueva, ahora como cuarta opción.
z.pausar();
toque({ x: 112, y: z.alturaOpcion(3) + 3 });
comprobar(KF.partida.empezada && !z.activa, 'tocar RESTART debe empezar una partida nueva');

// Al volver a abrir el juego se recuerdan; un valor raro da 100%.
({ KF } = cargar([['killerflies.musica', '0'], ['killerflies.sonidos', '50']]));
comprobar(KF.sonido.textoVolumen('musica') === 'OFF' && KF.sonido.salidas.musica.gain.value === 0, 'al volver a abrir el juego debe recordar la música en OFF');
comprobar(KF.sonido.textoVolumen('sonidos') === '50%' && KF.sonido.salidas.sonidos.gain.value === 0.5, 'al volver a abrir el juego debe recordar los sonidos al 50%');
({ KF } = cargar([['killerflies.musica', 'XYZ'], ['killerflies.sonidos', '30']]));
comprobar(KF.sonido.textoVolumen('musica') === '100%' && KF.sonido.textoVolumen('sonidos') === '100%', 'un volumen guardado desconocido debe dar 100%');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log('Ajustes de sonido correctos: música y sonidos por separado en el menú de pausa.');
