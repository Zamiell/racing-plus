// Make Troll Bomb and Mega Troll Bomb fuses deterministic by making them exactly 2 seconds long
// In vanilla, the fuse is: 45 + random(1, 2147483647) % 30
// Note that game physics occur at 30 frames per second instead of 60

import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CONSISTENT_EXPLOSION_TIME_IN_SECONDS = 2;

// ModCallbacks.MC_POST_BOMB_INIT (57)
// BombVariant.BOMB_TROLL (3)
export function postBombInitTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

// ModCallbacks.MC_POST_BOMB_INIT (57)
// BombVariant.BOMB_SUPERTROLL (4)
export function postBombInitMegaTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

// ModCallbacks.MC_POST_BOMB_INIT (57)
// BombVariant.BOMB_GOLDENTROLL (18)
export function postBombInitGoldenTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

function setFuse(bomb: EntityBomb) {
  bomb.SetExplosionCountdown(
    CONSISTENT_EXPLOSION_TIME_IN_SECONDS * GAME_FRAMES_PER_SECOND,
  );
}
