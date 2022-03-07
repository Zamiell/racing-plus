// We want to place informational text for the player to the right of the heart containers
// (which will depend on how many heart containers we have)

import {
  getEffectiveStage,
  getHeartsUIWidth,
  getHUDOffsetVector,
  inStartingRoom,
  SECOND_IN_MILLISECONDS,
} from "isaacscript-common";
import { VERSION } from "../../constants";
import g from "../../globals";
import {
  getNumSacrifices,
  shouldShowNumSacrifices,
} from "../optional/quality/showNumSacrifices";
import { shouldShowRaceID } from "../race/raceStart";
import { inSeededRace, raceShouldShowEndOfRunText } from "../race/v";
import { getNumVictoryLaps, shouldShowVictoryLaps } from "../race/victoryLap";
import {
  speedrunGetFinishedFrames,
  speedrunShouldShowEndOfRunText,
} from "../speedrun/exported";
import {
  getAverageTimePerCharacter,
  inSpeedrun,
  isOnFinalCharacter,
} from "../speedrun/speedrun";
import { getRoomsEntered } from "../utils/roomsEntered";

const STARTING_X = 55;
const STARTING_Y = 10;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const hud = g.g.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  const seedString = g.seeds.GetStartSeedString();
  const HUDOffsetVector = getHUDOffsetVector();
  const heartsUIWidth = getHeartsUIWidth();

  const x = HUDOffsetVector.X + heartsUIWidth + STARTING_X;
  let y = HUDOffsetVector.Y + STARTING_Y;
  const lineLength = 15;

  const lines: string[] = [];
  if (shouldShowVictoryLaps()) {
    // Display the number of victory laps
    // (this should have priority over showing the seed)
    const victoryLaps = getNumVictoryLaps();
    lines.push(`Victory Lap #${victoryLaps}`);
  } else if (speedrunShouldShowEndOfRunText() || raceShouldShowEndOfRunText()) {
    // Show some run summary information
    // (it will be removed if they exit the room)
    lines.push(`R+ ${VERSION} - ${seedString}`);

    if (speedrunShouldShowEndOfRunText()) {
      lines.push(`Avg. time per char: ${getAverageTimePerCharacter()}`);
    } else {
      const roomsEntered = getRoomsEntered();
      lines.push(`Rooms entered: ${roomsEntered}`);
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
  } else if (shouldShowSeededRaceTimeOffset() && g.race.timeBehindLeader > 0) {
    const seconds = Math.round(
      g.race.timeBehindLeader / SECOND_IN_MILLISECONDS,
    );
    if (seconds > 0) {
      const suffix = seconds > 0 ? "s" : "";
      lines.push(`Behind by: ${seconds} second${suffix}`);
    }
  } else if (shouldShowNumSacrifices()) {
    lines.push(`Sacrifices: ${getNumSacrifices()}`);
  }

  for (const line of lines) {
    Isaac.RenderText(line, x, y, 2, 2, 2, 2);
    y += lineLength;
  }
}

function shouldShowSeededRaceTimeOffset() {
  return (
    inSeededRace() &&
    getEffectiveStage() > 1 &&
    inStartingRoom() &&
    g.r.IsFirstVisit() &&
    g.race.placeMid === 2 // Only show it when we are in second place
  );
}
