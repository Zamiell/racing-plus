import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_245_2020_custom.png";

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.twentyTwenty) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_20_20) {
    setCollectibleSprite(pickup, CUSTOM_PNG_PATH);
  }
}
