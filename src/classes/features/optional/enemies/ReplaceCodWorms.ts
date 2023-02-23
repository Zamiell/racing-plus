import { EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class ReplaceCodWorms extends ConfigurableModFeature {
  configKey: keyof Config = "ReplaceCodWorms";

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.COD_WORM,
  )
  preEntitySpawnCodWorm(
    initSeed: int,
  ): [EntityType, int, int, int] | undefined {
    if (!config.ReplaceCodWorms) {
      return undefined;
    }

    // Replace Cod Worms with Para-Bites.
    return [EntityType.PARA_BITE, 0, 0, initSeed];
  }
}
