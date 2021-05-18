import g from "./globals";

export function updateAPIFunctions(): void {
  // Update some cached API functions
  // If we don't do this, the game can crash
  g.l = g.g.GetLevel();
  g.r = g.g.GetRoom();
  const player = Isaac.GetPlayer();
  if (player !== null) {
    g.p = player;
  }
  g.seeds = g.g.GetSeeds();
  g.itemPool = g.g.GetItemPool();
}
