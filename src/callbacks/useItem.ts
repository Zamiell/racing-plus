import { debugFunction } from "../debugFunction";
import * as flipCustom from "../features/items/flipCustom";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as consistentAngels from "../features/optional/bosses/consistentAngels";
import * as battery9VoltSynergy from "../features/optional/bugfix/battery9VoltSynergy";
import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import * as speedrunUseItem from "../features/speedrun/callbacks/useItem";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_USE_ITEM, main);

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    teleport,
    CollectibleType.COLLECTIBLE_TELEPORT, // 44
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    voidItem,
    CollectibleType.COLLECTIBLE_VOID, // 477
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    fortuneCookie,
    CollectibleType.COLLECTIBLE_FORTUNE_COOKIE, // 557
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    meatCleaver,
    CollectibleType.COLLECTIBLE_MEAT_CLEAVER, // 631
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    lemegeton,
    CollectibleType.COLLECTIBLE_LEMEGETON, // 712
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    spindownDice,
    CollectibleType.COLLECTIBLE_SPINDOWN_DICE, // 723
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    useItemFlipCustom,
    CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM,
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    debugItem,
    CollectibleTypeCustom.COLLECTIBLE_DEBUG,
  );
}

function main(
  collectibleType: CollectibleType | int,
  _rng: RNG,
  player: EntityPlayer,
  useFlags: int,
  activeSlot: int,
  _customVarData: int,
): boolean | void {
  battery9VoltSynergy.useItem(collectibleType, player, useFlags, activeSlot);
}

// CollectibleType.COLLECTIBLE_TELEPORT (44)
function teleport() {
  seededTeleports.useItemTeleport();
}

// CollectibleType.COLLECTIBLE_VOID (477)
function voidItem() {
  speedrunUseItem.voidItem();
}

// CollectibleType.COLLECTIBLE_FORTUNE_COOKIE (557)
function fortuneCookie() {
  removeFortuneCookieBanners.useItemFortuneCookie();
}

// CollectibleType.COLLECTIBLE_MEAT_CLEAVER (631)
function meatCleaver() {
  consistentAngels.useItemMeatCleaver();
}

// CollectibleType.COLLECTIBLE_LEMEGETON (712)
function lemegeton() {
  streakText.useItemLemegeton();
}

// CollectibleType.COLLECTIBLE_SPINDOWN_DICE (723)
function spindownDice() {
  removeGloballyBannedItems.useItemSpindownDice();
}

// CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM
function useItemFlipCustom(
  _collectibleType: CollectibleType | int,
  _rng: RNG,
  player: EntityPlayer,
) {
  return flipCustom.useItemFlipCustom(player);
}

// CollectibleTypeCustom.COLLECTIBLE_DEBUG
function debugItem() {
  debugFunction();
  return true; // Display the "use" animation
}
