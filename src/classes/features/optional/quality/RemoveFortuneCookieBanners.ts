import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * The Fortune Cookie text is annoying and blocks gameplay, so we want to remove it entirely.
 * Racing+ removes the files that show the vanilla streak text. Thus, we can override the Fortune
 * Cookie text by immediately showing normal streak text after a Fortune Cookie use.
 */
export class RemoveFortuneCookieBanners extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveFortuneCookieBanners";

  // 3, 557
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.FORTUNE_COOKIE)
  postUseItemFortuneCookie(): boolean | undefined {
    // We can't abuse the HUD method if the player has the "VanillaStreakText" mod enabled.
    if (VanillaStreakText !== undefined) {
      return undefined;
    }

    const HUD = game.GetHUD();
    HUD.ShowItemText("");

    return undefined;
  }
}
