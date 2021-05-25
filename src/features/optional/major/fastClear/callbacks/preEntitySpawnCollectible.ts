import g from "../../../../../globals";
import { log } from "../../../../../misc";
import { PickupVariantCustom } from "../../../../../types/enums";

export function main(subType: int): [EntityType | int, int, int, int] | null {
  if (!g.config.fastClear) {
    return null;
  }

  const returnArray = preventVanillaPhotos(subType);
  if (returnArray !== null) {
    return returnArray;
  }

  return null;
}

// We need to prevent the vanilla Polaroid and Negative from spawning because Racing+ spawns those
// manually to speed up the Mom fight
function preventVanillaPhotos(
  subType: int,
): [EntityType | int, int, int, int] | null {
  if (
    g.run.fastClear.vanillaPhotosSpawning &&
    (subType === CollectibleType.COLLECTIBLE_POLAROID ||
      subType === CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    const photoText = CollectibleType.COLLECTIBLE_POLAROID
      ? "Polaroid"
      : "Negative";
    const text = `Preventing a vanilla ${photoText} from spawning.`;
    log(text);

    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  return null;
}
