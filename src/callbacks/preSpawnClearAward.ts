import fastClearPreSpawnClearAward from "../features/optional/major/fastClear/callbacks/preSpawnClearAward";
import fastTravelPreSpawnClearAward from "../features/optional/major/fastTravel/callbacks/preSpawnClearAward";
import racePreSpawnClearAward from "../features/race/callbacks/preSpawnClearAward";
import g from "../globals";

export function main(_rng: RNG, _spawnPosition: Vector): void {
  const gameFrameCount = g.g.GetFrameCount();

  g.run.room.clearFrame = gameFrameCount;

  fastClearPreSpawnClearAward();
  fastTravelPreSpawnClearAward();
  racePreSpawnClearAward();
}
