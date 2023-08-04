import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getNPCs } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class RemoveStrayPitfalls extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveStrayPitfalls";

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const pitfalls = getNPCs(EntityType.PITFALL);
    for (const pitfall of pitfalls) {
      pitfall.Kill();
    }

    return undefined;
  }
}
