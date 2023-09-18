import { RoomType, TrinketType } from "isaac-typescript-definitions";
import {
  findFreePosition,
  game,
  getAliveBosses,
  inRoomType,
  spawnTrinket,
} from "isaacscript-common";
import { v } from "./v";

/** This is experimentally determined from vanilla. */
const PERFECTION_VELOCITY_MULTIPLIER = 7;

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function spawnPerfectionPreSpawnClearAward(): void {
  if (v.run.perfection.spawned) {
    return;
  }

  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();

  if (!inRoomType(RoomType.BOSS)) {
    return;
  }

  // Perfection is spawned after clearing 3 floors in a row without taking any damage. The
  // "floorsWithoutDamage" variable is incremented after going in a trapdoor. So if it is at 2, and
  // we have not taken damage on this floor, and we have killed the boss for this floor, then we
  // have cleared 3 floors.
  if (v.run.perfection.floorsWithoutDamage < 2 || v.level.tookDamage) {
    return;
  }

  const aliveBosses = getAliveBosses();
  if (aliveBosses.length > 0) {
    return;
  }

  const room = game.GetRoom();
  const centerPos = room.GetCenterPos();
  const position = findFreePosition(centerPos);
  const velocity = RandomVector().mul(PERFECTION_VELOCITY_MULTIPLIER);
  spawnTrinket(
    TrinketType.PERFECTION,
    position,
    velocity,
    undefined,
    startSeed,
  );

  v.run.perfection.spawned = true;
}
