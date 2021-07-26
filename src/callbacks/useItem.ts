import * as postEsauJr from "../customCallbacks/postEsauJr";
import * as postFlip from "../customCallbacks/postFlip";
import debugFunction from "../debugFunction";
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
    esauJr,
    CollectibleType.COLLECTIBLE_ESAU_JR, // 703
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    flip,
    CollectibleType.COLLECTIBLE_FLIP, // 711
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

// CollectibleType.COLLECTIBLE_ESAU_JR (703)
function esauJr(): void {
  postEsauJr.useItem();
}

// CollectibleType.COLLECTIBLE_FLIP (711)
function flip(): void {
  postFlip.useItem();
}

function debugItem(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
