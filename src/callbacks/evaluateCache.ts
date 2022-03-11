import { evaluateCacheFunctions } from "./evaluateCacheFunctions";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, main);
}

function main(player: EntityPlayer, cacheFlag: CacheFlag) {
  const evaluateCacheFunction = evaluateCacheFunctions.get(cacheFlag);
  if (evaluateCacheFunction !== undefined) {
    evaluateCacheFunction(player);
  }
}
