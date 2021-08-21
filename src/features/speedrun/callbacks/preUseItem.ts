import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import { inSpeedrun } from "../speedrun";

export function preUseItemWeNeedToGoDeeper(
  rng: RNG,
  player: EntityPlayer,
): boolean | void {
  if (!inSpeedrun()) {
    return undefined;
  }

  return allowVanillaPathsInRepentanceChallenge.preUseItemWeNeedToGoDeeper(
    rng,
    player,
  );
}
