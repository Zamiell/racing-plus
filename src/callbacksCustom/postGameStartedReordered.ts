import {
  game,
  getCharacterName,
  log,
  ModCallbackCustom,
} from "isaacscript-common";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import * as fireworks from "../features/mandatory/fireworks";
import * as seededDrops from "../features/mandatory/seededDrops";
import * as seededFloors from "../features/mandatory/seededFloors";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import * as streakText from "../features/mandatory/streakText";
import { betterDevilAngelRoomsPostGameStarted } from "../features/optional/major/betterDevilAngelRooms/callbacks/postGameStarted";
import { fastTravelPostGameStartedContinued } from "../features/optional/major/fastTravel/callbacks/postGameStartedContinued";
import { showDreamCatcherItemPostGameStarted } from "../features/optional/quality/showDreamCatcherItem/callbacks/postGameStarted";
import { racePostGameStarted } from "../features/race/callbacks/postGameStarted";
import { speedrunPostGameStarted } from "../features/speedrun/callbacks/postGameStarted";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    main,
    undefined,
  );
}

function main(isContinued: boolean) {
  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
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

  // Mandatory
  seededDrops.postGameStarted();
  seededFloors.postGameStarted();
  streakText.postGameStarted();
  seededGBBug.postGameStarted();
  fireworks.postGameStarted();

  // Major
  racePostGameStarted();
  speedrunPostGameStarted();
  betterDevilAngelRoomsPostGameStarted();

  // QoL
  showDreamCatcherItemPostGameStarted();
}

function postGameStartedContinued() {
  fastTravelPostGameStartedContinued();
}
