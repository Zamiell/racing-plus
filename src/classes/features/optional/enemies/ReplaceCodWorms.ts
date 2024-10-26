import { EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** Replace Cod Worms with Para-Bites. */
export class ReplaceCodWorms extends ConfigurableModFeature {
  configKey: keyof Config = "ReplaceCodWorms";

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.COD_WORM,
  )
  preEntitySpawnCodWorm(
    _entityType: EntityType,
    _variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    return [EntityType.PARA_BITE, 0, 0, initSeed];
  }
}
