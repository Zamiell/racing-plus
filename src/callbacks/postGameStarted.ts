import { log } from "isaacscript-common";
import * as centerStart from "../features/mandatory/centerStart";
import * as errors from "../features/mandatory/errors";
import * as removeKarma from "../features/mandatory/removeKarma";
import * as removeMercurius from "../features/mandatory/removeMercurius";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as streakText from "../features/mandatory/streakText";
import betterDevilAngelRoomsPostGameStarted from "../features/optional/major/betterDevilAngelRooms/callbacks/postGameStarted";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as judasAddBomb from "../features/optional/quality/judasAddBomb";
import * as samsonDropHeart from "../features/optional/quality/samsonDropHeart";
import showDreamCatcherItemPostGameStarted from "../features/optional/quality/showDreamCatcherItem/callbacks/postGameStarted";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as showPills from "../features/optional/quality/showPills";
import * as taintedKeeperMoney from "../features/optional/quality/taintedKeeperMoney";
import racePostGameStarted from "../features/race/callbacks/postGameStarted";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";

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
    return;
  }

  // Check for errors that should prevent the Racing+ mod from doing anything
  if (errors.check()) {
    return;
  }

  // Mandatory features
  removeMercurius.postGameStarted();
  removeKarma.postGameStarted();
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  centerStart.postGameStarted();
  streakText.postGameStarted();

  // Showing Eden starting items is a Quality of Life feature, but it must be performed before
  // race initialization because we need to find out what the passive item is before other items are
  // added on top
  showEdenStartingItems.postGameStarted();

  // Major features
  racePostGameStarted();
  startWithD6.postGameStarted();
  betterDevilAngelRoomsPostGameStarted();

  // Quality of life
  samsonDropHeart.postGameStarted();
  judasAddBomb.postGameStarted();
  taintedKeeperMoney.postGameStarted();
  showPills.postGameStarted();
  showDreamCatcherItemPostGameStarted();

  // Miscellaneous
  removePlaceholderItems();

  // Conditionally show a festive hat
  // (commented out if it is not currently a holiday)
  // g.p.AddNullCostume(NullItemID.ID_CHRISTMAS)
  // (this corresponds to "n016_Christmas.anm2" in the "costumes2.xml" file)
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

function removePlaceholderItems() {
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
}
