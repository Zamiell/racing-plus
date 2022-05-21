import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  FIRST_COLLECTIBLE_TYPE,
  getCollectibleGfxFilename,
  getEnumValues,
  getLastElement,
  LAST_VANILLA_COLLECTIBLE_TYPE,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "./constants";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import { CollectibleTypeCustom } from "./enums/CollectibleTypeCustom";
import { serverCollectibleIDToCollectibleType } from "./utils";

const COLLECTIBLE_TYPE_CUSTOM_ARRAY: readonly CollectibleType[] = getEnumValues(
  CollectibleTypeCustom,
);
const COLLECTIBLE_TYPE_CUSTOM_SET: ReadonlySet<CollectibleType> = new Set(
  COLLECTIBLE_TYPE_CUSTOM_ARRAY,
);
const GLOWING_IMAGE_TRINKET_OFFSET = 2000;

export function initGlowingItemSprite(
  collectibleOrTrinketType: CollectibleType | TrinketType,
  trinket = false,
): Sprite {
  // Account for custom items from the server that have an ID between 1001 and 1999 instead of their
  // real collectible type.
  collectibleOrTrinketType = serverCollectibleIDToCollectibleType(
    collectibleOrTrinketType,
  );

  // Account for trinkets that are represented by filenames of e.g. "collectibles_2001.png".
  const itemID = trinket
    ? (collectibleOrTrinketType as int) + GLOWING_IMAGE_TRINKET_OFFSET
    : collectibleOrTrinketType;

  const directory = getDirectory(itemID);
  const filename = getFilename(itemID);
  return initSprite("gfx/glowing_item.anm2", `gfx/${directory}/${filename}`);
}

function getDirectory(itemID: int) {
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.CHANGE_CHAR_ORDER) {
    return "season2builds";
  }

  return isCustomCollectible(itemID as CollectibleType)
    ? "items-glowing-custom"
    : "items-glowing";
}

function getFilename(itemID: int) {
  if (isCustomCollectible(itemID as CollectibleType)) {
    const gfxFilename = getCollectibleGfxFilename(itemID as CollectibleType);
    const pathSegments = gfxFilename.split("/");
    if (pathSegments.length === 0) {
      return "questionmark.png";
    }
    return getLastElement(pathSegments);
  }

  const fileNum = getFileNum(itemID);
  return `collectibles_${fileNum}.png`;
}

function isCustomCollectible(collectibleType: CollectibleType) {
  return COLLECTIBLE_TYPE_CUSTOM_SET.has(collectibleType);
}

function getFileNum(itemID: int) {
  // "NEW" is a "Curse of the Blind" item sprite.
  const defaultReturn = "NEW";

  if (itemID < 1) {
    return defaultReturn;
  }

  // Between Sad Onion and the highest vanilla item (or a custom modded items).
  if (
    itemID >= (FIRST_COLLECTIBLE_TYPE as int) &&
    itemID <= (LAST_VANILLA_COLLECTIBLE_TYPE as int)
  ) {
    return itemID.toString().padStart(3, "0");
  }

  // Between the highest vanilla item and Swallowed Penny.
  if (itemID > (LAST_VANILLA_COLLECTIBLE_TYPE as int) && itemID < 2001) {
    return defaultReturn;
  }

  // Between Swallowed Penny and Sigil of Baphomet.
  if (itemID >= 2001 && itemID <= 2189) {
    return itemID.toString();
  }

  // Between Sigil of Baphomet and Golden Swallowed Penny.
  if (itemID > 2189 && itemID < 32769) {
    return defaultReturn;
  }

  // Between Golden Swallowed Penny and Golden Sigil of Baphomet.
  if (itemID >= 32769 && itemID <= 32957) {
    return itemID.toString();
  }

  // Past Golden Sigil of Baphomet.
  return defaultReturn;
}

export function initCollectibleSprite(
  collectibleType: CollectibleType | -1,
): Sprite {
  const sprite = Sprite();
  sprite.Load("gfx/005.100_collectible.anm2", false);
  sprite.SetFrame("Idle", 0);

  const gfxFilename = getCollectibleGfxFilename(
    collectibleType as CollectibleType,
  );
  sprite.ReplaceSpritesheet(COLLECTIBLE_LAYER, gfxFilename);
  sprite.LoadGraphics();

  return sprite;
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
