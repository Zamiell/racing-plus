import { CollectibleType } from "isaac-typescript-definitions";
import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_245_2020_custom.png";

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.twentyTwenty) {
    return;
  }

  if (pickup.SubType === CollectibleType.TWENTY_TWENTY) {
    setCollectibleSprite(pickup, CUSTOM_PNG_PATH);
  }
}
