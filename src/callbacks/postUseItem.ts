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
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
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
    glowingHourGlass,
    CollectibleType.GLOWING_HOUR_GLASS, // 422
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
  battery9VoltSynergy.useItem(collectibleType, player, useFlags, activeSlot);

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
  seededTeleports.useItemTeleport();

  return undefined;
}

// CollectibleType.GLOWING_HOUR_GLASS (422)
function glowingHourGlass(
  _collectibleType: CollectibleType,
  _rng: RNG,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: ActiveSlot,
  _customVarData: int,
): boolean | undefined {
  freeDevilItem.postUseItemGlowingHourGlass();

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
  speedrunUseItem.voidItem();

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
  removeFortuneCookieBanners.useItemFortuneCookie();

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
  consistentAngels.useItemMeatCleaver();

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
  streakText.useItemLemegeton();

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
  removeGloballyBannedItems.useItemSpindownDice();

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
  return flipCustom.useItemFlipCustom(player);
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
  return debugItem.useItemDebug();
}
