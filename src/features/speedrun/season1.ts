import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import g from "../../globals";
import {
  giveCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../utilsGlobals";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_1) {
    return;
  }

  giveStartingItems();
}

function giveStartingItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Give extra items to some characters
  switch (character) {
    // 0
    case PlayerType.ISAAC: {
      // Isaac does not get the D6 in challenges
      giveCollectibleAndRemoveFromPools(player, CollectibleType.D6);
      break;
    }

    case PlayerType.THE_LOST: {
      // For some reason, Holy Mantle is not removed from pools while in a custom challenge
      g.itemPool.RemoveCollectible(CollectibleType.HOLY_MANTLE);
      break;
    }

    // 14
    case PlayerType.KEEPER: {
      // Keeper does not get the Wooden Nickel in challenges
      giveCollectibleAndRemoveFromPools(player, CollectibleType.WOODEN_NICKEL);
      giveTrinketAndRemoveFromPools(player, TrinketType.STORE_KEY);
      break;
    }

    // 18, 36
    case PlayerType.BETHANY:
    case PlayerType.BETHANY_B: {
      giveCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
      break;
    }

    default: {
      break;
    }
  }
}
