import { COLLECTIBLE_SPRITE_LAYER } from "../../../constants";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_245_2020_custom.png";

export function postPickupInit(pickup: EntityPickup): void {
  if (!config.twentyTwenty) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_20_20) {
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH);
    sprite.LoadGraphics();
  }
}
