import { removeCollectibleFromItemTracker } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { inSeededRace } from "./v";

const REPLACED_ITEM = CollectibleType.COLLECTIBLE_MAGIC_8_BALL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.COLLECTIBLE_MAGIC_8_BALL_SEEDED;

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// CollectibleType.COLLECTIBLE_MAGIC_8_BALL (194)
export function postItemPickupMagic8Ball(player: EntityPlayer): void {
  if (inSeededRace() && player.HasCollectible(REPLACED_ITEM)) {
    player.RemoveCollectible(REPLACED_ITEM);
    removeCollectibleFromItemTracker(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);
  }
}
