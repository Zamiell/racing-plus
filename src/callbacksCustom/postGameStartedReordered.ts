import { log, ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as debugFunction from "../debugFunction";
import * as centerStart from "../features/mandatory/centerStart";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";
import * as errors from "../features/mandatory/errors";
import * as fireworks from "../features/mandatory/fireworks";
import * as modConfigNotify from "../features/mandatory/modConfigNotify";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import * as streakText from "../features/mandatory/streakText";
import * as fastAngels from "../features/optional/bosses/fastAngels";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as judasAddBomb from "../features/optional/characters/judasAddBomb";
import * as lostUseHolyCard from "../features/optional/characters/lostUseHolyCard";
import * as samsonDropHeart from "../features/optional/characters/samsonDropHeart";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import * as taintedKeeperMoney from "../features/optional/characters/taintedKeeperMoney";
import { extraStartingItemsPostGameStarted } from "../features/optional/gameplay/extraStartingItems/callbacks/postGameStarted";
import * as holidayHats from "../features/optional/graphics/holidayHats";
import * as hudOffsetFix from "../features/optional/graphics/hudOffsetFix";
import { betterDevilAngelRoomsPostGameStarted } from "../features/optional/major/betterDevilAngelRooms/callbacks/postGameStarted";
import { fastTravelPostGameStartedContinued } from "../features/optional/major/fastTravel/callbacks/postGameStartedContinued";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { showDreamCatcherItemPostGameStarted } from "../features/optional/quality/showDreamCatcherItem/callbacks/postGameStarted";
import { racePostGameStarted } from "../features/race/callbacks/postGameStarted";
import { speedrunPostGameStarted } from "../features/speedrun/callbacks/postGameStarted";
import g from "../globals";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GAME_STARTED_REORDERED,
    main,
  );
}

function main(isContinued: boolean) {
  const startSeedString = g.seeds.GetStartSeedString();
  const renderFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - Render frame: ${renderFrameCount} - Continued: ${isContinued}`,
  );

  // Make sure that the MinimapAPI is enabled (we may have disabled it in a previous run)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  // Features that need to run regardless of whether the run is continued or not
  disableMultiplayer.postGameStarted();

  if (isContinued) {
    postGameStartedContinued();
    return;
  }

  // Check for errors that should prevent the mod from doing anything
  if (errors.check()) {
    return;
  }

  // Mandatory
  racingPlusSprite.postGameStarted();
  modConfigNotify.postGameStarted();
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  centerStart.postGameStarted();
  streakText.postGameStarted();
  seededGBBug.postGameStarted();
  fireworks.postGameStarted();
  debugFunction.postGameStarted();

  // Showing Eden starting items is a Quality of Life feature, but it must be performed before
  // race initialization because we need to find out what the passive item is before other items are
  // added on top
  showEdenStartingItems.postGameStarted();

  // Major
  racePostGameStarted();
  speedrunPostGameStarted();
  startWithD6.postGameStarted();
  betterDevilAngelRoomsPostGameStarted();

  // Chars
  judasAddBomb.postGameStarted();
  samsonDropHeart.postGameStarted();
  lostUseHolyCard.postGameStarted();
  taintedKeeperMoney.postGameStarted();

  // Bosses
  fastAngels.postGameStarted();

  // Gameplay
  extraStartingItemsPostGameStarted();

  // QoL
  showDreamCatcherItemPostGameStarted();

  // GFX
  hudOffsetFix.postGameStarted();
  holidayHats.postGameStarted();

  // Features that need to be last
  // (this checks for items, so it has to be after all features that grant items)
  removeGloballyBannedItems.postGameStarted();
}

function postGameStartedContinued() {
  fastTravelPostGameStartedContinued();
  fastSatan.postGameStartedContinued();
}
