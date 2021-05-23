import * as centerStart from "../features/mandatory/centerStart";
import * as removeKarma from "../features/mandatory/removeKarma";
import * as removeUselessPills from "../features/mandatory/removeUselessPills";
import * as saveFileCheck from "../features/mandatory/saveFileCheck";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as judasAddBomb from "../features/optional/quality/judasAddBomb";
import * as samsonDropHeart from "../features/optional/quality/samsonDropHeart";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import g from "../globals";
import GlobalsRun from "../types/GlobalsRun";
import * as postGameStartedContinued from "./postGameStartedContinued";
import * as postNewLevel from "./postNewLevel";

export function main(isContinued: boolean): void {
  const startSeedString = g.seeds.GetStartSeedString();
  const isaacFrameCount = Isaac.GetFrameCount();

  Isaac.DebugString(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  setSeeds();

  // Make sure that the MinimapAPI is enabled (we may have disabled it in a previous run)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  if (isContinued) {
    postGameStartedContinued.main();
    return;
  }

  // Initialize run-based variables
  g.run = new GlobalsRun();

  // Check for errors that should prevent the Racing+ mod from doing anything
  if (checkCorruptMod() || saveFileCheck.isNotFullyUnlocked()) {
    return;
  }

  // Mandatory features
  removeKarma.postGameStarted();
  removeUselessPills.postGameStarted();
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  centerStart.postGameStarted();

  // Optional features - Major
  startWithD6.postGameStarted();

  // Optional features - Quality of Life
  samsonDropHeart.postGameStarted();
  judasAddBomb.postGameStarted();
  showEdenStartingItems.postGameStarted();

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}

function setSeeds() {
  // We may have had the Curse of the Unknown seed enabled in a previous run,
  // so ensure that it is removed
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // We need to disable achievements so that the R+ sprite shows above the stats on the left side of
  // the screen
  // We want the R+ sprite to display on all runs so that the "1st" sprite has somewhere to go
  // The easiest way to disable achievements without affecting gameplay is to enable the easter egg
  // that disables Curse of Darkness
  // (this has no effect since all curses are removed in the "PostCurseEval" callback anyway)
  g.seeds.AddSeedEffect(SeedEffect.SEED_PREVENT_CURSE_DARKNESS);
}

// If Racing+ is turned on from the mod menu and then the user immediately tries to play,
// it won't work properly; some things like boss cutscenes will still be enabled
// In order to fix this, the game needs to be completely restarted
// One way to detect this corrupted state is to get how many frames there are
// in the currently loaded boss cutscene animation file (located at "gfx/ui/boss/versusscreen.anm2")
// Racing+ removes boss cutscenes, so this value should be 0
// This function returns true if the PostGameStarted callback should halt
function checkCorruptMod() {
  const sprite = Sprite();
  sprite.Load("gfx/ui/boss/versusscreen.anm2", true);
  sprite.SetFrame("Scene", 0);
  sprite.SetLastFrame();
  const lastFrame = sprite.GetFrame();
  if (lastFrame !== 0) {
    Isaac.DebugString(
      `Error: Corrupted Racing+ instantiation detected. (The last frame of the "Scene" animation is frame ${lastFrame}.)`,
    );
    g.corrupted = true;
  }

  return g.corrupted;
}
