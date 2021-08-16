import { VERSION } from "../../constants";
import g from "../../globals";
import {
  getNumSacrifices,
  shouldShowNumSacrifices,
} from "../optional/quality/showNumSacrifices";
import { shouldShowEndOfRunTextRace } from "../race/raceFinish";
import { shouldShowRaceID } from "../race/raceStart";
import { getNumVictoryLaps, shouldShowVictoryLaps } from "../race/victoryLap";
import {
  getAverageTimePerCharacter,
  inSpeedrun,
  isOnFinalCharacter,
  shouldShowEndOfRunTextSpeedrun,
} from "../speedrun/speedrun";
import { speedrunGetFinishedFrames } from "../speedrun/v";

export function postRender(): void {
  const seedString = g.seeds.GetStartSeedString();

  // We want to place informational text for the player to the right of the heart containers
  // (which will depend on how many heart containers we have)
  const x = 55 + getHeartXOffset();
  let y = 10;
  const lineLength = 15;

  const lines: string[] = [];
  if (shouldShowVictoryLaps()) {
    // Display the number of victory laps
    // (this should have priority over showing the seed)
    lines.push(`Victory Lap #${getNumVictoryLaps()}`);
  } else if (shouldShowEndOfRunTextSpeedrun() || shouldShowEndOfRunTextRace()) {
    // Show some run summary information
    // (it will be removed if they exit the room)
    lines.push(`R+ ${VERSION} - ${seedString}`);

    if (shouldShowEndOfRunTextSpeedrun()) {
      lines.push(`Avg. time per char: ${getAverageTimePerCharacter()}`);
    } else {
      lines.push(`Rooms entered: ${g.run.roomsEntered}`);
    }

    // Draw a 3rd line to show the total frames
    if (!inSpeedrun() || isOnFinalCharacter()) {
      let frames: int;
      if (inSpeedrun()) {
        frames = speedrunGetFinishedFrames();
      } else {
        frames = g.raceVars.finishedFrames;
      }
      const seconds = Math.floor(frames / 60);
      lines.push(`${frames} frames (${seconds}s)`);
    }
  } else if (shouldShowRaceID()) {
    lines.push(`Race ID: ${g.race.raceID}`);
  } else if (shouldShowNumSacrifices()) {
    lines.push(`Sacrifices: ${getNumSacrifices()}`);
  }

  for (const line of lines) {
    Isaac.RenderText(line, x, y, 2, 2, 2, 2);
    y += lineLength;
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
