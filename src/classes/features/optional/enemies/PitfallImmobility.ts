import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class PitfallImmobility extends ConfigurableModFeature {
  configKey: keyof Config = "PitfallImmobility";

  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.PITFALL)
  postNPCUpdatePitfall(pitfall: Entity): void {
    pitfall.Velocity = VectorZero;
  }
}
