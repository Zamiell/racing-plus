import { CollectibleType } from "isaac-typescript-definitions";
import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const PNG_DIRECTORY = "gfx/items/collectibles";
const CUSTOM_PNG_MAP: ReadonlyMap<CollectibleType, string> = new Map([
  [
    CollectibleType.DISTANT_ADMIRATION,
    "collectibles_057_distantadmiration_custom.png",
  ],
  [CollectibleType.FOREVER_ALONE, "collectibles_128_foreveralone_custom.png"],
  [CollectibleType.FRIEND_ZONE, "collectibles_364_friendzone_custom.png"],
]);

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  if (!config.flyItemSprites) {
    return;
  }

  const customSprite = CUSTOM_PNG_MAP.get(pickup.SubType);
  if (customSprite !== undefined) {
    setCollectibleSprite(pickup, `${PNG_DIRECTORY}/${customSprite}`);
  }
}
