import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const PNG_DIRECTORY = "gfx/items/collectibles";
const CUSTOM_PNG_MAP: ReadonlyMap<CollectibleType, string> = new Map([
  [
    CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION,
    "collectibles_057_distantadmiration_custom.png",
  ],
  [
    CollectibleType.COLLECTIBLE_FOREVER_ALONE,
    "collectibles_128_foreveralone_custom.png",
  ],
  [
    CollectibleType.COLLECTIBLE_FRIEND_ZONE,
    "collectibles_364_friendzone_custom.png",
  ],
]);

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.flyItemSprites) {
    return;
  }

  const customSprite = CUSTOM_PNG_MAP.get(pickup.SubType);
  if (customSprite !== undefined) {
    setCollectibleSprite(pickup, `${PNG_DIRECTORY}/${customSprite}`);
  }
}
