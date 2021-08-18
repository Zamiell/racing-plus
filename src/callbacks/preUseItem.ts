import * as streakText from "../features/mandatory/streakText";
import * as speedrunPreUseItem from "../features/speedrun/callbacks/preUseItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    weNeedToGoDeeper,
    CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER, // 84
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    deadSeaScrolls,
    CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS, // 124
  );
}

// CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER (84)
function weNeedToGoDeeper(_collectibleType: CollectibleType, _rng: RNG) {
  return speedrunPreUseItem.preUseItemWeNeedToGoDeeper(_rng);
}

// CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS (124)
function deadSeaScrolls(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: int,
  activeSlot: ActiveSlot,
  _customVarData: int,
) {
  return streakText.preUseItemDeadSeaScrolls(player, activeSlot);
}
