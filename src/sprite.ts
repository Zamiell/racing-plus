import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  asCollectibleType,
  asNumber,
  FIRST_COLLECTIBLE_TYPE,
  getCollectibleGfxFilename,
  getLastElement,
  isGoldenTrinketType,
  isModdedCollectibleType,
  LAST_VANILLA_COLLECTIBLE_TYPE,
} from "isaacscript-common";
import { COLLECTIBLE_LAYER } from "./constants";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import { ServerCollectibleID } from "./types/ServerCollectibleID";
import { serverCollectibleIDToCollectibleType } from "./utils";

/** e.g. Swallowed Penny is located in file "collectibles_2001.png". */
const GLOWING_IMAGE_TRINKET_OFFSET = 2000;

export function initGlowingCollectibleSprite(
  collectibleType: CollectibleType,
): Sprite {
  return initGlowingItemSprite(collectibleType);
}

/**
 * When drawing sprites for collectibles received from the server, we need to account for custom
 * collectibles that have an ID between 1001 and 1999 instead of their real collectible type.
 */
export function initGlowingCollectibleSpriteFromServerCollectibleID(
  serverCollectibleID: int | undefined,
): Sprite {
  if (serverCollectibleID === undefined) {
    error(
      "Failed to initialize a glowing collectible sprite from the starting items sent from the server.",
    );
  }

  const collectibleType = serverCollectibleIDToCollectibleType(
    serverCollectibleID as ServerCollectibleID,
  );
  return initGlowingCollectibleSprite(collectibleType);
}

export function initGlowingTrinketSprite(trinketType: TrinketType): Sprite {
  // Golden trinkets should not have their ID modified.
  const itemID = isGoldenTrinketType(trinketType)
    ? asNumber(trinketType)
    : asNumber(trinketType) + GLOWING_IMAGE_TRINKET_OFFSET;

  return initGlowingItemSprite(itemID);
}

function initGlowingItemSprite(itemID: int): Sprite {
  const directory = getDirectory(itemID);
  const filename = getFilename(itemID);
  return initSprite("gfx/glowing_item.anm2", `gfx/${directory}/${filename}`);
}

function getDirectory(itemID: int) {
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.CHANGE_CHAR_ORDER) {
    return "season-2-builds";
  }

  return isRacingPlusModdedCollectible(itemID)
    ? "items-glowing-custom"
    : "items-glowing";
}

function getFilename(itemID: int) {
  if (isRacingPlusModdedCollectible(itemID)) {
    const gfxFilename = getCollectibleGfxFilename(asCollectibleType(itemID));
    const pathSegments = gfxFilename.split("/");
    if (pathSegments.length === 0) {
      return "questionmark.png";
    }

    return getLastElement(pathSegments);
  }

  const fileNum = getFileNum(itemID);
  return `collectibles_${fileNum}.png`;
}

function isRacingPlusModdedCollectible(itemID: int) {
  return (
    isModdedCollectibleType(asCollectibleType(itemID)) &&
    itemID < GLOWING_IMAGE_TRINKET_OFFSET
  );
}

function getFileNum(itemID: int) {
  // "NEW" is a "Curse of the Blind" item sprite.
  const defaultReturn = "NEW";

  if (itemID < 1) {
    return defaultReturn;
  }

  // Between Sad Onion and the highest vanilla item (or a custom modded items).
  if (
    itemID >= asNumber(FIRST_COLLECTIBLE_TYPE) &&
    itemID <= asNumber(LAST_VANILLA_COLLECTIBLE_TYPE)
  ) {
    return itemID.toString().padStart(3, "0");
  }

  // Between the highest vanilla item and Swallowed Penny.
  if (itemID > asNumber(LAST_VANILLA_COLLECTIBLE_TYPE) && itemID < 2001) {
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
    asCollectibleType(collectibleType),
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
