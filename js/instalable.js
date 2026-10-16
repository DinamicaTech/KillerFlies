// App instalable (architecture/app-instalable): registra el service worker
// (sw.js), que guarda el juego en el móvil para jugar sin conexión. Solo
// funciona publicado en la web (https o localhost); abriendo index.html
// desde el disco no hace nada y el juego funciona como siempre.
(function () {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
})();
