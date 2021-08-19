import * as season1 from "../season1";

export function preUseItemWeNeedToGoDeeper(
  rng: RNG,
  player: EntityPlayer,
): boolean | void {
  return season1.preUseItemWeNeedToGoDeeper(rng, player);
}
