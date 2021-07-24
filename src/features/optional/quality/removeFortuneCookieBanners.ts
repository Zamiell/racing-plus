export function useItem(): void {
  const hud = g.g.GetHUD();

  // This overrides the fortune cookie banner
  if (!VanillaStreakText) {
    hud.ShowItemText("");
  }
}
