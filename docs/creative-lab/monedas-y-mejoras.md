---
title: Coins and upgrade shop
status: idea
depends_on: []
threads:
  - Monedas y tienda de mejoras | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYiNDbUVgsKqhuXcqotfYxjKT
---
## Summary
Idea under debate: permanent upgrades bought with coins, to motivate the player to go further in order to power up the ship. Each wave drops a fixed number of coins from random enemies (the last one always from the last enemy), and each coin can be collected only once: a wave only offers the coins still missing. The coins are spent in a new option of the pause menu, an upgrade shop (a small pilot walks from the ship to a shop that appears next to it). Upgrades proposed: +5% movement speed, +5% fire rate, a one-hit shield, up to two support ships, unlocking the bonus screen between waves, ship skins, better sound effects and a higher chance of yellow attacks. Several player accounts, each with its own upgrades.
Agreed in debate so far: the bonus screen (the challenge wave, partida/oleada-desafio) starts locked and is meant to be one of the first upgrades bought; a skin must have a variant for each power-up look (power-ups/aspecto-nave); in a two-player game each player has their own coins, and a coin drops twice, a normal one for you and a 'ghost' one for the other player that you cannot pick up; the coin balance is separate for each difficulty (EASY, NORMAL, HARD) and, within a difficulty, a single balance with the sum of the coins of every wave; there is no cap on stackable upgrades: balance comes from their prices and from playtesting.
Nothing is built for it while it is an idea; it touches partida/pausa, partida/dificultad, partida/oleada-desafio, jugador, power-ups/aspecto-nave, enemigos/ataque, sonido, multijugador and the data saved in the browser (architecture).

