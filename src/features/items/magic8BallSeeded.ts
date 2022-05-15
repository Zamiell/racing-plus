import { repeat } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.SHOT_SPEED (1 << 2)
export function evaluateCacheShotSpeed(player: EntityPlayer): void {
  const numMagic8BallSeeded = player.GetCollectibleNum(
    CollectibleTypeCustom.MAGIC_8_BALL_SEEDED,
  );
  repeat(numMagic8BallSeeded, () => {
    player.ShotSpeed += 0.16;
  });
}
