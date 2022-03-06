import { season2EvaluateCacheFlying } from "../season2/callbacks/evaluateCache";

// CacheFlag.CACHE_FLYING (1 << 7)
export function speedrunEvaluateCacheFlying(player: EntityPlayer): void {
  season2EvaluateCacheFlying(player);
}
