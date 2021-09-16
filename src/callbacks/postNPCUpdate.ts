import * as fixHushCollision from "../features/mandatory/fixHushCollision";
import * as fastBigHorn from "../features/optional/bosses/fastBigHorn";
import * as fastHaunt from "../features/optional/bosses/fastHaunt";
import * as fastPin from "../features/optional/bosses/fastPin";
import * as removeLambBody from "../features/optional/bosses/removeLambBody";
import * as stopDeathSlow from "../features/optional/bosses/stopDeathSlow";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as disableInvulnerability from "../features/optional/enemies/disableInvulnerability";
import * as fastGhosts from "../features/optional/enemies/fastGhosts";
import * as fastHands from "../features/optional/enemies/fastHands";
import * as fastNeedles from "../features/optional/enemies/fastNeedles";
import * as globinSoftlock from "../features/optional/enemies/globinSoftlock";
import * as fastClearPostNPCUpdate from "../features/optional/major/fastClear/callbacks/postNPCUpdate";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    globin,
    EntityType.ENTITY_GLOBIN, // 24
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    pin,
    EntityType.ENTITY_PIN, // 62
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
    ragling,
    EntityType.ENTITY_RAGLING, // 246
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
    lamb,
    EntityType.ENTITY_THE_LAMB, // 273
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
    stoney,
    EntityType.ENTITY_STONEY, // 302
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    hush,
    EntityType.ENTITY_HUSH, // 407
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    bigHorn,
    EntityType.ENTITY_BIG_HORN, // 411
  );

  mod.AddCallback(
    ModCallbacks.MC_NPC_UPDATE,
    needle,
    EntityType.ENTITY_NEEDLE, // 881
  );
}

export function main(npc: EntityNPC): void {
  fastClearPostNPCUpdate.main(npc);
}

// EntityType.ENTITY_GLOBIN (24)
function globin(npc: EntityNPC) {
  globinSoftlock.postNPCUpdateGlobin(npc);
}

// EntityType.ENTITY_PIN (62)
function pin(npc: EntityNPC) {
  fastPin.postNPCUpdatePin(npc);
}

// EntityType.ENTITY_DEATH (66)
function death(npc: EntityNPC) {
  stopDeathSlow.postNPCUpdateDeath(npc);
}

// EntityType.ENTITY_MOMS_HAND (213)
function momsHand(npc: EntityNPC) {
  appearHands.postNPCUpdateMomsHand(npc);
  fastHands.postNPCUpdateMomsHand(npc);
}

// EntityType.ENTITY_WIZOOB (219)
function wizoob(npc: EntityNPC) {
  disableInvulnerability.postNPCUpdateWizoob(npc);
  fastGhosts.postNPCUpdateWizoob(npc);
}

// EntityType.ENTITY_RAGLING (246)
function ragling(npc: EntityNPC) {
  fastClearPostNPCUpdate.ragling(npc);
}

// EntityType.ENTITY_THE_HAUNT (260)
function haunt(npc: EntityNPC) {
  disableInvulnerability.postNPCUpdateHaunt(npc);
  fastHaunt.postNPCUpdateHaunt(npc);
}

// EntityType.ENTITY_DINGLE (261)
function dingle(npc: EntityNPC) {
  fastClearPostNPCUpdate.dingle(npc);
}

// EntityType.ENTITY_THE_LAMB (273)
function lamb(npc: EntityNPC) {
  removeLambBody.postNPCUpdateLamb(npc);
}

// EntityType.ENTITY_RED_GHOST (285)
function redGhost(npc: EntityNPC) {
  disableInvulnerability.postNPCUpdateRedGhost(npc);
  fastGhosts.postNPCUpdateRedGhost(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
function momsDeadHand(npc: EntityNPC) {
  appearHands.postNPCUpdateMomsDeadHand(npc);
  fastHands.postNPCUpdateMomsDeadHand(npc);
}

// EntityType.ENTITY_STONEY (302)
function stoney(npc: EntityNPC) {
  fastClearPostNPCUpdate.stoney(npc);
}

// EntityType.ENTITY_HUSH (407)
function hush(npc: EntityNPC) {
  fixHushCollision.postNPCUpdateHush(npc);
}

// EntityType.ENTITY_BIG_HORN (411)
function bigHorn(npc: EntityNPC) {
  fastBigHorn.postNPCUpdateBigHorn(npc);
}

// EntityType.ENTITY_NEEDLE (881)
function needle(npc: EntityNPC) {
  fastNeedles.postNPCUpdateNeedle(npc);
}
