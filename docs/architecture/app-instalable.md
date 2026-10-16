---
title: Installable app
depends_on: [architecture]
threads:
  - Ideas for improvements | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiWcuv7NRkbfswvJ7tJ1BGE3
  - Installable app | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiTfqa7537QdfD323vsqh6W2
---
## Summary
The game can be installed on the phone's home screen as an app (a PWA): on Android from Chrome's menu ("Install app"), on iPhone from Safari's Share → "Add to Home Screen"; there is no install button inside the game. Its icon is the player's ship on a starry black background. Opened from the icon it runs in full screen and portrait, with no browser bars (on Android with no status bar either; on iPhone the status bar stays, Apple allows no more). The first visit with a connection saves the whole game on the device, so the one-player game, sounds included, is then played offline; the two-player game still needs a connection. With a connection each file is always asked to the server, so the latest published version is played. Opening index.html from disk works as before (no app, no offline copy). On iPhone the installed app keeps its own high scores, apart from Safari's; on Android they are shared. Validated by the owner.

Files: manifest.webmanifest (name, full screen, portrait, icons), sw.js (service worker: saves the game and serves it offline), js/instalable.js (registers sw.js, only over http or https), the icons in assets/iconos (generated from the game's own ship drawing with tools/generar-iconos.html) and the check tools/comprobar-instalable.mjs, run by the "Pruebas" workflow on every pull request, every push to main, weekly and on demand.

Acceptance: on an Android phone, open https://dinamicatech.github.io/KillerFlies/, install it from Chrome's menu, open it from its icon (full screen, portrait, no bars), switch on airplane mode, close and reopen it and play a whole game with sound.

## Decisions
- 2026-10-13 17:06 · Created in the creative lab as an idea to debate, one of nine improvements proposed by Claude and accepted by the owner.
- 2026-10-16 10:35 · Leaves the lab: executed. Moved from creative-lab/app-instalable to architecture/app-instalable, because it is how the game is published and run.
- 2026-10-16 10:35 · It is a PWA: a web manifest (manifest.webmanifest) with display fullscreen, orientation portrait and black background and theme, plus the Apple meta tags in index.html so iPhone opens it without Safari's bars. No install button in the game: it is installed from the browser's menu. Reason: the lightest option; a button would only work on Android.
- 2026-10-16 10:35 · Offline: a service worker (sw.js, scope the whole site) saves on install every file index.html loads (list ARCHIVOS) and then answers network first: it asks the server for each file (revalidating, cache no-cache) and keeps the copy; offline, or if the network does not answer in 4 seconds, it serves the saved copy. Any page address (?sala=… of the two-player game included) is served as index.html. Reason: with a connection the latest published version is always played, so what the owner validates is the latest, and no cache version has to be bumped on each change. The sounds need nothing extra, they are already inside js/sonidos-datos.js.
- 2026-10-16 10:35 · js/instalable.js registers sw.js only over http or https; opening index.html from disk does nothing new.
- 2026-10-16 10:35 · Icons: two PNG files, assets/iconos/icono-192.png and icono-512.png, the first image files of the project; they are the player's ship (KF.graficos.dibujarJugador) inside the central 60 % (so no phone crops it when it rounds the icon) on black with fixed coloured stars, generated with tools/generar-iconos.html. Remake them only if the ship's drawing changes.
- 2026-10-16 10:35 · Regression test: tools/comprobar-instalable.mjs fails if a file loaded by index.html (script, manifest, icon) is missing from sw.js's ARCHIVOS, or if ARCHIVOS names a file that does not exist; the workflow "Pruebas" (.github/workflows/pruebas.yml) runs it. Adding a script to the game means adding it to ARCHIVOS too.
- 2026-10-16 10:35 · Checked by Claude in a headless browser: the 25 files are saved on the first visit, the manifest is read (full screen, 4 icons), the page reloads and the game plays offline (also with ?sala=), a change on the server is played on the next online load, and opening from disk still works with no errors. Installing on a real phone is left to the owner's validation.
- 2026-10-16 10:34 · Validated by the owner on the phone: the node becomes stable.

## Requirements
- 2026-10-13 17:06 · idea: Let the game be installed on the phone's home screen as an app, playable offline and in full screen.
- 2026-10-16 10:20 · Pasamos a desarrollo.
- 2026-10-16 10:24 · Ok!
- 2026-10-16 10:34 · Ok, funciona
