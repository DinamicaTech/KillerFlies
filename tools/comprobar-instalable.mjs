// Comprueba la app instalable (architecture/app-instalable): que sw.js guarda
// para jugar sin conexión cada fichero que carga index.html (scripts, manifiesto
// e iconos) y los iconos del manifiesto, y que todo lo que guarda existe.
// Uso: node tools/comprobar-instalable.mjs (desde la raíz del repositorio).
// Lo ejecuta el workflow "Pruebas" en cada pull request.
import { readFileSync, existsSync } from 'node:fs';

const errores = [];
const html = readFileSync('index.html', 'utf8');
const sw = readFileSync('sw.js', 'utf8');
const manifiesto = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));

const lista = sw.match(/var ARCHIVOS = \[([\s\S]*?)\];/);
if (!lista) {
  console.error('sw.js: no se encuentra la lista ARCHIVOS');
  process.exit(1);
}
const guardados = [...lista[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const cargados = new Set([
  ...[...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/<link[^>]*\shref="([^"]+)"/g)].map((m) => m[1]),
  ...manifiesto.icons.map((i) => i.src),
  'index.html',
  './'
]);

for (const f of cargados) {
  if (/^[a-z]+:/i.test(f)) continue;   // externo: no se guarda
  if (!guardados.includes(f)) errores.push(`sw.js no guarda ${f}, que carga la página: sin conexión fallaría`);
}
for (const f of guardados) {
  if (f !== './' && !existsSync(f)) errores.push(`sw.js guarda ${f}, que no existe`);
}
if (manifiesto.display !== 'fullscreen') errores.push('manifest.webmanifest: display debe ser fullscreen');
if (!html.includes('js/instalable.js')) errores.push('index.html no carga js/instalable.js, que registra sw.js');

if (errores.length) {
  errores.forEach((e) => console.error('ERROR: ' + e));
  process.exit(1);
}
console.log(`App instalable correcta: ${guardados.length} ficheros guardados para jugar sin conexión.`);
