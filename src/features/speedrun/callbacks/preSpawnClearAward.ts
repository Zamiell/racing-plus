import * as randomCharacterOrder from "../randomCharacterOrder";
import { inSpeedrun } from "../speedrun";

export function speedrunPreSpawnClearAward(): void {
  if (!inSpeedrun()) {
    return;
  }

  randomCharacterOrder.preSpawnClearAward();
}
