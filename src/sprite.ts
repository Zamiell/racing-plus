import type {
  CollectibleType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  FIRST_COLLECTIBLE_TYPE,
  LAST_VANILLA_COLLECTIBLE_TYPE,
  asCollectibleType,
  asNumber,
  getCollectibleGfxFilename,
  isGoldenTrinketType,
  isModdedCollectibleType,
  newSprite,
  onChallenge,
} from "isaacscript-common";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import type { ServerCollectibleID } from "./types/ServerCollectibleID";
import { serverCollectibleIDToCollectibleType } from "./utils";

/** e.g. Swallowed Penny is located in file "collectibles_2001.png". */
const GLOWING_IMAGE_TRINKET_OFFSET = 2000;

export function newGlowingCollectibleSprite(
  collectibleType: CollectibleType,
  useSeason2BuildsDir = false,
): Sprite {
  return newGlowingItemSprite(collectibleType, useSeason2BuildsDir);
}

/**
 * When drawing sprites for collectibles received from the server, we need to account for custom
 * collectibles that have an ID between 1001 and 1999 instead of their real collectible type.
 */
export function newGlowingCollectibleSpriteFromServerCollectibleID(
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
  return newGlowingCollectibleSprite(collectibleType);
}

export function newGlowingTrinketSprite(
  trinketType: TrinketType,
  useSeason2BuildsDir = false,
): Sprite {
  // Golden trinkets should not have their ID modified.
  const itemID = isGoldenTrinketType(trinketType)
    ? asNumber(trinketType)
    : asNumber(trinketType) + GLOWING_IMAGE_TRINKET_OFFSET;

  return newGlowingItemSprite(itemID, useSeason2BuildsDir);
}

function newGlowingItemSprite(
  itemID: int,
  useSeason2BuildsDir: boolean,
): Sprite {
  const directory = getDirectory(itemID, useSeason2BuildsDir);
  const filename = getFilename(itemID);
  return newSprite("gfx/glowing_item.anm2", `gfx/${directory}/${filename}`);
}

function getDirectory(itemID: int, useSeason2BuildsDir: boolean): string {
  if (onChallenge(ChallengeCustom.CHANGE_CHAR_ORDER) || useSeason2BuildsDir) {
    return "season-2-builds";
  }

  return isRacingPlusModdedCollectibleType(itemID)
    ? "items-glowing-custom"
    : "items-glowing";
}

function getFilename(itemID: int): string {
  if (isRacingPlusModdedCollectibleType(itemID)) {
    const gfxFilename = getCollectibleGfxFilename(asCollectibleType(itemID));
    const pathSegments = gfxFilename.split("/");
    const lastPathSegment = pathSegments.at(-1);

    return lastPathSegment ?? "questionmark.png";
  }

  const fileNum = getFileNum(itemID);
  return `collectibles_${fileNum}.png`;
}

function isRacingPlusModdedCollectibleType(itemID: int): boolean {
  return (
    isModdedCollectibleType(asCollectibleType(itemID)) &&
    itemID < GLOWING_IMAGE_TRINKET_OFFSET
  );
}

function getFileNum(itemID: int): string {
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
  if (itemID > 2189 && itemID < 32_769) {
    return defaultReturn;
  }

  // Between Golden Swallowed Penny and Golden Sigil of Baphomet.
  if (itemID >= 32_769 && itemID <= 32_957) {
    return itemID.toString();
  }

  // Past Golden Sigil of Baphomet.
  return defaultReturn;
}
