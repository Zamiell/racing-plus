import * as preserveCheckpoint from "../preserveCheckpoint";
import * as season4 from "../season4";
import { inSpeedrun } from "../speedrun";

// CollectibleType.D6 (105)
export function d6(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  let value: boolean | undefined;

  value = preserveCheckpoint.preUseItemD6(player);
  if (value !== undefined) {
    return value;
  }

  value = season4.preUseItemD6(player);
  if (value !== undefined) {
    return value;
  }

  return undefined;
}

// CollectibleType.MOVING_BOX (523)
export function movingBox(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  let value: boolean | undefined;

  value = preserveCheckpoint.preUseItemMovingBox(player);
  if (value !== undefined) {
    return value;
  }

  value = season4.preUseItemMovingBox(player);
  if (value !== undefined) {
    return value;
  }

  return undefined;
}

// CollectibleType.ETERNAL_D6 (609)
export function eternalD6(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  let value: boolean | undefined;

  value = preserveCheckpoint.preUseItemEternalD6(player);
  if (value !== undefined) {
    return value;
  }

  value = season4.preUseItemEternalD6(player);
  if (value !== undefined) {
    return value;
  }

  return undefined;
}
