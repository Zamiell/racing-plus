import * as preserveCheckpoint from "../preserveCheckpoint";
import { inSpeedrun } from "../speedrun";

// CollectibleType.D6 (105)
export function d6(player: EntityPlayer): boolean | void {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCheckpoint.preUseItemD6(player);
}

// CollectibleType.ETERNAL_D6 (609)
export function eternalD6(player: EntityPlayer): boolean | void {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCheckpoint.preUseItemEternalD6(player);
}
