import * as seededDrops from "../features/mandatory/seededDrops";
import fastClearPreSpawnClearAward from "../features/optional/major/fastClear/callbacks/preSpawnClearAward";
import fastTravelPreSpawnClearAward from "../features/optional/major/fastTravel/callbacks/preSpawnClearAward";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import racePreSpawnClearAward from "../features/race/callbacks/preSpawnClearAward";
import { speedrunPreSpawnClearAward } from "../features/speedrun/callbacks/preSpawnClearAward";

export function main(_rng: RNG, _spawnPosition: Vector): boolean | void {
  // Major features
  fastClearPreSpawnClearAward();
  fastTravelPreSpawnClearAward();
  racePreSpawnClearAward();
  speedrunPreSpawnClearAward();

  // Gameplay changes
  combinedDualityDoors.preSpawnClearAward();

  return seededDrops.preSpawnClearAward();
}
