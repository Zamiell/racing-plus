// Vasculitis causes tears to explode out of enemies. This is very confusing and makes it hard to
// see real projectiles. Fade all tears of this nature so that they are easy to distinguish.

import { CollectibleType } from "isaac-typescript-definitions";
import { anyPlayerHasCollectible, setEntityOpacity } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const FADE_AMOUNT = 0.1;

/** Setting the fade does not work in the `POST_TEAR_INIT` callback, so we have to do it here. */
// ModCallbackCustom.POST_TEAR_INIT_LATE
// TearVariant.BLOOD (1)
export function postTearInitLateBlood(tear: EntityTear): void {
  if (!config.FadeVasculitisTears) {
    return;
  }

  if (isVasculitisTear(tear)) {
    setEntityOpacity(tear, FADE_AMOUNT);
  }
}

/**
 * Both `tear.Parent` and `tear.SpawnerEntity` will be equal to undefined if it is a Vasculitis
 * tear, because it is originating from the entity (and not the player or any familiar).
 */
function isVasculitisTear(tear: EntityTear): boolean {
  return (
    tear.Parent === undefined &&
    tear.SpawnerEntity === undefined &&
    anyPlayerHasCollectible(CollectibleType.VASCULITIS)
  );
}
