import * as magic8BallSeeded from "../features/items/magic8BallSeeded";
import * as nLuck from "../features/items/nLuck";
import * as sawblade from "../features/items/sawblade";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { speedrunEvaluateCacheFlying } from "../features/speedrun/callbacks/evaluateCache";

export const evaluateCacheFunctions = new Map<
  CacheFlag,
  (player: EntityPlayer) => void
>();

// 1 << 2
evaluateCacheFunctions.set(
  CacheFlag.CACHE_SHOTSPEED,
  (player: EntityPlayer) => {
    magic8BallSeeded.evaluateCacheShotSpeed(player);
  },
);

// 1 << 4
evaluateCacheFunctions.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugPowers.evaluateCacheSpeed(player);
});

// 1 << 6
evaluateCacheFunctions.set(
  CacheFlag.CACHE_TEARCOLOR,
  (player: EntityPlayer) => {
    changeCreepColor.evaluateCacheTearColor(player);
  },
);

// 1 << 7
evaluateCacheFunctions.set(CacheFlag.CACHE_FLYING, (player: EntityPlayer) => {
  speedrunEvaluateCacheFlying(player);
});

// 1 << 9
evaluateCacheFunctions.set(
  CacheFlag.CACHE_FAMILIARS,
  (player: EntityPlayer) => {
    sawblade.evaluateCacheFamiliars(player);
  },
);

// 1 << 10
evaluateCacheFunctions.set(CacheFlag.CACHE_LUCK, (player: EntityPlayer) => {
  nLuck.evaluateCacheLuck(player);
});
