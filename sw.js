// Service worker de la app instalable (architecture/app-instalable): guarda
// el juego en el móvil para poder jugar sin conexión.
// Con conexión, cada fichero se pide siempre a la red (así se juega la última
// versión publicada) y se guarda la copia; sin conexión, o si la red no
// responde en TIEMPO_RED milisegundos, se usa la copia guardada.
// ARCHIVOS es lo que se guarda al instalarse, para que todo el juego esté
// disponible sin conexión desde la primera visita: debe incluir cada fichero
// que carga index.html (lo comprueba tools/comprobar-instalable.mjs).
var CACHE = 'killerflies';
var TIEMPO_RED = 4000;
var ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/iconos/icono-192.png',
  'assets/iconos/icono-512.png',
  'js/base.js',
  'js/graficos.js',
  'js/enemigos.js',
  'js/formacion.js',
  'js/jugador.js',
  'js/ataque.js',
  'js/powerups.js',
  'js/perfiles.js',
  'js/monedas.js',
  'js/desafio.js',
  'js/jefe.js',
  'js/combos.js',
  'js/marcador.js',
  'js/sonidos-datos.js',
  'js/sonido.js',
  'js/dificultad.js',
  'js/perfect.js',
  'js/partida.js',
  'js/salon-fama.js',
  'js/lib/peerjs.min.js',
  'js/lib/qrcode.js',
  'js/red.js',
  'js/pausa.js',
  'js/tienda.js',
  'js/vibracion.js',
  'js/instalable.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(ARCHIVOS.map(function (a) { return new Request(a, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (e) {
  var peticion = e.request;
  if (peticion.method !== 'GET' || new URL(peticion.url).origin !== self.location.origin) return;
  // La página se abre con distintos parámetros (?sala=… de la partida a dos):
  // todos son la misma index.html.
  var pagina = peticion.mode === 'navigate';
  var clave = pagina ? new URL('index.html', self.registration.scope).href : peticion;
  e.respondWith(caches.open(CACHE).then(function (cache) {
    var guardada = function () {
      return cache.match(clave, { ignoreSearch: true }).then(function (r) {
        return r || Promise.reject(new Error('Sin conexión y sin copia guardada'));
      });
    };
    // Una petición de página no admite opciones: se pide de nuevo por su
    // dirección. no-cache: el navegador comprueba con el servidor que su copia
    // sigue siendo la última.
    var red = fetch(pagina ? peticion.url : peticion, { cache: 'no-cache' }).then(function (r) {
      if (r.ok) cache.put(clave, r.clone());
      return r;
    });
    red.catch(function () {});
    var plazo = new Promise(function (resolver, rechazar) {
      setTimeout(function () { rechazar(new Error('La red no responde')); }, TIEMPO_RED);
    });
    return Promise.race([red, plazo]).catch(function () {
      return guardada().catch(function () { return red; });
    });
  }));
});
