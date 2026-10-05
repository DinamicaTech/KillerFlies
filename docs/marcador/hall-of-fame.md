---
title: Hall of fame
status: draft
depends_on: []
threads:
  - Hall of fame | https://claude.ai/code/project/chan_01Nf6u6M8g9LrAep6hHtGVYi?thread=cmsg_01Nf6u6M8g9LrAep6hHtGVYi85PBYekPg2cZkUXJWUDppC
---
## Summary
Pending: when the game ends, if the points make the top 10, ask for the player's name and show the 'hall of fame' with the 10 best scores (name, wave reached and points) before returning to 'START GAME'.

## Decisions
- 2026-10-05 10:55 · Takes over the hall of fame draft that was inside `marcador`: it becomes its own child node (CVP rules version 8).

## Requirements
- 2026-10-05 10:15 · At the end of the game, if the score is within the last 10 best, ask for the player's name.
- 2026-10-05 10:15 · At the end of the game, show the 'hall of fame' of the top 10 scores, with the player's name, level reached and points
- 2026-10-05 10:16 · draft: When the game ends, if the points make the top 10 saved in the browser, ask for the player's name (with the keyboard and on mobile) and save it with the points and the wave reached; then show the 'hall of fame' with the 10 best scores (name, wave reached and points) before returning to 'START GAME'.
