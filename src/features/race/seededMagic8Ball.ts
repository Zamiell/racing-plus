import { removeCollectibleFromItemTracker } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { inSeededRace } from "./util";

const REPLACED_ITEM = CollectibleType.COLLECTIBLE_MAGIC_8_BALL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.COLLECTIBLE_MAGIC_8_BALL_SEEDED;

// CollectibleType.COLLECTIBLE_MAGIC_8_BALL (194)
export function postItemPickupMagic8Ball(player: EntityPlayer): void {
  if (inSeededRace() && player.HasCollectible(REPLACED_ITEM)) {
    player.RemoveCollectible(REPLACED_ITEM);
    removeCollectibleFromItemTracker(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);
  }
}
