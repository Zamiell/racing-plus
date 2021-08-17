import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
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
    case PlayerType.PLAYER_ISAAC: {
      // Isaac does not get the D6 in challenges
      player.AddCollectible(CollectibleType.COLLECTIBLE_D6);
      break;
    }

    case PlayerType.PLAYER_KEEPER: {
      // Keeper does not get the Wooden Nickel in challenges
      player.AddCollectible(CollectibleType.COLLECTIBLE_WOODEN_NICKEL);
      break;
    }

    case PlayerType.PLAYER_BETHANY:
    case PlayerType.PLAYER_BETHANY_B: {
      player.AddCollectible(CollectibleType.COLLECTIBLE_DUALITY);
      break;
    }

    default: {
      break;
    }
  }
}
