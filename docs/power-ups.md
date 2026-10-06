---
title: Power-ups
depends_on: [jugador, enemigos, enemigos/formacion, enemigos/ataque, graficos, sonido, partida]
threads:
  - Power-ups | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiY3L86CtecmpR7eakwWMJ1U
  - Real sounds | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiFf1TgQJLpT3XvZn4f9CLXB
---
## Summary
Random power-ups, in js/powerups.js: when a yellow and its two red escorts are destroyed outside the formation, a blinking capsule falls at half the speed of a bomb (the same for every power and worth no points). If the player ship picks it up, it gets a random power, all with the same probability: rapid shot, deep shot, bomb, annihilation (single use), slow fire (a power-down) or triple shot, or else an extra life (one more spare ship, up to 5). It lasts until the end of the wave, a new one replaces the previous one, and it is lost if the ship is destroyed. To test them, Shift+1…7 gives each power from the keyboard. Each pickup, extra life included, is counted in KF.powerups.recogidas so Sound can play its sound.

## Decisions
- 2026-10-04 10:48 · Created in the lab as an idea.
- 2026-10-04 10:48 · The power-up only drops when all three ships (the yellow and its two reds) are destroyed while diving.
- 2026-10-04 10:48 · Annihilation is single use: the next shot destroys all enemy ships and the power ends. The other powers last until the end of the wave.
- 2026-10-04 10:48 · Powers do not stack: the new one replaces the previous one.
- 2026-10-04 10:48 · The power-down cannot be told apart on screen from the power-ups before picking it up.
- 2026-10-04 10:49 · The power is lost if the player ship is destroyed.
- 2026-10-04 10:50 · [replaced by 2026-10-04 11:30] All powers (including the power-down) come up with the same probability.
- 2026-10-04 10:50 · The power-up falls as a blinking capsule, with the same look for every power.
- 2026-10-04 10:50 · With the triple shot, the three projectiles count as a single active shot.
- 2026-10-04 10:50 · Picking up the power-up gives no points.
- 2026-10-04 10:52 · Leaves the lab: implemented, as the top-level node power-ups (formerly creative-lab/power-ups).
- 2026-10-04 10:52 · When it drops: Attack signals (KF.ataque.alDestruirEscolta) when the yellow and its two red escorts are all three destroyed while outside the formation (leaving, diving or returning), by shot or by collision; the capsule appears where the last one falls. A ship that has already returned to its slot does not count, and a yellow with only one red escort drops nothing.
- 2026-10-04 10:52 · [replaced by 2026-10-04 11:24] Capsule: 5×7 pixels, blinks between blue and pink every 0.15 seconds and falls at the speed of the bombs (which rises with the wave). It is picked up on touching the player ship; otherwise it exits at the bottom.
- 2026-10-04 10:52 · [replaced by 2026-10-04 11:30] Powers: rapid, up to three shots on screen; deep, the shot does not stop and destroys every ship it touches; bomb, the shot is an orange diamond that explodes on hitting a ship and destroys the ships wholly or partly inside a circle 55 pixels in diameter (5 ship widths), with an expanding shockwave; annihilation, the next shot fires no projectile, destroys all living ships (in formation and diving) and the power ends; slow fire, the shot rises at 150 pixels per second instead of 300; triple, three parallel projectiles 6 pixels apart that count as a single shot (you cannot fire again until all three are gone).
- 2026-10-04 10:52 · Ships destroyed by the bomb, the annihilation or the deep shot give their points, like any shot.
- 2026-10-04 10:52 · End of the power: it is lost when the player ship explodes and at the start of each wave or game (new formation), along with any capsules that are falling.
- 2026-10-04 11:24 · Capsule: 5×7 pixels, blinks between blue and pink every 0.15 seconds and falls at half the speed of the bombs (55 pixels per second in the first wave, and it rises with the wave like the bombs). It is picked up on touching the player ship; otherwise it exits at the bottom.
- 2026-10-04 11:24 · [replaced by 2026-10-04 11:30] Back door to test the powers, keyboard only: with the ship in play, Shift+1…6 gives the power with that number (1 rapid shot, 2 deep, 3 bomb, 4 annihilation, 5 slow fire, 6 triple), as if a capsule had been picked up. Ctrl+1…6 is not used because Chrome reserves it for switching tabs.
- 2026-10-04 11:30 · Powers: rapid, up to three shots on screen, one per press of the space bar or tap (holding the space bar down does not fire more); deep, the shot does not stop and destroys every ship it touches; bomb, the shot is an orange diamond that explodes on hitting a ship and destroys the ships wholly or partly inside a circle 55 pixels in diameter (5 ship widths), with an expanding shockwave; annihilation, the next shot fires no projectile, destroys all living ships (in formation and diving) and the power ends; slow fire, the shot rises at 150 pixels per second instead of 300; triple, three parallel projectiles 6 pixels apart that count as a single shot (you cannot fire again until all three are gone); extra life, immediately adds a spare ship, up to a maximum of 5, and does not replace the power you have.
- 2026-10-04 11:30 · All powers come up with the same probability, now 1 in 7 with the extra life.
- 2026-10-04 11:30 · Back door to test the powers, keyboard only: with the ship in play, Shift+1…7 gives the power with that number (1 rapid shot, 2 deep, 3 bomb, 4 annihilation, 5 slow fire, 6 triple, 7 extra life), as if a capsule had been picked up. Ctrl+1…6 is not used because Chrome reserves it for switching tabs.
- 2026-10-04 11:33 · Validated by the owner: the power-ups are implemented and the node becomes stable.
- 2026-10-06 15:45 · Every power received (capsule picked up, extra life included, or the Shift+1…7 back door) adds one to KF.powerups.recogidas, which Sound observes to play the power-up sound; power-ups does not call Sound.

