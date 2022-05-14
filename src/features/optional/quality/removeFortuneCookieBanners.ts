// The Fortune Cookie text is annoying and blocks gameplay, so we want to remove it entirely.
// Racing+ removes the files that show the vanilla streak text. Thus, we can override the Fortune
// Cookie text by immediately showing normal streak text after a Fortune Cookie use.

import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.FORTUNE_COOKIE (557)
export function useItemFortuneCookie(): void {
  const HUD = g.g.GetHUD();

  if (!config.removeFortuneCookieBanners) {
    return;
  }

  // We can't abuse the HUD method if the player has the "VanillaStreakText" mod enabled.
  if (VanillaStreakText !== undefined) {
    return;
  }

  HUD.ShowItemText("");
}
