import { CollectibleType } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { inSeededRace } from "./v";

const REPLACED_ITEM = CollectibleType.MAGIC_8_BALL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.MAGIC_8_BALL_SEEDED;

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (inSeededRace() && player.HasCollectible(REPLACED_ITEM)) {
    player.RemoveCollectible(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);
  }
}
