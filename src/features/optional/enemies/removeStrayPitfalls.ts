import { getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.removeStrayPitfalls) {
    return;
  }

  const pitfalls = getNPCs(EntityType.ENTITY_PITFALL);
  for (const pitfall of pitfalls) {
    pitfall.Kill();
  }
}
