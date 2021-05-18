import extraStartingHealth from "../features/extraStartingHealth";
import judasAddBomb from "../features/judasAddBomb";
import samsonDropHeart from "../features/samsonDropHeart";
import startWithD6 from "../features/startWithD6";
import g from "../globals";
import GlobalsRun from "../types/GlobalsRun";
import * as postNewLevel from "./postNewLevel";

export function main(): void {
  const startSeedString = g.seeds.GetStartSeedString();
  const isaacFrameCount = Isaac.GetFrameCount();

  Isaac.DebugString(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  // Initialize run-based variables
  g.run = new GlobalsRun();

  // Features
  startWithD6();
  extraStartingHealth();
  judasAddBomb();
  samsonDropHeart();

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}
