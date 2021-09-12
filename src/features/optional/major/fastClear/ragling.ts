export function isRaglingDeathPatch(npc: EntityNPC): boolean {
  return (
    npc.Type === EntityType.ENTITY_RAGLING &&
    npc.Variant === RaglingVariant.RAG_MANS_RAGLING &&
    // They go to STATE_UNIQUE_DEATH when they are patches on the ground
    npc.State === NpcState.STATE_UNIQUE_DEATH
  );
}
