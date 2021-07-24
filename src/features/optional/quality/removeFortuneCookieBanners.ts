export function postItemUse(): void {
  const hud = Game().GetHUD();
  // This overrides the fortune cookie banner
  if (!VanillaStreakText) {
    hud.ShowItemText("");
  }
}
