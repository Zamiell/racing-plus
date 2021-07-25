import g from "../../globals";
import { giveItemAndRemoveFromPools } from "../../misc";
import { CollectibleTypeCustom } from "../../types/enums";
import {
  COLLECTIBLE_13_LUCK_SERVER_ID,
  COLLECTIBLE_15_LUCK_SERVER_ID,
} from "./constants";
import * as tempMoreOptions from "./tempMoreOptions";

const CHARACTERS_WITH_AN_ACTIVE_ITEM: PlayerType[] = [
  PlayerType.PLAYER_ISAAC,
  PlayerType.PLAYER_MAGDALENA,
  PlayerType.PLAYER_JUDAS,
  PlayerType.PLAYER_XXX,
  PlayerType.PLAYER_EVE,
  PlayerType.PLAYER_THELOST,
  PlayerType.PLAYER_LILITH,
  PlayerType.PLAYER_KEEPER,
  PlayerType.PLAYER_APOLLYON,
  PlayerType.PLAYER_JACOB,
  PlayerType.PLAYER_MAGDALENA_B,
  PlayerType.PLAYER_CAIN_B,
  PlayerType.PLAYER_JUDAS_B,
  PlayerType.PLAYER_XXX_B,
  PlayerType.PLAYER_EVE_B,
  PlayerType.PLAYER_LAZARUS_B,
  PlayerType.PLAYER_APOLLYON_B,
  PlayerType.PLAYER_BETHANY_B,
  PlayerType.PLAYER_JACOB_B,
  PlayerType.PLAYER_LAZARUS2_B,
  PlayerType.PLAYER_JACOB2_B,
];

export default function giveFormatItems(player: EntityPlayer): void {
  switch (g.race.format) {
    case "unseeded": {
      if (g.race.ranked && g.race.solo) {
        unseededRankedSolo(player);
      } else {
        unseeded(player);
      }

      break;
    }

    case "seeded": {
      seeded(player);
      break;
    }

    case "diversity": {
      diversity(player);
      break;
    }

    default: {
      break;
    }
  }
}

function unseeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // If the race has not started yet, don't give the items
  if (g.race.status !== "in progress" || g.race.myStatus !== "racing") {
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
    giveItemAndRemoveFromPools(player, itemID);
  }
}

function seeded(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // All seeded races start with the Compass to reduce mapping RNG
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS)) {
    // Eden can start with The Compass
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_COMPASS);
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
    }

    giveItemAndRemoveFromPools(player, itemID);
  }

  // If we are Tainted Eden, prevent the starting items for the race from being rerolled by giving Birthright
  if (character === PlayerType.PLAYER_EDEN_B) {
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_BIRTHRIGHT);
  }

  // If we are Tainted Isaac and there are multiple starting items for the race,
  // give Birthright so that we have more room for other items
  if (
    character === PlayerType.PLAYER_ISAAC_B &&
    g.race.startingItems.length >= 2
  ) {
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_BIRTHRIGHT);
  }

  // Remove Sol from pools, since it is mostly useless
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);

  // Remove Cain's Eye, since it is useless
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  // Since this race type has a custom death mechanic, we also want to remove the Broken Ankh
  // (since we need the custom revival to always take priority over random revivals)
  // g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH);
}

function diversity(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const trinket1 = player.GetTrinket(0);

  // If the race has not started yet, don't give the items
  if (g.race.status !== "in progress" || g.race.myStatus !== "racing") {
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
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_SCHOOLBAG);
  }

  // Give the player their five random diversity starting items
  const startingItems = g.race.startingItems;
  for (let i = 0; i < startingItems.length; i++) {
    const itemOrTrinketID = startingItems[i];

    if (i === 0) {
      // The first item is the active
      giveItemAndRemoveFromPools(player, itemOrTrinketID);
    } else if (i === 1 || i === 2 || i === 3) {
      // The second, third, and fourth items are the passives
      giveItemAndRemoveFromPools(player, itemOrTrinketID);

      // Also remove the corresponding diversity placeholder items
      if (itemOrTrinketID === CollectibleType.COLLECTIBLE_INCUBUS) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
        );
      } else if (itemOrTrinketID === CollectibleType.COLLECTIBLE_SACRED_HEART) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
        );
      } else if (
        itemOrTrinketID === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT
      ) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
        );
      }
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
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_BIRTHRIGHT);
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
    // All characters with an active item.
    // This includes tainted chars with an active D6.
    // Eden and tainted Eden are exempted because they can have
    // active items that rerolls your build so the Diversity active
    // item need to replace it.
    CHARACTERS_WITH_AN_ACTIVE_ITEM.includes(character)
  );
}
