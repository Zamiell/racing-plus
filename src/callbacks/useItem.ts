import * as removeFortuneCookieBanners from "../features/optional/quality/removeFortuneCookieBanners";
import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    fortuneCookie,
    CollectibleType.COLLECTIBLE_FORTUNE_COOKIE, // 557
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_ITEM,
    flip,
    CollectibleType.COLLECTIBLE_FLIP, // 711
  );
}

// CollectibleType.COLLECTIBLE_FORTUNE_COOKIE (557)
function fortuneCookie(): void {
  removeFortuneCookieBanners.useItem();
}

// CollectibleType.COLLECTIBLE_FLIP (711)
function flip(): void {
  const player = Isaac.GetPlayer();

  // The first time that Tainted Lazarus switches to Dead Tainted Lazarus,
  // we need to initialize all of the relevant player variables in the globals object
  if (!g.run.flippedAtLeastOnce) {
    g.run.flippedAtLeastOnce = true;
    initPlayerVariables(player, g.run);
  }
}
