// In vanilla, Colostomia takes a second or two to drop down from the ceiling
// Instead, just make it appear on the ground like every other boss in the game does

import { VectorZero } from "isaacscript-common";

// ModCallbacks.MC_POST_NPC_INIT (27)
// EntityType.ENTITY_COLOSTOMIA (917)
export function postNPCInitColostomia(npc: EntityNPC): void {
  // The state starts at ColostomiaState.IDLE_PHASE_1 and then always transitions to
  // ColostomiaState.SPIT_POOP_BOMB
  // By immediately setting the state to ColostomiaState.SPIT_POOP_BOMB, it will force the NPC to be
  // on the ground
  npc.State = ColostomiaState.SPIT_POOP_BOMB;

  // Make it have a poof of smoke like a normal boss
  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.POOF01,
    PoofSubType.LARGE, // This is the sub-type that the Monstro poof has
    npc.Position,
    VectorZero,
    undefined,
  );
}
