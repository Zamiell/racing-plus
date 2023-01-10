import * as preserveCollectible from "../preserveCollectible";
import { season3PreUseItemGlowingHourGlass } from "../season3/callbacks/preUseItem";
import * as season4 from "../season4";
import { inSpeedrun } from "../speedrun";

// CollectibleType.D6 (105)
export function d6(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemD6(player);
}

// CollectibleType.DIPLOPIA (347)
export function diplopia(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return season4.preUseItemDiplopia(player);
}

// CollectibleType.GLOWING_HOUR_GLASS (422)
export function glowingHourGlass(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return season3PreUseItemGlowingHourGlass(player);
}

// CollectibleType.VOID (477)
export function voidCollectible(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return preserveCollectible.preUseItemVoid(player);
}

// CollectibleType.CROOKED_PENNY (485)
export function crookedPenny(player: EntityPlayer): boolean | undefined {
  if (!inSpeedrun()) {
    return undefined;
  }

  return season4.preUseItemCrookedPenny(player);
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
