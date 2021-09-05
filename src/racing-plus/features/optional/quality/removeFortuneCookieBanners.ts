import g from "../../../globals";
import { config } from "../../../modConfigMenu";

export function useItem(): void {
  const HUD = g.g.GetHUD();

  if (!config.removeFortuneCookieBanners) {
    return;
  }

  // The Fortune Cookie text is annoying and blocks gameplay,
  // so we want to remove it entirely
  // Racing+ removes the files that show the vanilla streak text
  // Thus, we can override the Fortune Cookie text by immediately showing normal streak text after a
  // Fortune Cookie use
  // However, this will only work if they do not have the "VanillaStreakText" mod enabled
  if (VanillaStreakText !== undefined) {
    return;
  }

  HUD.ShowItemText("");
}
