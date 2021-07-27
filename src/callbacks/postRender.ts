import * as cache from "../cache";
import { VERSION } from "../constants";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as errors from "../features/mandatory/errors";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as runTimer from "../features/mandatory/runTimer";
import * as streakText from "../features/mandatory/streakText";
import * as fastReset from "../features/optional/major/fastReset";
import fastTravelPostRender from "../features/optional/major/fastTravel/callbacks/postRender";
import * as customConsole from "../features/optional/quality/customConsole";
import showDreamCatcherItemPostRender from "../features/optional/quality/showDreamCatcherItem/postRender";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import * as speedUpFadeIn from "../features/optional/quality/speedUpFadeIn";
import racePostRender, {
  checkRestartWrongRaceCharacter,
  checkRestartWrongRaceSeed,
} from "../features/race/callbacks/postRender";
import { checkRestartWrongSpeedrunCharacter } from "../features/speedrun/callbacks/postRender";
import * as speedrun from "../features/speedrun/speedrun";
import g from "../globals";
import { debugLog } from "../log";
import { consoleCommand } from "../misc";

export function main(): void {
  debugLog("MC_POST_RENDER", true);

  cache.updateAPIFunctions();

  if (checkRestart()) {
    debugLog("MC_POST_RENDER", false);
    return;
  }

  speedUpFadeIn.postRender();

  // If there are any errors, we can skip the remainder of this function
  if (errors.postRender()) {
    debugLog("MC_POST_RENDER", false);
    return;
  }

  // Mandatory features
  racingPlusSprite.postRender();
  detectSlideAnimation.postRender();
  streakText.postRender();
  runTimer.postRender();

  // Optional features - Major
  drawTopLeftText();
  racePostRender();
  fastTravelPostRender();
  fastReset.postRender();

  // Optional features - Quality of Life
  showEdenStartingItems.postRender();
  showDreamCatcherItemPostRender();
  showPills.postRender();
  showMaxFamiliars.postRender();
  customConsole.postRender();

  debugLog("MC_POST_RENDER", false);
}

// Conditionally restart the game
// (e.g. if Easter Egg or character validation failed)
// (we can't do this in the "PostGameStarted" callback because the "restart" command will fail when
// the game is first loading)
function checkRestart() {
  if (!g.run.restart) {
    return false;
  }
  g.run.restart = false;

  if (checkRestartWrongRaceCharacter()) {
    return true;
  }

  if (checkRestartWrongRaceSeed()) {
    return true;
  }

  if (checkRestartWrongSpeedrunCharacter()) {
    return true;
  }

  // Since no special conditions apply, just do a normal restart
  consoleCommand("restart");
  return true;
}

function drawTopLeftText() {
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const seedString = g.seeds.GetStartSeedString();

  // We want to place informational text for the player to the right of the heart containers
  // (which will depend on how many heart containers we have)
  const x = 55 + getHeartXOffset();
  let y = 10;
  const lineLength = 15;

  if (g.config.clientCommunication && g.run.victoryLaps > 0) {
    // Display the number of victory laps
    // (this should have priority over showing the seed)
    const text = `Victory Lap #${g.run.victoryLaps}`;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  } else if (g.run.room.showEndOfRunText) {
    // Show some run summary information
    // (it will be removed if they exit the room)
    const firstLine = `R+ ${VERSION} - ${seedString}`;
    Isaac.RenderText(firstLine, x, y, 2, 2, 2, 2);

    y += lineLength;
    let secondLine: string;
    if (speedrun.inSpeedrun()) {
      secondLine = "Avg. time per char: unknown"; // ${speedrun.getAverageTimePerCharacter()}`; // TODO CHANGE TO FRAMES
    } else {
      secondLine = `Rooms entered: ${g.run.roomsEntered}`;
    }
    Isaac.RenderText(secondLine, x, y, 2, 2, 2, 2);

    // Draw a 3rd line to show the total frames
    if (!speedrun.inSpeedrun() || speedrun.isOnFinalCharacter()) {
      let frames: int;
      if (speedrun.inSpeedrun()) {
        frames = g.speedrun.finishedFrames;
      } else {
        frames = g.raceVars.finishedFrames;
      }
      const seconds = Math.floor(frames / 60);
      y += lineLength;
      const thirdLine = `${frames} frames (${seconds}s)`;
      Isaac.RenderText(thirdLine, x, y, 2, 2, 2, 2);
    }
  } else if (
    g.config.clientCommunication &&
    g.race.raceID !== -1 &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    Isaac.GetTime() - g.raceVars.startedTime <= 2000
  ) {
    // Only show it in the first two seconds of the race
    const text = `Race ID: ${g.race.raceID}`;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  } else if (
    g.config.showNumSacrifices &&
    roomType === RoomType.ROOM_SACRIFICE &&
    roomFrameCount > 0
  ) {
    const text = `Sacrifices: ${g.run.level.numSacrifices}`;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  }
}

function getHeartXOffset() {
  const curses = g.l.GetCurses();
  const player = Isaac.GetPlayer();
  const maxHearts = player.GetMaxHearts();
  const soulHearts = player.GetSoulHearts();
  const boneHearts = player.GetBoneHearts();
  const extraLives = player.GetExtraLives();

  const heartLength = 12; // This is how long each heart is on the UI in the upper left hand corner
  // (this is not in pixels, but in draw coordinates;
  // you can see that it is 13 pixels wide in the "ui_hearts.png" file)
  let combinedHearts = maxHearts + soulHearts + boneHearts * 2; // There are no half bone hearts
  if (combinedHearts > 12) {
    combinedHearts = 12; // After 6 hearts, it wraps to a second row
  }

  if (curses === LevelCurse.CURSE_OF_THE_UNKNOWN) {
    combinedHearts = 2;
  }

  let offset = (combinedHearts / 2) * heartLength;
  if (extraLives > 9) {
    offset += 20;
    if (player.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 6;
    }
  } else if (extraLives > 0) {
    offset += 16;
    if (player.HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR)) {
      offset += 4;
    }
  }

  return offset;
}
