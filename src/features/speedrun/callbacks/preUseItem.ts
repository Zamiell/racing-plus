import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import * as preserveCheckpoint from "../preserveCheckpoint";
import { inSpeedrun } from "../speedrun";

// CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER (84)
export function weNeedToGoDeeper(
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

// CollectibleType.COLLECTIBLE_D6 (105)
export function d6(player: EntityPlayer): boolean | void {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCheckpoint.preUseItemD6(player);
}
