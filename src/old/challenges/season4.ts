import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 4) challenge.");

  // Everyone starts with the Schoolbag in this season
  misc.giveItemAndRemoveFromPools(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );

  // Give extra items to some characters
  switch (character) {
    // 8
    case PlayerType.PLAYER_LAZARUS: {
      // Lazarus does not start with a pill to prevent players resetting for a good pill
      g.p.SetPill(0, 0);
      break;
    }

    // 13
    case PlayerType.PLAYER_LILITH: {
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_INCUBUS, 0, false);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_INCUBUS);
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_INCUBUS);

      // If we switch characters, we want to remove the extra Incubus
      g.run.extraIncubus = true;

      break;
    }

    default: {
      break;
    }
  }

  // Retrieve the chosen item/build
  // (the item choice is stored in the second half of the "charOrder" variable)
  const chosenItems = RacingPlusData.Get("charOrder-R7S4") as int[] | undefined;
  if (chosenItems === undefined) {
    return;
  }
  const itemOrBuildID = chosenItems[g.speedrun.characterNum + 7];

  // Give the chosen starting item/build
  if (itemOrBuildID < 1000) {
    // This is a single item build
    misc.giveItemAndRemoveFromPools(itemOrBuildID);
    return;
  }

  // This is a build with two items
  switch (itemOrBuildID) {
    case 1001: {
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_MUTANT_SPIDER,
      );
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_INNER_EYE);
      break;
    }

    case 1002: {
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_TECHNOLOGY);
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_LUMP_OF_COAL);
      break;
    }

    case 1003: {
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_FIRE_MIND);
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_13_LUCK,
      );
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID,
      );
      break;
    }

    case 1004: {
      // Start with the Kamikaze in the active slot for quality of life purposes
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_KAMIKAZE);
      schoolbag.put(CollectibleType.COLLECTIBLE_D6, -1);
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_HOST_HAT);
      break;
    }

    case 1005: {
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_JACOBS_LADDER,
      );
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_THERES_OPTIONS,
      );
      break;
    }

    case 1006: {
      misc.giveItemAndRemoveFromPools(
        CollectibleType.COLLECTIBLE_CHOCOLATE_MILK,
      );
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_STEVEN);
      break;
    }

    default: {
      break;
    }
  }
}
