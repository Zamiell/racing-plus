// Make Troll Bomb and Mega Troll Bomb fuses deterministic by making them exactly 2 seconds long
// In vanilla, the fuse is: 45 + random(1, 2147483647) % 30
// Note that game physics occur at 30 frames per second instead of 60

import { config } from "../../../modConfigMenu";

const TWO_SECONDS_IN_GAME_FRAMES = 2 * 30;

export function postBombInitTrollBomb(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

export function postBombInitMegaTrollBomb(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

function setFuse(bomb: EntityBomb) {
  bomb.SetExplosionCountdown(TWO_SECONDS_IN_GAME_FRAMES);
}
