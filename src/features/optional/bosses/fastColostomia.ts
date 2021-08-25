// In vanilla, Colostomia takes a second or two to drop down from the ceiling
// Instead, just make it appear on the ground like every other boss in the game does

export function postNPCInitColostomia(npc: EntityNPC): void {
  // In vanilla, the state starts at NpcState.STATE_IDLE and then always transitions to
  // NpcState.STATE_ATTACK2
  // By immediately setting the state to NpcState.STATE_ATTACK2, it will make it be on the ground
  npc.State = NpcState.STATE_ATTACK2;

  // Make it have a poof of smoke like a normal boss
  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.POOF01,
    3, // 3 is the subtype that the Monstro poof has, so copy it
    npc.Position,
    Vector.Zero,
    null,
  );
}