## Requirements
- 2026-10-04 10:46 · idea: When a yellow with its two red escorts is destroyed while diving, a random power-up falls as if it were a bomb (a blinking capsule, the same for all and with the same probability; it gives no points); if the player picks it up, they get that power until the end of the wave. Possible ones: rapid shot (up to three active shots instead of one), deep shot (the shot goes through and destroys every ship in its path), bomb (on hitting a ship it explodes and destroys the ships wholly or partly inside a circle five ship widths across), annihilation (on firing, all enemy ships are destroyed), slow fire (power-down: the shot travels at half speed) and triple shot (three parallel projectiles).
- 2026-10-04 10:46 · Get some random 'power ups' when a formation of a yellow ship + two reds is destroyed. Once destroyed, the boost falls (as if it were a bomb), if it is picked up, the new power is obtained until the wave ends.
- 2026-10-04 10:46 · Rapid shot: Being able to have up to three 'active' shots instead of just one
- 2026-10-04 10:46 · Deep  shot: The shot is not removed on hitting a ship, it continues its course destroying all the ships in its path
- 2026-10-04 10:46 · Bomb: Instead of a shot, a bomb that when it hits an enemy ship, generates an explosion destroying all the ships that are wholly or partly in a circle of the width of a ship * 5
- 2026-10-04 10:46 · Annihilation: On firing, all enemy ships are destroyed
- 2026-10-04 10:46 · Slow fire: The player's shot travels at half speed (this would be a power-down)
- 2026-10-04 10:46 · Triple shot: On firing, instead of one projectile coming out, three parallel projectiles are fired
- 2026-10-04 10:48 · answer: when does the power-up drop? → Only when the three ships are destroyed while they are diving
- 2026-10-04 10:48 · answer: does annihilation last the whole wave? → Annihilation is single use, after all, the power-up ends when the wave ends
- 2026-10-04 10:48 · answer: do powers stack? → They replace
- 2026-10-04 10:48 · answer: can the power-down be told apart before picking it up? → No, that's the fun of it, since you might get a power-down
- 2026-10-04 10:49 · answer: is the power-up lost if your ship is destroyed? → yes
- 2026-10-04 10:50 · answer: same probability for all powers? → Same probability, a party of chance :-)
- 2026-10-04 10:50 · answer: blinking capsule, the same for all? → Yes
- 2026-10-04 10:50 · answer: does the triple shot count as a single active shot? → Yes
- 2026-10-04 10:50 · answer: does picking it up give points? → No
- 2026-10-04 10:50 · run the task and publish
- 2026-10-04 11:23 · Make the Power-up fall at 50% of the current speed.
- 2026-10-04 11:23 · To be able to test the power-ups (they're not easy to get either, it's well balanced), be able to activate them through a back door: Crtrl+1 (first power), Ctrl+2 (second) .....
- 2026-10-04 11:23 · It will only work with the keyboard, but it lets me validate how each power up works
- 2026-10-04 11:24 · answer: Ctrl+1…6 or Shift+1…6, since Chrome reserves Ctrl+number? → Ok, shift
- 2026-10-04 11:29 · Power Up 1 fires all three shots with the same press of the space bar, the right thing is one shot per press.
- 2026-10-04 11:29 · New Power Up: Extra life
- 2026-10-04 11:30 · answer: does the extra life replace the active power? → Ok (it does not replace it)
- 2026-10-04 11:30 · answer: cap on spare ships? → Maximum 5.
- 2026-10-06 15:45 · Derived from sonido/sonidos-con-profundidad: notify each capsule pickup, extra life included.
