import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";
import * as debugItem from "../features/items/debugItem";
import * as flipCustom from "../features/items/flipCustom";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as consistentAngels from "../features/optional/bosses/consistentAngels";
import * as battery9VoltSynergy from "../features/optional/bugfix/battery9VoltSynergy";
import * as displayExpansionPack from "../features/optional/quality/displayExpansionPack";
import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import * as speedrunUseItem from "../features/speedrun/callbacks/postUseItem";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_USE_ITEM, main);

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    teleport,
    CollectibleType.TELEPORT, // 44
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    voidItem,
    CollectibleType.VOID, // 477
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    fortuneCookie,
    CollectibleType.FORTUNE_COOKIE, // 557
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    meatCleaver,
    CollectibleType.MEAT_CLEAVER, // 631
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    lemegeton,
    CollectibleType.LEMEGETON, // 712
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    spindownDice,
    CollectibleType.SPINDOWN_DICE, // 723
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    useItemFlipCustom,
    CollectibleTypeCustom.FLIP_CUSTOM,
  );

  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    debug,
    CollectibleTypeCustom.DEBUG,
  );
}

function main(
  collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  battery9VoltSynergy.postUseItem(
    collectibleType,
    player,
    useFlags,
    activeSlot,
  );
  displayExpansionPack.postUseItem(collectibleType, player, useFlags);

  return undefined;
}

// CollectibleType.TELEPORT (44)
function teleport(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  seededTeleports.postUseItemTeleport();

  return undefined;
}

// CollectibleType.VOID (477)
function voidItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  speedrunUseItem.postUseItemVoid();

  return undefined;
}

// CollectibleType.FORTUNE_COOKIE (557)
function fortuneCookie(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  removeFortuneCookieBanners.postUseItemFortuneCookie();

  return undefined;
}

// CollectibleType.MEAT_CLEAVER (631)
function meatCleaver(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  consistentAngels.postUseItemMeatCleaver();

  return undefined;
}

// CollectibleType.LEMEGETON (712)
function lemegeton(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  streakText.postUseItemLemegeton();

  return undefined;
}

// CollectibleType.SPINDOWN_DICE (723)
function spindownDice(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  removeGloballyBannedItems.postUseItemSpindownDice();

  return undefined;
}

// CollectibleTypeCustom.FLIP_CUSTOM
function useItemFlipCustom(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  return flipCustom.postUseItemFlipCustom(player);
}

// CollectibleTypeCustom.DEBUG
function debug(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  return debugItem.postUseItemDebug();
}
