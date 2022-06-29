import {
  CollectibleType,
  PlayerType,
  SoundEffect,
  TrinketSlot,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  characterStartsWithActiveItem,
  copyArray,
  getLastElement,
  isCharacter,
  isEden,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { serverCollectibleIDToCollectibleType } from "../../utils";
import {
  giveCollectibleAndRemoveFromPools,
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

const BANNED_DIVERSITY_COLLECTIBLES: readonly CollectibleType[] = [
  CollectibleType.MOMS_KNIFE,
  CollectibleType.D4,
  CollectibleType.D100,
  CollectibleType.D_INFINITY,
  CollectibleType.GENESIS,
  CollectibleType.ESAU_JR,
];

const BANNED_DIVERSITY_TRINKETS: readonly TrinketType[] = [
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
  for (const serverCollectibleID of g.race.startingItems) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
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
    giveCollectibleAndRemoveFromPools(player, CollectibleType.COMPASS);
  }

  // Seeded races start with an item or build (i.e. the "Instant Start" item).
  for (const serverCollectibleID of g.race.startingItems) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  // If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving
  // Birthright.
  if (character === PlayerType.EDEN_B) {
    giveCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  // If we are Tainted Isaac and there are multiple starting items for the race, give Birthright so
  // that we have more room for other items.
  if (character === PlayerType.ISAAC_B && g.race.startingItems.length >= 2) {
    giveCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  // - Remove Birthright on Cain, since it changes floor generation.
  // - Remove Birthright on The Lost, since it changes pools and causes Judas' Shadow to be removed.
  if (character === PlayerType.CAIN || character === PlayerType.THE_LOST) {
    g.itemPool.RemoveCollectible(CollectibleType.BIRTHRIGHT);
  }

  // Other collectible/trinket pool removals are done in the "removeGloballyBannedItems" feature.
}

function diversity(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const trinket1 = player.GetTrinket(TrinketSlot.SLOT_1);

  // If the race has not started yet, don't give the items.
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Avoid giving more options on Tainted Dead Lazarus.
  if (character !== PlayerType.LAZARUS_2_B) {
    tempMoreOptions.give(player);
  }

  // In Diversity, the player is given a random active item. If this particular character receives
  // the D6 as an active, then the Diversity item would overwrite it. If this is the case, give the
  // Schoolbag so that they can hold both items (except for Esau, since he is not given any
  // Diversity items).
  if (shouldGetSchoolbagInDiversity(player)) {
    giveCollectibleAndRemoveFromPools(player, CollectibleType.SCHOOLBAG);
  }

  // Give the player their five random diversity starting items.
  if (g.race.startingItems.length !== 5) {
    error("A diversity race does not have 5 starting items.");
  }
  const collectibleTypes = copyArray(g.race.startingItems, 4);
  const trinketType = getLastElement(g.race.startingItems) as
    | TrinketType
    | undefined;
  if (trinketType === undefined) {
    error("Failed to find the trinket type from the race's starting items.");
  }

  for (const serverCollectibleID of collectibleTypes) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  if (trinket1 !== TrinketType.NULL) {
    player.TryRemoveTrinket(trinket1);
  }

  giveTrinketAndRemoveFromPools(player, trinketType);
  useActiveItemTemp(player, CollectibleType.SMELTER);

  // Re-give Paper Clip to Cain, for example.
  if (trinket1 !== TrinketType.NULL) {
    player.AddTrinket(trinket1);
  }

  // - If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving
  //   Birthright.
  // - If we are Tainted Isaac, give Birthright so that we have more room for other items.
  if (character === PlayerType.EDEN_B || character === PlayerType.ISAAC_B) {
    giveCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
  }

  for (const bannedCollectibleType of BANNED_DIVERSITY_COLLECTIBLES) {
    g.itemPool.RemoveCollectible(bannedCollectibleType);
  }

  for (const bannedTrinketType of BANNED_DIVERSITY_TRINKETS) {
    g.itemPool.RemoveTrinket(bannedTrinketType);
  }
}

function shouldGetSchoolbagInDiversity(player: EntityPlayer) {
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
