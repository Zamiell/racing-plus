import g from "../../../../globals";

export function deleteDyingEntity(
  entityType: EntityType,
  entityVariant: int,
  deathAnimationLength: int,
): void {
  // This is for deleting entities that drop items
  // Entities drop after their death animation is completed,
  // so we want to delete them on the frame before that
  // (this cannot be in the PostNPCUpdate callback because that does not fire when an NPC is in the
  // death animation)
  const gameFrameCount = g.g.GetFrameCount();
  const entities = Isaac.FindByType(entityType, entityVariant);
  for (const entity of entities) {
    const data = entity.GetData();
    const killedFrame = data.killedFrame as int | undefined;
    if (
      killedFrame !== undefined &&
      gameFrameCount >= killedFrame + deathAnimationLength - 1
    ) {
      entity.Remove();
    }
  }
}
