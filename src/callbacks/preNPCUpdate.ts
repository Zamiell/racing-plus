import * as appearHands from "../features/optional/enemies/appearHands";

// EntityType.ENTITY_MOMS_HAND (213)
export function momsHand(npc: EntityNPC): boolean | void {
  return appearHands.preNPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function momsDeadHand(npc: EntityNPC): boolean | void {
  return appearHands.preNPCUpdate(npc);
}
