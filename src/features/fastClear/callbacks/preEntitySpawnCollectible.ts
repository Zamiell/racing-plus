import g from "../../../globals";
import { PickupVariantCustom } from "../../../types/enums";

export function main(subType: int): [EntityType | int, int, int, int] | null {
  if (!g.config.fastClear) {
    return null;
  }

  // Prevent the vanilla Polaroid and Negative from spawning
  // (Racing+ spawns those manually to speed up the Mom fight)
  if (
    g.run.fastClear.vanillaPhotosSpawning &&
    (subType === CollectibleType.COLLECTIBLE_POLAROID ||
      subType === CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    const photoText = CollectibleType.COLLECTIBLE_POLAROID
      ? "Polaroid"
      : "Negative";
    const text = `Preventing a vanilla ${photoText} from spawning.`;
    Isaac.DebugString(text);

    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  return null;
}
