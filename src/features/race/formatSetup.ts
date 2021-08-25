import { ensureAllCases } from "isaacscript-common";
import g from "../../globals";
import { CollectibleTypeCustom } from "../../types/enums";
import { giveCollectibleAndRemoveFromPools } from "../../utilGlobals";
import * as tempMoreOptions from "../mandatory/tempMoreOptions";
import * as startsWithD6 from "../optional/major/startWithD6";
import {
  COLLECTIBLE_13_LUCK_SERVER_ID,
  COLLECTIBLE_15_LUCK_SERVER_ID,
  COLLECTIBLE_SAWBLADE_SERVER_ID,
} from "./constants";
import RaceFormat from "./types/RaceFormat";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

const CHARACTERS_WITH_AN_ACTIVE_ITEM: PlayerType[] = [
  PlayerType.PLAYER_ISAAC, // 0
  PlayerType.PLAYER_MAGDALENA, // 1
  PlayerType.PLAYER_JUDAS, // 3
  PlayerType.PLAYER_XXX, // 4
  PlayerType.PLAYER_EVE, // 5
  PlayerType.PLAYER_EDEN, // 9
  PlayerType.PLAYER_THELOST, // 10
  PlayerType.PLAYER_LILITH, // 13
  PlayerType.PLAYER_KEEPER, // 14
  PlayerType.PLAYER_APOLLYON, // 15
  PlayerType.PLAYER_EDEN_B, // 30
];

export default function formatSetup(player: EntityPlayer): void {
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
  for (const itemID of g.race.startingItems) {
    giveCollectibleAndRemoveFromPools(player, itemID);
  }
}

function seeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // All seeded races start with the Compass to reduce mapping RNG
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS)) {
    // Eden can start with The Compass
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_COMPASS,
    );
  }

  // Seeded races start with an item or build (i.e. the "Instant Start" item)
  for (let itemID of g.race.startingItems) {
    // The "13 Luck" item is a special case
    // The server does not know what the real ID of it is,
    // so it uses an arbitrarily large number to represent it
    if (itemID === COLLECTIBLE_13_LUCK_SERVER_ID) {
      itemID = CollectibleTypeCustom.COLLECTIBLE_13_LUCK;
    } else if (itemID === COLLECTIBLE_15_LUCK_SERVER_ID) {
      itemID = CollectibleTypeCustom.COLLECTIBLE_15_LUCK;
    } else if (itemID === COLLECTIBLE_SAWBLADE_SERVER_ID) {
      itemID = CollectibleTypeCustom.COLLECTIBLE_SAWBLADE;
    }

    giveCollectibleAndRemoveFromPools(player, itemID);
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

  // Remove Sol from pools, since it is mostly useless
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);

  // Remove Glyph of Balance from pools, since it is useless
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GLYPH_OF_BALANCE);

  // Remove Cain's Eye, since it is useless
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);
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
  const startingItems = g.race.startingItems;
  for (let i = 0; i < startingItems.length; i++) {
    const itemOrTrinketID = startingItems[i];

    if (i === 0) {
      // The first item is the active
      giveCollectibleAndRemoveFromPools(player, itemOrTrinketID);
    } else if (i === 1 || i === 2 || i === 3) {
      // The second, third, and fourth items are the passives
      giveCollectibleAndRemoveFromPools(player, itemOrTrinketID);
    } else if (i === 4) {
      // The fifth item is the trinket
      if (trinket1 !== 0) {
        player.TryRemoveTrinket(trinket1);
      }

      player.AddTrinket(itemOrTrinketID);
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_SMELTER,
        false,
        false,
        false,
        false,
      );

      // Regive Paper Clip to Cain, for example
      if (trinket1 !== 0) {
        player.AddTrinket(trinket1);
      }

      // Remove it from the trinket pool
      g.itemPool.RemoveTrinket(itemOrTrinketID);
    }
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

  // Add item bans for diversity races
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D4);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D100);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D_INFINITY);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GENESIS);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_ESAU_JR);

  // Trinket bans for diversity races
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_DICE_BAG);
}

function shouldGetSchoolbagInDiversity(player: EntityPlayer) {
  const character = player.GetPlayerType();

  return (
    // Characters that already start with an active item should be given the Schoolbag so that they
    // can hold both their both their normal active item and the new diversity active item
    (CHARACTERS_WITH_AN_ACTIVE_ITEM.includes(character) ||
      // Racing+ gives the D6 as an active item to some characters, so these characters should get
      // the Schoolbag too for the same reason
      startsWithD6.shouldGetActiveD6(player)) &&
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
