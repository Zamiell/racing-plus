// Card Reading is too powerful, so it is nerfed in Racing+.

import {
  EffectVariant,
  EntityType,
  LevelStage,
} from "isaac-typescript-definitions";
import { game, removeAllMatchingEntities } from "isaacscript-common";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  removeEndGamePortals();
}

function removeEndGamePortals() {
  if (!shouldRemoveEndGamePortals()) {
    return;
  }

  removeAllMatchingEntities(EntityType.EFFECT, EffectVariant.PORTAL_TELEPORT);
}

export function shouldRemoveEndGamePortals(): boolean {
  const level = game.GetLevel();
  const stage = level.GetStage();
  return stage >= LevelStage.WOMB_2;
}
