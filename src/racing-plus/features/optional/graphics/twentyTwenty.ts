import { setCollectibleSprite } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const CUSTOM_PNG_PATH =
  "gfx/items/collectibles/collectibles_245_2020_custom.png";

export function postPickupInit(pickup: EntityPickup): void {
  if (!config.twentyTwenty) {
    return;
  }

  if (pickup.SubType === CollectibleType.COLLECTIBLE_20_20) {
    setCollectibleSprite(pickup, CUSTOM_PNG_PATH);
  }
}
