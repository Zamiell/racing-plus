import { evaluateCacheFunctions } from "./evaluateCacheFunctions";

export function main(player: EntityPlayer, cacheFlag: CacheFlag): void {
  const evaluateCacheFunction = evaluateCacheFunctions.get(cacheFlag);
  if (evaluateCacheFunction !== undefined) {
    evaluateCacheFunction(player);
  }
}
