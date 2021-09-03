import { getFinalFrameOfAnimation } from "isaacscript-common";

export function deleteDyingEntity(
  entityType: EntityType,
  entityVariant: int,
): void {
  // This is for deleting entities that drop items
  // Entities drop after their death animation is completed,
  // so we want to delete them on the frame before that
  // (this cannot be in the PostNPCUpdate callback because that does not fire when an NPC is in the
  // death animation)
  const entities = Isaac.FindByType(entityType, entityVariant);
  for (const entity of entities) {
    const sprite = entity.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation !== "Death") {
      continue;
    }
    const currentFrame = sprite.GetFrame();
    const finalFrame = getFinalFrameOfAnimation(sprite);
    if (currentFrame === finalFrame) {
      entity.BloodExplode();
      entity.Remove();
    }
  }
}
