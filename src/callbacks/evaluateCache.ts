import { getFireDelay, getTearsStat } from "isaacscript-common";
import evaluateCacheFunctions from "./evaluateCacheFunctions";

export function main(player: EntityPlayer, cacheFlag: CacheFlag): void {
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    addTearsStat(player, 0.7);
  }

  const evaluateCacheFunction = evaluateCacheFunctions.get(cacheFlag);
  if (evaluateCacheFunction !== undefined) {
    evaluateCacheFunction(player);
  }
}

/**
 * Converts the specified amount of tears stat into MaxFireDelay and adds it to the player. This
 * function should only be used inside the EvaluateCache callback.
 */
export function addTearsStat(player: EntityPlayer, tearsStat: float): void {
  const existingTearsStat = getTearsStat(player.MaxFireDelay);
  const newTearsStat = existingTearsStat + tearsStat;
  const newMaxFireDelay = getFireDelay(newTearsStat);
  player.MaxFireDelay = newMaxFireDelay;
}
