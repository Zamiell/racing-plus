import * as preserveCollectible from "../preserveCollectible";
import { inSpeedrun } from "../speedrun";

// CollectibleType.D6 (105)
export function d6(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemD6(player);
}

// CollectibleType.VOID (477)
export function voidCollectible(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemVoid(player);
}

// CollectibleType.MOVING_BOX (523)
export function movingBox(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemMovingBox(player);
}

// CollectibleType.ETERNAL_D6 (609)
export function eternalD6(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemEternalD6(player);
}

// CollectibleType.ABYSS (706)
export function abyss(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemAbyss(player);
}

// CollectibleType.SPINDOWN_DICE (723)
export function spindownDice(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemSpindownDice(player);
}
