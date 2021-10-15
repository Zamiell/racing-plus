import { removeEntities } from "isaacscript-common";
import g from "../../globals";

// Card Reading is too powerful, so it is nerfed in Racing+

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  removeEndGamePortals();
}

function removeEndGamePortals() {
  const stage = g.l.GetStage();

  if (stage < 8) {
    return;
  }

  const portals = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.PORTAL_TELEPORT,
  );
  removeEntities(portals);
}
