// Card Reading is too powerful, so it is nerfed in Racing+.

import {
  EffectVariant,
  EntityType,
  LevelStage,
} from "isaac-typescript-definitions";
import { removeAllMatchingEntities } from "isaacscript-common";
import { g } from "../../globals";

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
  const stage = g.l.GetStage();
  return stage >= LevelStage.WOMB_2;
}
