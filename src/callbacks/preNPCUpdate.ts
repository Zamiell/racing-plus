import * as appearHands from "../features/optional/enemies/appearHands";

// EntityType.ENTITY_MOMS_HAND (213)
export function momsHand(npc: EntityNPC): boolean | null {
  const returnValue = appearHands.preNPCUpdate(npc);
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function momsDeadHand(npc: EntityNPC): boolean | null {
  const returnValue = appearHands.preNPCUpdate(npc);
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
}
