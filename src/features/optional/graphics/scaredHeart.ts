import { HeartSubType } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.HEART (10)
export function postPickupInitHeart(pickup: EntityPickup): void {
  if (!config.scaredHeart) {
    return;
  }

  if (pickup.SubType !== HeartSubType.SCARED) {
    return;
  }

  const sprite = pickup.GetSprite();
  const animation = sprite.GetAnimation();
  sprite.Load("gfx/005.020_scared heart custom.anm2", true);
  sprite.Play(animation, true);
}
