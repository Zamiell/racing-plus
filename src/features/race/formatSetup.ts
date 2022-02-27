import {
  CHARACTERS_WITH_AN_ACTIVE_ITEM,
  copyArray,
  ensureAllCases,
  getLastElement,
  useActiveItemTemp,
} from "isaacscript-common";
import g from "../../globals";
import { serverCollectibleIDToCollectibleType } from "../../utils";
import {
  giveCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../utilsGlobals";
import { setStartedWithCompass } from "../mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as tempMoreOptions from "../mandatory/tempMoreOptions";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

/**
 * In vanilla, most of these characters have a pocket item, which is made to be the active item in
 * Racing+.
 */
const CHARACTERS_WITH_AN_ACTIVE_ITEM_RACING_PLUS: ReadonlySet<PlayerType> =
  new Set([
    PlayerType.PLAYER_JACOB, // 19
    PlayerType.PLAYER_ESAU, // 20
    PlayerType.PLAYER_MAGDALENE_B, // 22
    PlayerType.PLAYER_JUDAS_B, // 24
    PlayerType.PLAYER_BLUEBABY_B, // 25
    PlayerType.PLAYER_EVE_B, // 26
    PlayerType.PLAYER_LAZARUS_B, // 29
    PlayerType.PLAYER_APOLLYON_B, // 34
    PlayerType.PLAYER_BETHANY_B, // 36
    PlayerType.PLAYER_JACOB_B, // 37
    PlayerType.PLAYER_LAZARUS2_B, // 38
    PlayerType.PLAYER_JACOB2_B, // 39
  ]);

const BANNED_DIVERSITY_COLLECTIBLES: readonly CollectibleType[] = [
  CollectibleType.COLLECTIBLE_MOMS_KNIFE,
  CollectibleType.COLLECTIBLE_D4,
  CollectibleType.COLLECTIBLE_D100,
  CollectibleType.COLLECTIBLE_D_INFINITY,
  CollectibleType.COLLECTIBLE_GENESIS,
  CollectibleType.COLLECTIBLE_ESAU_JR,
];

const BANNED_DIVERSITY_TRINKETS: readonly TrinketType[] = [
  TrinketType.TRINKET_DICE_BAG,
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

    default: {
      ensureAllCases(g.race.format);
      break;
    }
  }

  // Mute the transformation sound, if present
  g.sfx.Stop(SoundEffect.SOUND_POWERUP_SPEWER);
}

function unseeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // If the race has not started yet, don't give the items
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Unseeded is like vanilla,
  // but the player will still start with More Options to reduce the resetting time
  // Avoid giving more options on Tainted Dead Lazarus
  if (character !== PlayerType.PLAYER_LAZARUS2_B) {
    tempMoreOptions.give(player);
  }
}

function unseededRankedSolo(player: EntityPlayer) {
  // The client will populate the starting items for the current season into the "startingItems"
  // variable
  for (const serverCollectibleID of g.race.startingItems) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }
}

function seeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // All seeded races start with the Compass to reduce mapping RNG
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS)) {
    // Eden started with The Compass, so mark to replace it with another random passive item later
    // on
    setStartedWithCompass();
  } else {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_COMPASS,
    );
  }

  // Seeded races start with an item or build (i.e. the "Instant Start" item)
  for (const serverCollectibleID of g.race.startingItems) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  // If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving Birthright
  if (character === PlayerType.PLAYER_EDEN_B) {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_BIRTHRIGHT,
    );
  }

  // If we are Tainted Isaac and there are multiple starting items for the race,
  // give Birthright so that we have more room for other items
  if (
    character === PlayerType.PLAYER_ISAAC_B &&
    g.race.startingItems.length >= 2
  ) {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_BIRTHRIGHT,
    );
  }

  // Remove Birthright on Cain, since it changes floor generation
  // Remove Birthright on The Lost, since it changes pools and causes Judas' Shadow to be removed
  if (
    character === PlayerType.PLAYER_CAIN ||
    character === PlayerType.PLAYER_THELOST
  ) {
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_BIRTHRIGHT);
  }

  // Other collectible/trinket pool removals are done in the "removeGloballyBannedItems" feature
}

function diversity(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const trinket1 = player.GetTrinket(0);

  // If the race has not started yet, don't give the items
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Avoid giving more options on Tainted Dead Lazarus
  if (character !== PlayerType.PLAYER_LAZARUS2_B) {
    tempMoreOptions.give(player);
  }

  // In Diversity, the player is given a random active item
  // If this particular character receives the D6 as an active,
  // then the Diversity item would overwrite it
  // If this is the case, give the Schoolbag so that they can hold both items
  // (except for Esau, since he is not given any Diversity items)
  if (shouldGetSchoolbagInDiversity(player)) {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_SCHOOLBAG,
    );
  }

  // Give the player their five random diversity starting items
  if (g.race.startingItems.length !== 5) {
    error("A diversity race does not have 5 starting items.");
  }
  const collectibleTypes = copyArray(g.race.startingItems, 4);
  const trinketType = getLastElement(g.race.startingItems);

  for (const serverCollectibleID of collectibleTypes) {
    const collectibleType =
      serverCollectibleIDToCollectibleType(serverCollectibleID);
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  if (trinket1 !== 0) {
    player.TryRemoveTrinket(trinket1);
  }

  giveTrinketAndRemoveFromPools(player, trinketType);
  useActiveItemTemp(player, CollectibleType.COLLECTIBLE_SMELTER);

  // Re-give Paper Clip to Cain, for example
  if (trinket1 !== 0) {
    player.AddTrinket(trinket1);
  }

  // If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving Birthright
  // If we are Tainted Isaac, give Birthright so that we have more room for other items
  if (
    character === PlayerType.PLAYER_EDEN_B ||
    character === PlayerType.PLAYER_ISAAC_B
  ) {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_BIRTHRIGHT,
    );
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

  return (
    // Characters that already start with an active item should be given the Schoolbag so that they
    // can hold both their both their normal active item and the new diversity active item
    (CHARACTERS_WITH_AN_ACTIVE_ITEM.has(character) ||
      CHARACTERS_WITH_AN_ACTIVE_ITEM_RACING_PLUS.has(character)) &&
    // However, this should not apply to Eden and Tainted Eden because they can start with an item
    // that rerolls the build (e.g. D4, D100, etc.)
    // (we could manually replace these items, but it is simpler to just have one item on Eden
    // instead of two)
    character !== PlayerType.PLAYER_EDEN &&
    character !== PlayerType.PLAYER_EDEN_B &&
    // Esau is not granted any items in diversity races,
    // so there is no need to give him the Schoolbag
    character !== PlayerType.PLAYER_ESAU
  );
}
