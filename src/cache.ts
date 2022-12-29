import { game } from "isaacscript-common";
import { g } from "./globals";

export function updateCachedAPIFunctions(): void {
  // Update some cached API functions. If we don't do this on every frame, the game can crash.
  g.l = game.GetLevel();
  g.r = game.GetRoom();
  g.seeds = game.GetSeeds();
  g.itemPool = game.GetItemPool();
}
