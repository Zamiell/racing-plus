import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import * as season2 from "../season2";
import { inSpeedrun } from "../speedrun";

export function speedrunPreSpawnClearAward(): void {
  if (!inSpeedrun()) {
    return;
  }

  allowVanillaPathsInRepentanceChallenge.preSpawnClearAward();
  season2.preSpawnClearAward();
}
