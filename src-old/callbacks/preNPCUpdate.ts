import g from "../globals";

// EntityType.ENTITY_MOMS_HAND (213)
// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function hand(npc: EntityNPC): boolean | null {
  if (g.run.room.handPositions.get(npc.Index) === undefined) {
    const position = Vector(npc.Position.X, npc.Position.Y);
    g.run.room.handPositions.set(npc.Index, position);
  }

  if (npc.GetSprite().IsPlaying("Appear")) {
    return true;
  }

  return null;
}
