import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (challenge !== ChallengeCustom.SEASON_1) {
    return;
  }

  // Give extra items to some characters
  if (
    character === PlayerType.PLAYER_BETHANY ||
    character === PlayerType.PLAYER_BETHANY_B
  ) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_DUALITY);
  }
}
