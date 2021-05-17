import g from "../globals";
import {
  SEASON_7_CHARACTER_ITEM_BANS,
  SEASON_7_VALID_ACTIVE_ITEMS,
  SEASON_7_VALID_PASSIVE_ITEMS,
  SEASON_7_VALID_TRINKETS,
} from "./constants";

export function generateDiversityStarts(): Array<
  CollectibleType | TrinketType
> {
  // Local variables
  const startSeed = g.seeds.GetStartSeed();

  const startingItems = [];
  math.randomseed(startSeed);

  // Get 1 random active item
  const randomActiveItemIndex = math.random(
    0,
    SEASON_7_VALID_ACTIVE_ITEMS.length - 1,
  );
  const activeItem = SEASON_7_VALID_ACTIVE_ITEMS[randomActiveItemIndex];
  startingItems.push(activeItem);

  // Get 3 random unique passive items
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const randomPassiveItemIndex = math.random(
        0,
        SEASON_7_VALID_PASSIVE_ITEMS.length - 1,
      );
      const passiveItem = SEASON_7_VALID_PASSIVE_ITEMS[randomPassiveItemIndex];

      // Ensure this item is unique
      if (startingItems.includes(passiveItem)) {
        continue;
      }

      // Check for character-specific bans
      if (isItemBannedOnThisCharacter(passiveItem)) {
        continue;
      }

      // Check for item synergy bans
      if (
        passiveItem === CollectibleType.COLLECTIBLE_ISAACS_HEART &&
        activeItem === CollectibleType.COLLECTIBLE_BLOOD_RIGHTS
      ) {
        continue;
      }
      if (
        passiveItem === CollectibleType.COLLECTIBLE_LIBRA &&
        startingItems.includes(CollectibleType.COLLECTIBLE_SOY_MILK)
      ) {
        continue;
      }
      if (
        passiveItem === CollectibleType.COLLECTIBLE_SOY_MILK &&
        startingItems.includes(CollectibleType.COLLECTIBLE_LIBRA)
      ) {
        continue;
      }

      startingItems.push(passiveItem);
      break;
    }
  }

  // Get 1 random trinket
  const randomTrinketIndex = math.random(0, SEASON_7_VALID_TRINKETS.length - 1);
  const trinket = SEASON_7_VALID_TRINKETS[randomTrinketIndex];
  startingItems.push(trinket);

  return startingItems;
}

function isItemBannedOnThisCharacter(itemID: CollectibleType) {
  // Local variables
  const character = g.p.GetPlayerType();
  const bannedItemsForThisCharacter = SEASON_7_CHARACTER_ITEM_BANS.get(
    character,
  );
  if (bannedItemsForThisCharacter === undefined) {
    return false;
  }

  return bannedItemsForThisCharacter.includes(itemID);
}
