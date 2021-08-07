import * as seededDrops from "../features/mandatory/seededDrops";
import fastClearPreSpawnClearAward from "../features/optional/major/fastClear/callbacks/preSpawnClearAward";
import fastTravelPreSpawnClearAward from "../features/optional/major/fastTravel/callbacks/preSpawnClearAward";
import racePreSpawnClearAward from "../features/race/callbacks/preSpawnClearAward";

export function main(_rng: RNG, _spawnPosition: Vector): boolean | void {
  fastClearPreSpawnClearAward();
  fastTravelPreSpawnClearAward();
  racePreSpawnClearAward();
  return seededDrops.preSpawnClearAward();
}
