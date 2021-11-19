import { getHeartsUIWidth, getHUDOffsetVector } from "isaacscript-common";
import { VERSION } from "../../constants";
import g from "../../globals";
import {
  getNumSacrifices,
  shouldShowNumSacrifices,
} from "../optional/quality/showNumSacrifices";
import { shouldShowEndOfRunTextRace } from "../race/raceFinish";
import { shouldShowRaceID } from "../race/raceStart";
import { getNumVictoryLaps, shouldShowVictoryLaps } from "../race/victoryLap";
import { speedrunGetFinishedFrames } from "../speedrun/exported";
import {
  getAverageTimePerCharacter,
  inSpeedrun,
  isOnFinalCharacter,
  shouldShowEndOfRunTextSpeedrun,
} from "../speedrun/speedrun";
import { getRoomsEntered } from "../util/roomsEntered";

const STARTING_X = 55;
const STARTING_Y = 10;

export function postRender(): void {
  const seedString = g.seeds.GetStartSeedString();
  const HUDOffsetVector = getHUDOffsetVector();
  const heartsUIWidth = getHeartsUIWidth();

  // We want to place informational text for the player to the right of the heart containers
  // (which will depend on how many heart containers we have)
  const x = HUDOffsetVector.X + heartsUIWidth + STARTING_X;
  let y = STARTING_Y + HUDOffsetVector.Y;
  const lineLength = 15;

  const lines: string[] = [];
  if (shouldShowVictoryLaps()) {
    // Display the number of victory laps
    // (this should have priority over showing the seed)
    const victoryLaps = getNumVictoryLaps();
    lines.push(`Victory Lap #${victoryLaps}`);
  } else if (shouldShowEndOfRunTextSpeedrun() || shouldShowEndOfRunTextRace()) {
    // Show some run summary information
    // (it will be removed if they exit the room)
    lines.push(`R+ ${VERSION} - ${seedString}`);

    if (shouldShowEndOfRunTextSpeedrun()) {
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
  } else if (shouldShowNumSacrifices()) {
    lines.push(`Sacrifices: ${getNumSacrifices()}`);
  }

  for (const line of lines) {
    Isaac.RenderText(line, x, y, 2, 2, 2, 2);
    y += lineLength;
  }
}
