import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import { season2PreSpawnClearAward } from "../season2/callbacks/preSpawnClearAward";
import { inSpeedrun } from "../speedrun";

export function speedrunPreSpawnClearAward(): void {
  if (!inSpeedrun()) {
    return;
  }

  allowVanillaPathsInRepentanceChallenge.preSpawnClearAward();
  season2PreSpawnClearAward();
}
