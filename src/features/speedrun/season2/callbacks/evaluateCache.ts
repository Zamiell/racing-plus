import {
  getFlyingCollectibles,
  hasFlyingTemporaryEffect,
  hasFlyingTransformation,
  isFlyingCharacter,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../types/ChallengeCustom";
import { SEASON_2_STARTING_BUILDS } from "../constants";
import { season2GetCurrentBuildIndex } from "../v";

// CacheFlag.CACHE_FLYING (0x80)
export function season2EvaluateCacheFlying(player: EntityPlayer): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  const buildIndex = season2GetCurrentBuildIndex();
  if (buildIndex === undefined) {
    return;
  }
  const build = SEASON_2_STARTING_BUILDS[buildIndex];
  const firstCollectibleType = build[0];
  if (firstCollectibleType !== CollectibleType.COLLECTIBLE_REVELATION) {
    return;
  }

  // Only remove the flight if the player does not have another flight item or effect
  if (
    !isFlyingCharacter(player) &&
    !hasFlyingTransformation(player) &&
    !hasFlyingTemporaryEffect(player) &&
    !hasFlyingCollectibleExceptForRevelation(player)
  ) {
    player.CanFly = false;
  }
}

function hasFlyingCollectibleExceptForRevelation(player: EntityPlayer) {
  const flyingCollectibles = getFlyingCollectibles(true);
  flyingCollectibles.delete(CollectibleType.COLLECTIBLE_REVELATION);

  for (const collectibleType of flyingCollectibles.values()) {
    if (player.HasCollectible(collectibleType)) {
      return true;
    }
  }

  return false;
}
