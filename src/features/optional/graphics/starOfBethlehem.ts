import { CollectibleType } from "isaac-typescript-definitions";
import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_651_starofbethlehem_custom.png";

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.starOfBethlehem) {
    return;
  }

  if (pickup.SubType === CollectibleType.STAR_OF_BETHLEHEM) {
    setCollectibleSprite(pickup, CUSTOM_PNG_PATH);
  }
}
