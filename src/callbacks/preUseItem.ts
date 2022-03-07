import { setCollectiblesRerolledForItemTracker } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { betterDevilAngelRoomsPreUseItemD4 } from "../features/optional/major/betterDevilAngelRooms/callbacks/preUseItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as speedrunPreUseItem from "../features/speedrun/callbacks/preUseItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    d6,
    CollectibleType.COLLECTIBLE_D6, // 105
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    deadSeaScrolls,
    CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS, // 124
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    d100,
    CollectibleType.COLLECTIBLE_D100, // 283
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    d4,
    CollectibleType.COLLECTIBLE_D4, // 284
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    eternalD6,
    CollectibleType.COLLECTIBLE_ETERNAL_D6, // 609
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_USE_ITEM,
    flip,
    CollectibleType.COLLECTIBLE_FLIP, // 711
  );
}

// CollectibleType.COLLECTIBLE_D6 (105)
function d6(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: int,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  return speedrunPreUseItem.d6(player);
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

function d100() {
  setCollectiblesRerolledForItemTracker();
}

// CollectibleType.COLLECTIBLE_D4 (284)
function d4() {
  betterDevilAngelRoomsPreUseItemD4();
  setCollectiblesRerolledForItemTracker();
}

// CollectibleType.COLLECTIBLE_ETERNAL_D6 (609)
function eternalD6(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: int,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  return speedrunPreUseItem.eternalD6(player);
}

// CollectibleType.COLLECTIBLE_FLIP (711)
function flip(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  useFlags: int,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  startWithD6.preUseItemFlip(player, useFlags);
}
