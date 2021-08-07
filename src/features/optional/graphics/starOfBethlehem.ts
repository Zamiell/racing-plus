import { COLLECTIBLE_SPRITE_LAYER } from "../../../constants";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_651_starofbethlehem_custom.png"; // cspell:disable-line

export function postPickupInit(pickup: EntityPickup): void {
  if (!config.starOfBethlehem) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_STAR_OF_BETHLEHEM) {
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH);
    sprite.LoadGraphics();
  }
}
