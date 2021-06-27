import * as centerStart from "../features/mandatory/centerStart";
import * as removeKarma from "../features/mandatory/removeKarma";
import * as removeMercurius from "../features/mandatory/removeMercurius";
import * as saveFileCheck from "../features/mandatory/saveFileCheck";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as judasAddBomb from "../features/optional/quality/judasAddBomb";
import * as samsonDropHeart from "../features/optional/quality/samsonDropHeart";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as taintedKeeperMoney from "../features/optional/quality/taintedKeeperMoney";
import * as racePostGameStarted from "../features/race/callbacks/postGameStarted";
import g from "../globals";
import log from "../log";
import { getPlayers } from "../misc";
import * as saveDat from "../saveDat";
import { CollectibleTypeCustom, SaveFileState } from "../types/enums";
import GlobalsRun from "../types/GlobalsRun";
import * as postNewLevel from "./postNewLevel";

export function main(isContinued: boolean): void {
  const startSeedString = g.seeds.GetStartSeedString();
  const isaacFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  setSeeds();

  // Make sure that the MinimapAPI is enabled (we may have disabled it in a previous run)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  if (isContinued) {
    continued();
    return;
  }

  // Initialize run-based variables
  g.run = new GlobalsRun(getPlayers());

  // Check for errors that should prevent the Racing+ mod from doing anything
  if (isCorruptMod() || !saveFileCheck.isFullyUnlocked()) {
    return;
  }

  // Mandatory features
  removeMercurius.postGameStarted();
  removeKarma.postGameStarted();
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  centerStart.postGameStarted();

  // Optional features - Major
  racePostGameStarted.main();
  startWithD6.postGameStarted();

  // Optional features - Quality of Life
  samsonDropHeart.postGameStarted();
  judasAddBomb.postGameStarted();
  taintedKeeperMoney.postGameStarted();
  showEdenStartingItems.postGameStarted();

  // Remove the 3 placeholder items if this is not a diversity race
  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.format !== "diversity"
  ) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
    );
  }

  // Conditionally show a festive hat
  // (commented out if it is not currently a holiday)
  // g.p.AddNullCostume(NullItemID.ID_CHRISTMAS)
  // (this corresponds to "n016_Christmas.anm2" in the "costumes2.xml" file)

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}

function setSeeds() {
  // We may have had the Curse of the Unknown seed enabled in a previous run,
  // so ensure that it is removed
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // We make an "R+" sprite replace the "No Achievements" icon
  // We want this sprite to appear on all runs, so we need to disable achievements on all runs
  // The easiest way to do this without affecting gameplay is to enable an easter egg that prevents
  // a curse from appearing
  // (this will have no effect since all curses are removed in the "PostCurseEval" callback anyway)
  g.seeds.AddSeedEffect(SeedEffect.SEED_PREVENT_CURSE_DARKNESS);
}

export function continued(): void {
  saveDat.load();

  if (g.saveFile.state === SaveFileState.NotChecked) {
    // In order to determine if the user has a fully-unlocked save file, we need to restart the game
    // Since we are continuing a run, that would destroy their current progress
    // Defer the check until the next new run starts
    g.saveFile.state = SaveFileState.DeferredUntilNewRunBegins;
  }
}

// If Racing+ is turned on from the mod menu and then the user immediately tries to play,
// it won't work properly; some things like boss cutscenes will still be enabled
// In order to fix this, the game needs to be completely restarted
// One way to detect this corrupted state is to get how many frames there are in the currently
// loaded boss cutscene animation file (located at "gfx/ui/boss/versusscreen.anm2")
// Racing+ removes boss cutscenes, so this value should be 0
// This function returns true if the PostGameStarted callback should halt
function isCorruptMod() {
  const sprite = Sprite();
  sprite.Load("gfx/ui/boss/versusscreen.anm2", true);
  sprite.SetFrame("Scene", 0);
  sprite.SetLastFrame();
  const lastFrame = sprite.GetFrame();
  if (lastFrame !== 0) {
    log(
      `Error: Corrupted Racing+ instantiation detected. (The last frame of the "Scene" animation is frame ${lastFrame}.)`,
    );
    g.corrupted = true;
  }

  return g.corrupted;
}
