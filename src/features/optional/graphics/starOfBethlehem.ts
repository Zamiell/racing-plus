import { COLLECTIBLE_SPRITE_LAYER } from "../../../constants";
import g from "../../../globals";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_651_starofbethlehem_custom.png"; // cspell:disable-line

export function postPickupInit(pickup: EntityPickup): void {
  if (!g.config.starOfBethlehem) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_STAR_OF_BETHLEHEM) {
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH);
    sprite.LoadGraphics();
  }
}
