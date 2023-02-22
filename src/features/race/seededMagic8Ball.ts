import { CollectibleType } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { inSeededRace } from "./v";

const OLD_COLLECTIBLE_TYPE = CollectibleType.MAGIC_8_BALL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.MAGIC_8_BALL_SEEDED;

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (inSeededRace() && player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE);
  }
}
