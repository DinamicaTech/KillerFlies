// Mete los sonidos de assets/sonidos/*.mp3 en js/sonidos-datos.js, en base64,
// para que el juego también suene abriendo index.html desde el disco (el
// navegador no deja leer ficheros locales con fetch). Volver a ejecutarlo
// tras cambiar un sonido: node tools/empaquetar-sonidos.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const carpeta = join(raiz, 'assets', 'sonidos');
const lineas = readdirSync(carpeta)
  .filter((f) => f.endsWith('.mp3'))
  .sort()
  .map((f) => `  '${basename(f, '.mp3')}': '${readFileSync(join(carpeta, f)).toString('base64')}'`);

writeFileSync(join(raiz, 'js', 'sonidos-datos.js'),
  '// Generado por tools/empaquetar-sonidos.mjs a partir de assets/sonidos: no editar a mano.\n' +
  'KF.SONIDOS_MP3 = {\n' + lineas.join(',\n') + '\n};\n');
