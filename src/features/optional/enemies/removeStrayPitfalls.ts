import { EntityType } from "isaac-typescript-definitions";
import { getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.RemoveStrayPitfalls) {
    return;
  }

  const pitfalls = getNPCs(EntityType.PITFALL);
  for (const pitfall of pitfalls) {
    pitfall.Kill();
  }
}
