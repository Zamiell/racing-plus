import { COLLECTIBLE_SPRITE_LAYER } from "../../../constants";
import g from "../../../globals";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_245_2020_custom.png";

export function postPickupInit(pickup: EntityPickup): void {
  if (!g.config.twentyTwenty) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_20_20) {
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH);
    sprite.LoadGraphics();
  }
}
