import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

const ITEM_SPRITESHEET_ID = 1;

export function changeCollectibleSubType(
  collectible: Entity,
  newCollectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  collectible.SubType = newCollectibleType;

  // Changing the subtype will not affect the existing sprite
  const sprite = collectible.GetSprite();
  const itemConfigItem = g.itemConfig.GetCollectible(newCollectibleType);
  if (itemConfigItem === undefined) {
    error(`Failed to get the item config for: ${newCollectibleType}`);
  }
  const gfxFileName = itemConfigItem.GfxFileName;
  sprite.ReplaceSpritesheet(ITEM_SPRITESHEET_ID, gfxFileName);
  sprite.LoadGraphics();
}