## Decisions
- 2026-10-21 17:39 · Created in the lab as an idea, with the owner's OK to its path.
- 2026-10-21 17:44 · Debate answers: the bonus screen starts locked and is one of the first upgrades to buy; each skin has a variant for every power-up look; two-player games have a coin per player (the other's shows as a ghost and cannot be picked up); a separate coin balance per difficulty, single within it; no caps, balance by prices and playtesting.

## Requirements
- 2026-10-21 17:37 · idea: Coins that drop from random enemies, X per wave and each collectable only once (the last one always from the last enemy), saved in a purse per wave, spent in a new upgrade shop in the pause menu (with a little pilot walking from the ship to a shop) on permanent upgrades, with several player accounts, each with its own upgrades.
- 2026-10-21 17:37 · Qué tal hacer que el jugador pueda incorporar mejoras permanentes a la partida ?
- 2026-10-21 17:37 · La idea sería que en cada nivel cayesen X monedas (al matar a un enemigo random) que se van acumulando en el 'monedero' del jugador.
- 2026-10-21 17:37 · Una moneda solo puede ser recolectada una vez. Esto quiere decir que si marcamos 5 monedas por nivel y un jugador ya ha recogido 5 monedas en el nivel 1, ese nivel ya no ofrecerá más monedas. Si solo consiguió recoger 4, solo le aparecerá una moneda más.
- 2026-10-21 17:37 · La última moneda siempre aparecerá al destruir al último enemigo.
- 2026-10-21 17:37 · Habrá un monedero por nivel.
- 2026-10-21 17:37 · En la pantalla de 'pausa', habrá una nueva opción para comprar mejoras.
- 2026-10-21 17:37 · Como detalle divertido, podemos hacer que al dar a la opción de comprar mejoras, una pequeña figura humana sale de la nave del jugador y se dirige a una tienda que acaba de aparecer cerca de la nave.
- 2026-10-21 17:37 · Algunas ideas de mejoras que se pueden comprar: +5% de velocidad de movimiento (puede ser acumulativo); +5% de velocidad de disparo (puede ser acumulativo); Escudo que soporta un impacto (al destruirse la nave, vuelve a aparecer el escudo); Una pequeña nave de apoyo que se pone en un lateral de la nave del jugador (máximo dos naves de apoyo) y dispara en el mismo momento que la nave del jugador. Si algo impacta en la nave de apoyo, es destruída.; Activar la pantalla de bonus points que sale entre niveles (podemos dejarla desactivada y tener que gastar monedas para activarla). En la pantalla de bonus points se podrá recoger una moneda por cada serie de naves enemigas destruídas.; SKIN de la nave del jugador; Mejoras de efectos de sonido (por ejemplo, que el sonido de disparo del jugador sea mucho más elaborado); Mayor probabilidad de que ataque una nave amarilla en formación (acumulable); etc.
- 2026-10-21 17:37 · La idea es generar un cierto 'engagement' que motive al jugador a avanzar pantallas para potenciar su nave.
- 2026-10-21 17:37 · Como idea adicional, que pueda haber más de una cuenta de jugador, cada una con sus propias mejoras (eso permite, por ejemplo, probar con una cuenta aplicar mejoras de velocidad de movimiento, con otra, velocidad de disparo, etc.).
- 2026-10-21 17:39 · [answered 2026-10-21 17:44] question: Bonus screen: today the challenge wave (partida/oleada-desafio) follows every wave and gives an extra ship on PERFECT; locking it behind coins changes that decision and removes extra ships for players who have not bought it. Options: A) keep it always on and sell only the coin reward in it; B) lock it until bought, as proposed; C) keep it on and sell a better reward. Recommended: A.
- 2026-10-21 17:39 · [answered 2026-10-21 17:44] question: Skin vs power-up look: the ship already changes its look with each power-up (power-ups/aspecto-nave). Options: A) the skin is the normal look and the power-up look replaces it while it lasts; B) the skin always wins; C) the skin only changes colours, the power-up keeps its detail. Recommended: A.
- 2026-10-21 17:39 · [answered 2026-10-21 17:44] question: Two-player game: A) upgrades and coins only in one-player games; B) each player brings their account's upgrades and collects their own coins; C) no upgrades but coins are collected. Recommended: A.
- 2026-10-21 17:39 · [answered 2026-10-21 17:44] question: "A purse per level": read as a record per wave of how many coins are left to collect, with a single balance to spend; or a separate balance per wave that can only be spent on some upgrades? Recommended: the first.
- 2026-10-21 17:39 · [answered 2026-10-21 17:44] question: Balance: stackable upgrades (speed, fire rate, yellow attacks) with no limit end up breaking the difficulty. Options: A) a cap per upgrade (e.g. 5 levels, +25%); B) rising prices with no cap; C) both. Recommended: C.
- 2026-10-21 17:44 · answer: Bonus screen → locked at first, as proposed; it should be one of the first upgrades to buy (the owner has never won a life in it so far).
- 2026-10-21 17:44 · answer: Skin vs power-up look → each skin needs all the variants for the power-up looks.
- 2026-10-21 17:44 · answer: Two-player game → it can work: two coins drop, a 'ghost' one (the other player's) and the normal one (ours); a player cannot pick up the other player's coin.
- 2026-10-21 17:44 · answer: Purse per level → the coin balance is separate per difficulty (coins won in EASY cannot be spent in NORMAL or HARD); within a difficulty it is a single balance, the sum of the coins of every wave.
- 2026-10-21 17:44 · answer: Balance → no caps; balance comes from coin prices and playtesting (e.g. 5 coins per wave and +5% speed for 5 coins gives +30% after 6 waves, to check against the game's own speed-up per wave).
- 2026-10-21 17:44 · Skin: Sí, claro, nos obligaría a tener un Skin con todas las variantes según las mejoras
- 2026-10-21 17:44 · Con dos jugadores podría funcionar, lo único es que caerían dos monedas, una 'fantasma' (que sería la del otro jugador) y la normal (que sería la nuestra). No podemos recoger una moneda del otro jugador.
- 2026-10-21 17:44 · El saldo de monedas es independiente en función de la dificultad. Es decir, las monedas ganadas en dificultad 'fácil' no se pueden gastar en la dificultad 'normal' ni 'difícil'. Dentro de una dificultad, es saldo es único con la suma de las monedas de cada nivel.
- 2026-10-21 17:44 · Bueno, el equilibrio lo haremos con el coste de las monedas y probando el juego.
- 2026-10-21 17:44 · Bueno, la idea es que una de las primeras mejoras a comprar sea la pantalla de bonus.
