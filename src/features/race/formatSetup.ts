import {
  CollectibleType,
  PlayerType,
  SoundEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  characterStartsWithActiveItem,
  copyArray,
  giveTrinketsBack,
  isCharacter,
  isEden,
  sfxManager,
  temporarilyRemoveTrinkets,
  useActiveItemTemp,
} from "isaacscript-common";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { ServerCollectibleID } from "../../types/ServerCollectibleID";
import { serverCollectibleIDToCollectibleType } from "../../utils";
import {
  addCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../utilsGlobals";
import { setStartedWithCompass } from "../mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as tempMoreOptions from "../mandatory/tempMoreOptions";

/**
 * In vanilla, most of these characters have a pocket item, which is made to be the active item in
 * Racing+.
 */
const CHARACTERS_WITH_AN_ACTIVE_ITEM_RACING_PLUS: ReadonlySet<PlayerType> =
  new Set([
    PlayerType.JACOB, // 19
    PlayerType.ESAU, // 20
    PlayerType.MAGDALENE_B, // 22
    PlayerType.JUDAS_B, // 24
    PlayerType.BLUE_BABY_B, // 25
    PlayerType.EVE_B, // 26
    PlayerType.LAZARUS_B, // 29
    PlayerType.APOLLYON_B, // 34
    PlayerType.BETHANY_B, // 36
    PlayerType.JACOB_B, // 37
    PlayerType.LAZARUS_2_B, // 38
    PlayerType.JACOB_2_B, // 39
  ]);

function characterStartsWithActiveItemRacingPlus(character: PlayerType) {
  return CHARACTERS_WITH_AN_ACTIVE_ITEM_RACING_PLUS.has(character);
}

/** These are collectibles that are banned from all item pools in all diversity races. */
export const BANNED_DIVERSITY_COLLECTIBLES: readonly CollectibleType[] = [
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.D100, // 283
  CollectibleType.D4, // 284
  CollectibleType.D_INFINITY, // 489
  CollectibleType.GENESIS, // 622
  CollectibleType.ESAU_JR, // 703
];

/** These are trinkets that are banned from the trinket pool in all diversity races. */
export const BANNED_DIVERSITY_TRINKETS: readonly TrinketType[] = [
  TrinketType.DICE_BAG,
];

export function formatSetup(player: EntityPlayer): void {
  if (
    g.race.myStatus === RacerStatus.FINISHED ||
    g.race.myStatus === RacerStatus.QUIT ||
    g.race.myStatus === RacerStatus.DISQUALIFIED
  ) {
    return;
  }

  switch (g.race.format) {
    case RaceFormat.UNSEEDED: {
      if (g.race.ranked && g.race.solo) {
        unseededRankedSolo(player);
      } else {
        unseeded(player);
      }

      break;
    }

    case RaceFormat.SEEDED: {
      seeded(player);
      break;
    }

    case RaceFormat.DIVERSITY: {
      diversity(player);
      break;
    }

    case RaceFormat.CUSTOM: {
      break;
    }
  }

  // Mute the transformation sound, if present.
  sfxManager.Stop(SoundEffect.POWER_UP_SPEWER);
}

/**
 * Unseeded is like vanilla, but the player will still start with More Options to reduce the
 * resetting time.
 */
function unseeded(player: EntityPlayer) {
  // If the race has not started yet, don't give the items.
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Avoid giving more options on Tainted Dead Lazarus.
  if (!isCharacter(player, PlayerType.LAZARUS_2_B)) {
    tempMoreOptions.give(player);
  }
}

function unseededRankedSolo(player: EntityPlayer) {
  // The client will populate the starting items for the current season into the "startingItems"
  // variable.
  for (const startingItem of g.race.startingItems) {
    const serverCollectibleID = startingItem as ServerCollectibleID;
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    addCollectibleAndRemoveFromPools(player, collectibleType);
  }
}

function seeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // All seeded races start with the Compass to reduce mapping RNG.
  if (player.HasCollectible(CollectibleType.COMPASS)) {
    // Eden started with The Compass, so mark to replace it with another random passive item later
    // on.
    setStartedWithCompass();
  } else {
    addCollectibleAndRemoveFromPools(player, CollectibleType.COMPASS);
  }

  // Seeded races start with an item or build (i.e. the "Instant Start" item).
  for (const startingItem of g.race.startingItems) {
    const serverCollectibleID = startingItem as ServerCollectibleID;
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    addCollectibleAndRemoveFromPools(player, collectibleType);
  }

  // If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving
  // Birthright.
  if (character === PlayerType.EDEN_B) {
    addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  // If we are Tainted Isaac and there are multiple starting items for the race, give Birthright so
  // that we have more room for other items.
  if (character === PlayerType.ISAAC_B && g.race.startingItems.length >= 2) {
    addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  // - Remove Birthright on Cain, since it changes floor generation.
  // - Remove Birthright on The Lost, since it changes pools and causes Judas' Shadow to be removed.
  if (character === PlayerType.CAIN || character === PlayerType.THE_LOST) {
    g.itemPool.RemoveCollectible(CollectibleType.BIRTHRIGHT);
  }

  // Other collectible/trinket pool removals are done in the "removeGloballyBannedItems" feature.
}

function diversity(player: EntityPlayer) {
  // If the race has not started yet, don't give the items.
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  if (g.race.startingItems.length !== 5) {
    error("A diversity race does not have 5 starting items.");
  }

  // Don't copy the final element, which is the trinket.
  const serverCollectibleIDs = copyArray(
    g.race.startingItems,
    4,
  ) as ServerCollectibleID[];
  const collectibleTypes = serverCollectibleIDs.map((serverCollectibleID) =>
    serverCollectibleIDToCollectibleType(serverCollectibleID),
  );
  const trinketType = g.race.startingItems[4] as TrinketType;

  giveDiversityItemsAndDoItemBans(player, collectibleTypes, trinketType);
}

export function giveDiversityItemsAndDoItemBans(
  player: EntityPlayer,
  collectibleTypes: CollectibleType[],
  trinketType: TrinketType,
): void {
  const character = player.GetPlayerType();

  // Avoid giving more options on Tainted Dead Lazarus.
  if (character !== PlayerType.LAZARUS_2_B) {
    tempMoreOptions.give(player);
  }

  // In Diversity, the player is given a random active item. If this particular character receives
  // the D6 as an active, then the Diversity item would overwrite it. If this is the case, give the
  // Schoolbag so that they can hold both items (except for Esau, since he is not given any
  // Diversity items).
  if (shouldGetSchoolbagInDiversity(player)) {
    addCollectibleAndRemoveFromPools(player, CollectibleType.SCHOOLBAG);
  }

  for (const collectibleType of collectibleTypes) {
    addCollectibleAndRemoveFromPools(player, collectibleType);
  }

  const trinketSituation = temporarilyRemoveTrinkets(player);
  giveTrinketAndRemoveFromPools(player, trinketType);
  useActiveItemTemp(player, CollectibleType.SMELTER);
  giveTrinketsBack(player, trinketSituation);

  // - If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving
  //   Birthright.
  // - If we are Tainted Isaac, give Birthright so that we have more room for other items.
  if (character === PlayerType.EDEN_B || character === PlayerType.ISAAC_B) {
    addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  for (const bannedCollectibleType of BANNED_DIVERSITY_COLLECTIBLES) {
    g.itemPool.RemoveCollectible(bannedCollectibleType);
  }

  for (const bannedTrinketType of BANNED_DIVERSITY_TRINKETS) {
    g.itemPool.RemoveTrinket(bannedTrinketType);
  }
}

function shouldGetSchoolbagInDiversity(player: EntityPlayer): boolean {
  const character = player.GetPlayerType();
  const startsWithActiveItem =
    characterStartsWithActiveItem(character) ||
    characterStartsWithActiveItemRacingPlus(character);

  return (
    // Characters that already start with an active item should be given the Schoolbag so that they
    // can hold both their both their normal active item and the new diversity active item.
    startsWithActiveItem &&
    // However, this should not apply to Eden and Tainted Eden because they can start with an item
    // that rerolls the build (e.g. D4, D100, etc.). (We could manually replace these items, but it
    // is simpler to just have one item on Eden instead of two.)
    !isEden(player) &&
    // Esau is not granted any items in diversity races, so there is no need to give him the
    // Schoolbag.
    character !== PlayerType.ESAU
  );
}
