import {
  CollectibleType,
  GridEntityType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  anyPlayerHasCollectible,
  game,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const GRID_ENTITY_TYPES_SPIKES = new ReadonlySet([
  GridEntityType.SPIKES,
  GridEntityType.SPIKES_ON_OFF,
]);

/**
 * Rarely, Damocles can make collectibles overlap with spikes. Detect this and move the collectible
 * if necessary.
 */
export class DamoclesSpikesFix extends ConfigurableModFeature {
  configKey: keyof Config = "DamoclesSpikesFix";

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_UPDATE_FILTER,
    PickupVariant.COLLECTIBLE,
  )
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    if (!anyPlayerHasCollectible(CollectibleType.DAMOCLES_PASSIVE)) {
      return;
    }

    const room = game.GetRoom();
    const gridEntity = room.GetGridEntityFromPos(pickup.Position);
    if (gridEntity === undefined) {
      return;
    }

    const gridEntityType = gridEntity.GetType();
    if (!GRID_ENTITY_TYPES_SPIKES.has(gridEntityType)) {
      return;
    }

    pickup.Position = room.FindFreePickupSpawnPosition(pickup.Position);
  }
}
