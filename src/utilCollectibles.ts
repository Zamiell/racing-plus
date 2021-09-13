// This is in a separate file to prevent a dependency cycle

import { setCollectibleSprite } from "isaacscript-common";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export function changeCollectibleSubType(
  collectible: EntityPickup,
  newCollectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  collectible.SubType = newCollectibleType;

  // Changing the subtype will not affect the existing sprite
  const itemConfigItem = g.itemConfig.GetCollectible(newCollectibleType);
  if (itemConfigItem === undefined) {
    error(`Failed to get the item config for: ${newCollectibleType}`);
  }
  setCollectibleSprite(collectible, itemConfigItem.GfxFileName);
}
