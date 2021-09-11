import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const PNG_DIRECTORY = "gfx/items/collectibles";
const CUSTOM_PNG_MAP = new Map<CollectibleType, string>([
  [
    CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION,
    "collectibles_057_distantadmiration_custom.png", // cspell:disable-line
  ],
  [
    CollectibleType.COLLECTIBLE_FOREVER_ALONE,
    "collectibles_128_foreveralone_custom.png", // cspell:disable-line
  ],
  [
    CollectibleType.COLLECTIBLE_FRIEND_ZONE,
    "collectibles_364_friendzone_custom.png", // cspell:disable-line
  ],
]);

export function postPickupInit(pickup: EntityPickup): void {
  if (!config.flyItemSprites) {
    return;
  }

  const customSprite = CUSTOM_PNG_MAP.get(pickup.SubType);
  if (customSprite !== undefined) {
    setCollectibleSprite(pickup, `${PNG_DIRECTORY}/${customSprite}`);
  }
}
