import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { addCollectibleAndRemoveFromPools } from "../../utilsGlobals";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  giveStartingItems();
}

function giveStartingItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Give extra items to some characters.
  switch (character) {
    // 18
    case PlayerType.BETHANY: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
      break;
    }

    // 19
    case PlayerType.JACOB: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.THERES_OPTIONS); // 249
      addCollectibleAndRemoveFromPools(player, CollectibleType.MORE_OPTIONS); // 414
      break;
    }

    default: {
      break;
    }
  }
}
