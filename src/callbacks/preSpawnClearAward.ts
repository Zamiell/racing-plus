import { ModCallback } from "isaac-typescript-definitions";
import { racePreSpawnClearAward } from "../features/race/callbacks/preSpawnClearAward";
import { mod } from "../mod";

export function preSpawnClearAwardInit(): void {
  mod.AddCallback(ModCallback.PRE_SPAWN_CLEAR_AWARD, main);
}

function main(_rng: RNG, _spawnPosition: Vector): boolean | undefined {
  // Major
  racePreSpawnClearAward();

  return undefined;
}
