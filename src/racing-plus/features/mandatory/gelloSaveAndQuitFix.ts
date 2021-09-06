// Saving & quitting can allow Tainted Lilith to duplicate her Gello familiar

import { removeAllMatchingEntities } from "isaacscript-common";

export function postGameStartedContinued(): void {
  removeAllMatchingEntities(EntityType.ENTITY_FAMILIAR, FamiliarVariant.GELLO);
}
