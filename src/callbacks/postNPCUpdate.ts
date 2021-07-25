import * as fastHaunt from "../features/optional/bosses/fastHaunt";
import * as stopDeathSlow from "../features/optional/bosses/stopDeathSlow";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as disableInvulnerability from "../features/optional/enemies/disableInvulnerability";
import * as fastGhosts from "../features/optional/enemies/fastGhosts";
import * as fastHands from "../features/optional/enemies/fastHands";
import * as globinSoftlock from "../features/optional/enemies/globinSoftlock";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    globin,
    EntityType.ENTITY_GLOBIN, // 24
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    death,
    EntityType.ENTITY_DEATH, // 66
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    momsHand,
    EntityType.ENTITY_MOMS_HAND, // 213
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    wizoob,
    EntityType.ENTITY_WIZOOB, // 219
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    haunt,
    EntityType.ENTITY_THE_HAUNT, // 260
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    redGhost,
    EntityType.ENTITY_RED_GHOST, // 285
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    momsDeadHand,
    EntityType.ENTITY_MOMS_DEAD_HAND, // 287
  );
}

// EntityType.ENTITY_GLOBIN (24)
export function globin(npc: EntityNPC): void {
  globinSoftlock.postNPCUpdate(npc);
}

// EntityType.ENTITY_DEATH (66)
export function death(npc: EntityNPC): void {
  stopDeathSlow.postNPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_HAND (213)
export function momsHand(npc: EntityNPC): void {
  appearHands.postNPCUpdate(npc);
  fastHands.postNPCUpdate(npc);
}

// EntityType.ENTITY_WIZOOB (219)
export function wizoob(npc: EntityNPC): void {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.postNPCUpdate(npc);
}

// EntityType.ENTITY_THE_HAUNT (260)
export function haunt(npc: EntityNPC): void {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastHaunt.postNPCUpdate(npc);
}

// EntityType.ENTITY_RED_GHOST (285)
export function redGhost(npc: EntityNPC): void {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.postNPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function momsDeadHand(npc: EntityNPC): void {
  appearHands.postNPCUpdate(npc);
  fastHands.postNPCUpdate(npc);
}
