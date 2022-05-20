import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";
import * as debug from "../features/items/debug";
import * as flipCustom from "../features/items/flipCustom";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as consistentAngels from "../features/optional/bosses/consistentAngels";
import * as battery9VoltSynergy from "../features/optional/bugfix/battery9VoltSynergy";
import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import * as speedrunUseItem from "../features/speedrun/callbacks/useItem";

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
    debugItem,
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
): boolean | void {
  battery9VoltSynergy.useItem(collectibleType, player, useFlags, activeSlot);
}

// CollectibleType.TELEPORT (44)
function teleport(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  seededTeleports.useItemTeleport();
}

// CollectibleType.VOID (477)
function voidItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  speedrunUseItem.voidItem();
}

// CollectibleType.FORTUNE_COOKIE (557)
function fortuneCookie(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  removeFortuneCookieBanners.useItemFortuneCookie();
}

// CollectibleType.MEAT_CLEAVER (631)
function meatCleaver(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  consistentAngels.useItemMeatCleaver();
}

// CollectibleType.LEMEGETON (712)
function lemegeton(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  streakText.useItemLemegeton();
}

// CollectibleType.SPINDOWN_DICE (723)
function spindownDice(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  removeGloballyBannedItems.useItemSpindownDice();
}

// CollectibleTypeCustom.FLIP_CUSTOM
function useItemFlipCustom(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  return flipCustom.useItemFlipCustom(player);
}

// CollectibleTypeCustom.DEBUG
function debugItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
) {
  return debug.useItemDebug();
}
