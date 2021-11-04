import { MAX_VANILLA_COLLECTIBLE_TYPE } from "isaacscript-common";
import { CollectibleTypeCustom } from "./types/enums";

const GLOWING_IMAGE_TRINKET_OFFSET = 2000;

export function initGlowingItemSprite(
  collectibleOrTrinketType: int,
  trinket = false,
): Sprite {
  if (trinket) {
    collectibleOrTrinketType += GLOWING_IMAGE_TRINKET_OFFSET;
  }

  const fileNum = getFileNum(collectibleOrTrinketType);
  return initSprite(
    "gfx/glowing_item.anm2",
    `gfx/items-glowing/collectibles_${fileNum}.png`,
  );
}

function getFileNum(itemID: int) {
  // "NEW" is a "Curse of the Blind" item sprite
  const defaultReturn = "NEW";

  if (itemID < 1) {
    return defaultReturn;
  }

  // Between Sad Onion and the highest vanilla item (or a custom modded items)
  if (
    (itemID >= CollectibleType.COLLECTIBLE_SAD_ONION &&
      itemID <= MAX_VANILLA_COLLECTIBLE_TYPE) ||
    itemID === CollectibleTypeCustom.COLLECTIBLE_SAWBLADE ||
    itemID === CollectibleTypeCustom.COLLECTIBLE_13_LUCK ||
    itemID === CollectibleTypeCustom.COLLECTIBLE_15_LUCK
  ) {
    return itemID.toString().padStart(3, "0");
  }

  // Between the highest vanilla item and Swallowed Penny
  if (itemID > MAX_VANILLA_COLLECTIBLE_TYPE && itemID < 2001) {
    return defaultReturn;
  }

  // Between Swallowed Penny and Sigil of Baphomet
  if (itemID >= 2001 && itemID <= 2189) {
    return itemID.toString();
  }

  // Between Sigil of Baphomet and Golden Swallowed Penny
  if (itemID > 2189 && itemID < 32769) {
    return defaultReturn;
  }

  // Between Golden Swallowed Penny and Golden Sigil of Baphomet
  if (itemID >= 32769 && itemID <= 32957) {
    return itemID.toString();
  }

  // Past Golden Sigil of Baphomet
  return defaultReturn;
}

export function initSprite(anm2Path: string, pngPath?: string): Sprite {
  const sprite = Sprite();

  if (pngPath === undefined) {
    sprite.Load(anm2Path, true);
  } else {
    sprite.Load(anm2Path, false);
    sprite.ReplaceSpritesheet(0, pngPath);
    sprite.LoadGraphics();
  }

  sprite.SetFrame("Default", 0);

  return sprite;
}
