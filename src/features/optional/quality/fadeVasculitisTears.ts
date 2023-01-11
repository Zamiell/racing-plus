// Vasculitis causes tears to explode out of enemies. This is very confusing and makes it hard to
// see real projectiles. Fade all tears of this nature so that they are easy to distinguish.

import { CollectibleType } from "isaac-typescript-definitions";
import { anyPlayerHasCollectible } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const FADE_ALPHA = 0.1;
const FADED_COLOR = Color(1, 1, 1, FADE_ALPHA, 0, 0, 0);
const DURATION = 1000;

// ModCallbackCustom.POST_TEAR_INIT_LATE
// TearVariant.BLOOD (1)
export function postTearInitLateBlood(tear: EntityTear): void {
  if (!config.fadeVasculitisTears) {
    return;
  }

  if (isVasculitisTear(tear)) {
    fadeTear(tear);
  }
}

function isVasculitisTear(tear: EntityTear) {
  // `tear.Parent` will not be equal undefined if it was shot by the player.
  return (
    tear.Parent === undefined &&
    anyPlayerHasCollectible(CollectibleType.VASCULITIS)
  );
}

/**
 * Setting the tear color does not work in the `POST_TEAR_INIT` callback, so we have to do it here.
 */
function fadeTear(tear: EntityTear) {
  tear.SetColor(FADED_COLOR, DURATION, 0);
}
