// Card Reading is too powerful, so it is nerfed in Racing+

import { removeAllMatchingEntities } from "isaacscript-common";
import g from "../../globals";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  removeEndGamePortals();
}

function removeEndGamePortals() {
  const stage = g.l.GetStage();

  if (stage < 8) {
    return;
  }

  removeAllMatchingEntities(
    EntityType.ENTITY_EFFECT,
    EffectVariant.PORTAL_TELEPORT,
  );
}
