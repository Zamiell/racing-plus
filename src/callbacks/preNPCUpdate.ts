import * as appearHands from "../features/optional/enemies/appearHands";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_NPC_UPDATE,
    momsHand,
    EntityType.ENTITY_MOMS_HAND, // 213
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_NPC_UPDATE,
    momsDeadHand,
    EntityType.ENTITY_MOMS_DEAD_HAND, // 287
  );
}

// EntityType.ENTITY_MOMS_HAND (213)
function momsHand(npc: EntityNPC) {
  return appearHands.preNPCUpdateMomsHand(npc);
}

// EntityType.ENTITY_MOMS_DEAD_HAND (287)
function momsDeadHand(npc: EntityNPC) {
  return appearHands.preNPCUpdateMomsDeadHand(npc);
}
