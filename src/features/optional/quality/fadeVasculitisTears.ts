// Vasculitis causes tears to explode out of enemies
// This is very confusing and makes it hard to see real projectiles
// Fade all tears of this nature so that they are easy to distinguish

import { anyPlayerHasCollectible } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const FADE_AMOUNT = 0.15;
const FADED_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0);
const DURATION = 1000;

// ModCallbacks.MC_POST_TEAR_UPDATE (40)
// TearVariant.BLOOD (1)
// Setting the tear color does not work in the PostTearInit callback, so we have to do it here
export function postTearUpdateBlood(tear: EntityTear): void {
  if (!config.fadeVasculitisTears) {
    return;
  }

  if (isVasculitisTear(tear)) {
    fadeTear(tear);
  }
}

function isVasculitisTear(tear: EntityTear) {
  // tear.SpawnerType will be equal to 1 if it was shot by the player
  return (
    tear.FrameCount === 0 &&
    tear.SpawnerType === 0 &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_VASCULITIS)
  );
}

function fadeTear(tear: EntityTear) {
  tear.SetColor(FADED_COLOR, DURATION, 0);
}
