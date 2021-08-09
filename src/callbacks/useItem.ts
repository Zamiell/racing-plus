import debugFunction from "../debugFunction";
import * as streakText from "../features/mandatory/streakText";
import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import { CollectibleTypeCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    fortuneCookie,
    CollectibleType.COLLECTIBLE_FORTUNE_COOKIE, // 557
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    lemegeton,
    CollectibleType.COLLECTIBLE_LEMEGETON, // 712
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    debugItem,
    CollectibleTypeCustom.COLLECTIBLE_DEBUG,
  );
}

// CollectibleType.COLLECTIBLE_FORTUNE_COOKIE (557)
function fortuneCookie(): void {
  removeFortuneCookieBanners.useItem();
}

function lemegeton(): void {
  streakText.useItemLemegeton();
}

// CollectibleTypeCustom.COLLECTIBLE_DEBUG
function debugItem(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
