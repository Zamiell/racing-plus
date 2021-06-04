// cspell:disable-next-line
// For testing, a seed with Monstro on Basement 1 is: WZVC T7V1

import g from "../../../../globals";

export function deleteDyingEntity(
  entityType: EntityType,
  entityVariant: int,
  deathAnimationLength: int,
): void {
  // This is for deleting entities that drop items
  // We want to delete the entity on the frame before they drop the item
  // (this cannot be in the NPCUpdate callback because that does not fire when an NPC is in the
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

export function getItemDropPosition(npc: EntityNPC): Vector {
  // By default, spawn the item drop exactly where the NPC dies
  // But account for if it would overlap with a grid entity
  const gridIndex = g.r.GetGridIndex(npc.Position);
  const gridEntity = g.r.GetGridEntity(gridIndex);

  return gridEntity === null
    ? npc.Position
    : g.r.FindFreePickupSpawnPosition(npc.Position);
}
