import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../types/enums";
import { changeCollectibleSubType } from "../../../utilCollectible";

export const COLLECTIBLE_REPLACEMENT_MAP = new Map<
  CollectibleTypeCustom,
  CollectibleType
>([
  [
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_SACRED_HEART,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_JUDAS_SHADOW,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_GODHEAD,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_INCUBUS,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_TWISTED_PAIR,
  ],
]);

export function postGameStarted(): void {
  if (!config.extraStartingItems) {
    removePlaceholders();
  }
}

function removePlaceholders() {
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
  );
}

export function postNewRoom(): void {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    const newCollectible = COLLECTIBLE_REPLACEMENT_MAP.get(collectible.SubType);

    if (newCollectible !== undefined) {
      changeCollectibleSubType(collectible, newCollectible);
    }
  }
}
