import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import { inSpeedrun } from "../speedrun";

export function speedrunPreSpawnClearAward(): void {
  if (!inSpeedrun()) {
    return;
  }

  allowVanillaPathsInRepentanceChallenge.preSpawnClearAward();
}
