import g from "../../../globals";

export function useItem(): void {
  const HUD = g.g.GetHUD();

  // The Fortune Cookie text is annoying and blocks gameplay,
  // so we want to remove it entirely
  // Racing+ removes the files that show the vanilla streak text
  // Thus, we can override the Fortune Cookie text by immediately showing normal streak text after a
  // Fortune Cookie use
  // However, this will only work if they do not have the "VanillaStreakText" mod enabled
  if (VanillaStreakText || !g.config.removeFortuneCookieBanners) {
    return;
  }

  HUD.ShowItemText("");
}
