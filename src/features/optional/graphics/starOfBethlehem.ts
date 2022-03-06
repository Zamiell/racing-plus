import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_651_starofbethlehem_custom.png";

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.starOfBethlehem) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_STAR_OF_BETHLEHEM) {
    setCollectibleSprite(pickup, CUSTOM_PNG_PATH);
  }
}
