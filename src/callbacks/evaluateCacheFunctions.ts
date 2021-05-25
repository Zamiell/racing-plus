import * as fastClearEvaluateCache from "../features/optional/major/fastClear/callbacks/evaluateCache";
import g from "../globals";

const functionMap = new Map<CacheFlag, (player: EntityPlayer) => void>();
export default functionMap;

// 1 << 1
functionMap.set(CacheFlag.CACHE_FIREDELAY, (player: EntityPlayer) => {
  fastClearEvaluateCache.fireDelay(player);
});

// 1 << 4
functionMap.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugSpeed(player);
});

function debugSpeed(player: EntityPlayer) {
  if (g.run.debugSpeed) {
    player.MoveSpeed = 2;
  }
}
