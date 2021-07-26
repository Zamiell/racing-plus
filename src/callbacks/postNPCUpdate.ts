import * as fastHaunt from "../features/optional/bosses/fastHaunt";
import * as stopDeathSlow from "../features/optional/bosses/stopDeathSlow";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as disableInvulnerability from "../features/optional/enemies/disableInvulnerability";
import * as fastGhosts from "../features/optional/enemies/fastGhosts";
import * as fastHands from "../features/optional/enemies/fastHands";
import * as globinSoftlock from "../features/optional/enemies/globinSoftlock";
import * as fastClearPostNPCUpdate from "../features/optional/major/fastClear/callbacks/postNPCUpdate";
import * as fastBigHorn from "../features/optional/quality/fastBigHorn";

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
    dingle,
    EntityType.ENTITY_DINGLE, // 261
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

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    bigHorn,
    EntityType.ENTITY_BIG_HORN, // 411
  );
}

// EntityType.ENTITY_GLOBIN (24)
function globin(npc: EntityNPC) {
  globinSoftlock.postNPCUpdate(npc);
}

// EntityType.ENTITY_DEATH (66)
function death(npc: EntityNPC) {
  stopDeathSlow.postNPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_HAND (213)
function momsHand(npc: EntityNPC) {
  appearHands.postNPCUpdate(npc);
  fastHands.postNPCUpdate(npc);
}

// EntityType.ENTITY_WIZOOB (219)
function wizoob(npc: EntityNPC) {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.postNPCUpdate(npc);
}

// EntityType.ENTITY_THE_HAUNT (260)
function haunt(npc: EntityNPC) {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastHaunt.postNPCUpdate(npc);
}

// EntityType.ENTITY_DINGLE (261)
function dingle(npc: EntityNPC) {
  fastClearPostNPCUpdate.dingle(npc);
}

// EntityType.ENTITY_RED_GHOST (285)
function redGhost(npc: EntityNPC) {
  disableInvulnerability.setGhostCollisionClass(npc);
  fastGhosts.postNPCUpdate(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
function momsDeadHand(npc: EntityNPC) {
  appearHands.postNPCUpdate(npc);
  fastHands.postNPCUpdate(npc);
}

function bigHorn(npc: EntityNPC) {
  fastBigHorn.postNPCUpdate(npc);
}
