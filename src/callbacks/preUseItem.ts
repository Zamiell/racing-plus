import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { setCollectiblesRerolledForItemTracker } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { betterDevilAngelRoomsPreUseItemD4 } from "../features/optional/major/betterDevilAngelRooms/callbacks/preUseItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as speedrunPreUseItem from "../features/speedrun/callbacks/preUseItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    d6,
    CollectibleType.D6, // 105
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    deadSeaScrolls,
    CollectibleType.DEAD_SEA_SCROLLS, // 124
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    d100,
    CollectibleType.D100, // 283
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    d4,
    CollectibleType.D4, // 284
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    eternalD6,
    CollectibleType.ETERNAL_D6, // 609
  );

  mod.AddCallback(
    ModCallback.PRE_USE_ITEM,
    flip,
    CollectibleType.FLIP, // 711
  );
}

// CollectibleType.D6 (105)
function d6(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  return speedrunPreUseItem.d6(player);
}

// CollectibleType.DEAD_SEA_SCROLLS (124)
function deadSeaScrolls(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  return streakText.preUseItemDeadSeaScrolls(player, activeSlot);
}

// CollectibleType.D100 (283)
function d100(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  setCollectiblesRerolledForItemTracker();

  return undefined;
}

// CollectibleType.D4 (284)
function d4(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  betterDevilAngelRoomsPreUseItemD4();
  setCollectiblesRerolledForItemTracker();

  return undefined;
}

// CollectibleType.ETERNAL_D6 (609)
function eternalD6(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  return speedrunPreUseItem.eternalD6(player);
}

// CollectibleType.FLIP (711)
function flip(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  startWithD6.preUseItemFlip(player, useFlags);

  return undefined;
}
