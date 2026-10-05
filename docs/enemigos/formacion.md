---
title: Formation
depends_on: [enemigos, architecture, graficos, enemigos/ataque, partida]
threads:
  - New project | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiHGAxG3kiGCHW7KxfiKmG4e
  - Enemy formation | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiC47GmNga6bpWeFB1oP6k6h
  - Formations per wave | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi2wwGXnRV8WqcbjUNDcfcRR
---
## Summary
The block of alien ships at the top of the screen: its layout on a grid of 6 rows by 10 columns, different in each wave, and its horizontal movement from one side to the other. There are six formations (Clásica (Classic), Uve (V), Rombo (Diamond), Columnas (Columns), Ajedrez (Chessboard) and Fortaleza (Fortress)) that change the shape and the mix of the seven ship types; wave 1 is the arcade's classic one and from wave 7 onwards formations 2 to 6 repeat in order. The block turns around when the outermost living ship touches the edge and starts out crossing the screen in about 4 seconds; each ship keeps its slot so it can return to it after an attack.

## Decisions
- 2026-10-03 18:22 · Created in the initial requirements load.
- 2026-10-03 18:44 · [replaced by 2026-10-03 18:47] Layout: 46 ships on a grid of 10 columns by 6 rows (from top to bottom: 2 yellow in columns 3 and 7, above reds 2 and 6; 6 red in columns 2 to 7; 8 purple in columns 1 to 8; three rows of 10 blue). Each ship stores its row and column, and the formation gives the position of its slot at every moment.
- 2026-10-03 18:44 · Block turnaround: when the outermost slot of the ships still alive touches the edge of the screen; when side columns are destroyed the block travels further, as in the arcade.
- 2026-10-03 18:44 · Initial sway speed: about 4 seconds from one side to the other with the full block (16 pixels per second on the 224-wide screen). It is a value that Game raises at the start of each wave.
- 2026-10-03 18:44 · [replaced by 2026-10-04 12:05] Code in js/formacion.js; the formation is reset with its 46 ships at the start of a wave.
- 2026-10-03 18:47 · [replaced by 2026-10-04 12:05] Layout: 46 ships on a grid of 10 columns by 6 rows (from top to bottom: 2 yellow in columns 3 and 6, above reds 2 and 5, symmetrical as in the arcade; 6 red in columns 2 to 7; 8 purple in columns 1 to 8; three rows of 10 blue). Each ship stores its row and column, and the formation gives the position of its slot at every moment.
- 2026-10-03 18:46 · Player shot hit: the formation checks whether a rectangle touches any living ship in its slot (an 11×8 pixel area centred on it); if so, that ship disappears and the shot is informed, and is freed. Points are left to Scoreboard and diving ships to enemigos/ataque.
- 2026-10-04 12:05 · Formations per wave: each wave has its formation on the grid of 10 columns by 6 rows, from top to bottom (A yellow, R red, L purple, B blue, V green, N orange, C cyan, · empty). 1 Clásica, 46 ships: ···A··A··· / ··RRRRRR·· / ·LLLLLLLL· / three rows of 10 B (yellows above reds 2 and 5, like the arcade). 2 Uve, 30 ships: ····AA···· / ···RRRR··· / ··LLVVLL·· / ·BBVVVVBB· / BBV····VBB / BV······VB. 3 Rombo, 28 ships: ····AA···· / ···RNNR··· / ··LRNNRL·· / ·BLLBBLLB· / ··BBNNBB·· / ····BB····. 4 Columnas, 38 ships: ·A······A· / RRR·CC·RRR / LLL·CC·LLL / BBB·CC·BBB / BBB····BBB / BBB····BBB. 5 Ajedrez, 26 ships: ··A····A·· / ·R·R··R·R· / C·V·NN·V·C / ·L·L··L·L· / B·V·BB·V·B / ·B·N··N·B·. 6 Fortaleza, 46 ships: ···A··A··· / ··RRCCRR·· / ·NLLLLLLN· / VVBBBBBBVV / CBBNBBNBBC / BBBBBBBBBB. From wave 7 onwards formations 2 to 6 repeat in order. Each ship stores its row and column, and the formation gives the position of its slot at every moment.
- 2026-10-04 12:05 · Every formation has yellows with reds nearby, so the yellow can leave with two red escorts and drop the power-up.
- 2026-10-04 12:05 · Code in js/formacion.js (KF.formacion.FORMACIONES, formacionDeOleada); at the start of a wave, Game resets the formation with that wave's one (KF.formacion.reiniciar(velocidad, oleada)).

## Requirements
- 2026-10-03 18:13 · From sources/KillerFlies.txt § 2: waves of ships in a block of 6 rows by 10 columns at the top; from bottom to top, three rows of 10 blue, one of 8 purple aligned with the 8 central blue, one of 6 red aligned with the 6 central purple and one of 2 yellow above reds 2 and 6.
- 2026-10-03 18:13 · The block of ships keeps moving horizontally from one side of the screen to the other.
- 2026-10-03 18:22 · draft: Implement the 46-ship formation according to the layout in sources/KillerFlies.txt § 2 and its horizontal sway from one side of the screen to the other, keeping each ship's slot so it returns to it after an attack.
- 2026-10-03 18:42 · 3. A (the block turns around when the ship furthest to one side touches the edge, as in the arcade)
- 2026-10-03 18:42 · 4. A (slow sway like the arcade, about 4 seconds from one side to the other)
- 2026-10-03 18:47 · B (yellows above reds 2 and 5, like the arcade, instead of 2 and 6)
- 2026-10-03 18:42 · Derived from jugador: indicate whether the player's shot touches a ship in the formation; that ship disappears and the shot is freed.
- 2026-10-04 11:57 · Let's make each level have a different formation and enemy composition, adding more enemy types with different attacks
