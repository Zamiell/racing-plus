import { getCharacterName, log, ModCallbackCustom } from "isaacscript-common";
import { hasErrors } from "../classes/features/mandatory/checkErrors/v";
import * as centerStart from "../features/mandatory/centerStart";
import * as fireworks from "../features/mandatory/fireworks";
import * as modConfigNotify from "../features/mandatory/modConfigNotify";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import * as seededGlitterBombs from "../features/mandatory/seededGlitterBombs";
import * as streakText from "../features/mandatory/streakText";
import * as fastAngels from "../features/optional/bosses/fastAngels";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as judasAddBomb from "../features/optional/characters/judasAddBomb";
import * as lostUseHolyCard from "../features/optional/characters/lostUseHolyCard";
import * as samsonDropHeart from "../features/optional/characters/samsonDropHeart";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import * as taintedKeeperMoney from "../features/optional/characters/taintedKeeperMoney";
import { extraStartingItemsPostGameStarted } from "../features/optional/gameplay/extraStartingItems/callbacks/postGameStarted";
import * as hudOffsetFix from "../features/optional/graphics/hudOffsetFix";
import { betterDevilAngelRoomsPostGameStarted } from "../features/optional/major/betterDevilAngelRooms/callbacks/postGameStarted";
import { fastTravelPostGameStartedContinued } from "../features/optional/major/fastTravel/callbacks/postGameStartedContinued";
import { showDreamCatcherItemPostGameStarted } from "../features/optional/quality/showDreamCatcherItem/callbacks/postGameStarted";
import { racePostGameStarted } from "../features/race/callbacks/postGameStarted";
import { speedrunPostGameStarted } from "../features/speedrun/callbacks/postGameStarted";
import { g } from "../globals";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    main,
    undefined,
  );
}

function main(isContinued: boolean) {
  const startSeedString = g.seeds.GetStartSeedString();
  const renderFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const characterName = getCharacterName(character);

  log(
    `MC_POST_GAME_STARTED_REORDERED - Seed: ${startSeedString} - Render frame: ${renderFrameCount} - Continued: ${isContinued} - Character: ${characterName} (${character})`,
  );

  // Make sure that the MinimapAPI is enabled. (We may have disabled it in a previous run.)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  if (isContinued) {
    postGameStartedContinued();
    return;
  }

  // Check for errors that should prevent the mod from doing anything.
  if (hasErrors()) {
    return;
  }

  // Handle features that need to be first. (This removes items from pools, so it needs to be before
  // giving items that can spawn other items (like Marbles).
  removeGloballyBannedItems.postGameStartedFirst();

  // Mandatory
  modConfigNotify.postGameStarted();
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  centerStart.postGameStarted();
  streakText.postGameStarted();
  seededGlitterBombs.postGameStarted();
  seededGBBug.postGameStarted();
  fireworks.postGameStarted();

  // Showing Eden starting items is a quality of life feature, but it must be performed before race
  // initialization because we need to find out what the passive item is before other items are
  // added on top.
  showEdenStartingItems.postGameStarted();

  // Major
  racePostGameStarted();
  speedrunPostGameStarted();
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

  // Handle features that need to be last. (This checks for items, so it has to be after all
  // features that grant items.)
  removeGloballyBannedItems.postGameStartedLast();
}

function postGameStartedContinued() {
  fastTravelPostGameStartedContinued();
  fastSatan.postGameStartedContinued();
}
