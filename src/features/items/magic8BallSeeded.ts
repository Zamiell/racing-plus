// ModCallbacks.MC_EVALUATE_CACHE (8)

import { repeat } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";

// CacheFlag.CACHE_SHOTSPEED ()
export function evaluateCacheShotSpeed(player: EntityPlayer): void {
  const numMagic8BallSeeded = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_8_BALL_SEEDED,
  );
  repeat(numMagic8BallSeeded, () => {
    player.ShotSpeed += 0.16;
  });
}
