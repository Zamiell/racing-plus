import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class PitfallImmobility extends ConfigurableModFeature {
  configKey: keyof Config = "PitfallImmobility";

  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.PITFALL)
  postNPCUpdatePitfall(_pitfall: Entity): void {
    // TODO: get Gamonymous to reproduce bug:
    // https://www.youtube.com/watch?t=998&v=9LhnzzWaadM&feature=youtu.be
    // (I can't reproduce using console to spawn a Pitfall)
  }
}
