import { ModCallback } from "isaac-typescript-definitions";
import * as seededDrops from "../features/mandatory/seededDrops";
import { fastTravelPreSpawnClearAward } from "../features/optional/major/fastTravel/callbacks/preSpawnClearAward";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { racePreSpawnClearAward } from "../features/race/callbacks/preSpawnClearAward";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.PRE_SPAWN_CLEAR_AWARD, main);
}

function main(_rng: RNG, _spawnPosition: Vector): boolean | undefined {
  // Major
  fastTravelPreSpawnClearAward();
  racePreSpawnClearAward();

  // QoL
  fastVanishingTwin.preSpawnClearAward();

  // Gameplay
  combinedDualityDoors.preSpawnClearAward();

  return seededDrops.preSpawnClearAward();
}
