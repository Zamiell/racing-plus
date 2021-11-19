import { config } from "../../../modConfigMenu";

// Make Troll Bomb and Mega Troll Bomb fuses deterministic by making them exactly 2 seconds long
// In vanilla, the fuse is: 45 + random(1, 2147483647) % 30
// Note that game physics occur at 30 frames per second instead of 60

const TWO_SECONDS_IN_GAME_FRAMES = 2 * 30;

export function postBombInitTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

export function postBombInitMegaTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

export function postBombInitGoldenTroll(bomb: EntityBomb): void {
  if (!config.consistentTrollBombs) {
    return;
  }

  setFuse(bomb);
}

function setFuse(bomb: EntityBomb) {
  bomb.SetExplosionCountdown(TWO_SECONDS_IN_GAME_FRAMES);
}
