import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  if (!config.removeStrayPitfalls) {
    return;
  }

  const pitfalls = Isaac.FindByType(EntityType.ENTITY_PITFALL);
  for (const pitfall of pitfalls) {
    pitfall.Kill();
  }
}
