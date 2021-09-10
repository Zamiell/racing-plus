import * as seededDrops from "../features/mandatory/seededDrops";
import * as removeStrayPitfalls from "../features/optional/enemies/removeStrayPitfalls";
import fastClearPreSpawnClearAward from "../features/optional/major/fastClear/callbacks/preSpawnClearAward";
import fastTravelPreSpawnClearAward from "../features/optional/major/fastTravel/callbacks/preSpawnClearAward";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import racePreSpawnClearAward from "../features/race/callbacks/preSpawnClearAward";
import { speedrunPreSpawnClearAward } from "../features/speedrun/callbacks/preSpawnClearAward";

export function main(_rng: RNG, _spawnPosition: Vector): boolean | void {
  // Major
  fastClearPreSpawnClearAward();
  fastTravelPreSpawnClearAward();
  racePreSpawnClearAward();
  speedrunPreSpawnClearAward();

  // Enemies
  removeStrayPitfalls.preSpawnClearAward();

  // Gameplay
  combinedDualityDoors.preSpawnClearAward();

  return seededDrops.preSpawnClearAward();
}
