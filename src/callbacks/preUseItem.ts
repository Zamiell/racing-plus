import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { setCollectiblesRerolledForItemTracker } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { betterDevilAngelRoomsPreUseItemD4 } from "../features/optional/major/betterDevilAngelRooms/callbacks/preUseItem";
import { mod } from "../mod";

export function init(): void {
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
