import {
  CacheFlag,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { inSeededRace } from "../../../../features/race/v";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const OLD_COLLECTIBLE_TYPE = CollectibleType.MAGIC_8_BALL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.MAGIC_8_BALL_SEEDED;

export class Magic8BallSeeded extends MandatoryModFeature {
  // 8, 1 << 2
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.SHOT_SPEED)
  evaluateCacheShotSpeed(player: EntityPlayer): void {
    const numMagic8BallSeeded = player.GetCollectibleNum(
      CollectibleTypeCustom.MAGIC_8_BALL_SEEDED,
    );
    repeat(numMagic8BallSeeded, () => {
      player.ShotSpeed += 0.16;
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (inSeededRace() && player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)) {
      player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
      player.AddCollectible(NEW_COLLECTIBLE_TYPE);
    }
  }
}
