import * as streakText from "../features/mandatory/streakText";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    deadSeaScrolls,
    CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS, // 124
  );
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
