import * as fastClearNPCUpdate from "../features/optional/major/fastClear/callbacks/NPCUpdate";
import * as appearHands from "../features/optional/quality/appearHands";
import * as disableInvulnerability from "../features/optional/quality/disableInvulnerability";
import * as fastGhosts from "../features/optional/quality/fastGhosts";
import * as fastHands from "../features/optional/quality/fastHands";

export function main(npc: EntityNPC): void {
  fastClearNPCUpdate.main(npc);
}

// EntityType.ENTITY_MOMS_HAND (213)
export function momsHand(npc: EntityNPC): void {
  appearHands.NPCUpdate(npc);
  fastHands.NPCUpdate(npc);
}

// EntityType.ENTITY_WIZOOB (219)
export function wizoob(npc: EntityNPC): void {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.NPCUpdate(npc);
}

// EntityType.ENTITY_RAGLING (246)
export function ragling(npc: EntityNPC): void {
  fastClearNPCUpdate.ragling(npc);
}

// EntityType.ENTITY_THE_HAUNT (260)
export function haunt(npc: EntityNPC): void {
  // Lil' Haunt (260.10)
  if (npc.Variant === 10) {
    disableInvulnerability.setGhostCollisionClass(npc);
  }
}

// EntityType.ENTITY_RED_GHOST (285)
export function redGhost(npc: EntityNPC): void {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.NPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function momsDeadHand(npc: EntityNPC): void {
  fastHands.NPCUpdate(npc);
}

// EntityType.ENTITY_STONEY (302)
export function stoney(npc: EntityNPC): void {
  fastClearNPCUpdate.stoney(npc);
}
