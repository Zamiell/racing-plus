import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getHeartsUIWidth,
  getHUDOffsetVector,
  inStartingRoom,
  onFirstFloor,
  RENDER_FRAMES_PER_SECOND,
  SECOND_IN_MILLISECONDS,
} from "isaacscript-common";
import { VERSION } from "../../../../constants";
import { shouldShowRaceID } from "../../../../features/race/raceStart";
import {
  inSeededRace,
  raceShouldShowEndOfRunText,
} from "../../../../features/race/v";
import {
  getNumVictoryLaps,
  shouldShowVictoryLaps,
} from "../../../../features/race/victoryLap";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { inSpeedrun } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import {
  getNumSacrifices,
  shouldShowNumSacrifices,
} from "../../optional/quality/ShowNumSacrifices";
import { isOnFinalCharacter } from "../../speedrun/characterProgress/v";
import {
  speedrunGetAverageTimePerCharacter,
  speedrunGetFinishedFrames,
  speedrunShouldShowEndOfRunText,
} from "../../speedrun/SpeedrunTimer";

const STARTING_X = 55;
const STARTING_Y = 10;

const SECONDS_TO_SHOW_CLIENT_MESSAGE_FOR = 3;

/**
 * We want to place informational text for the player to the right of the heart containers (which
 * will depend on how many heart containers we have).
 */
export class TopLeftText extends MandatoryModFeature {
  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    const seeds = game.GetSeeds();
    const seedString = seeds.GetStartSeedString();
    const HUDOffsetVector = getHUDOffsetVector();
    const heartsUIWidth = getHeartsUIWidth();

    const x = HUDOffsetVector.X + heartsUIWidth + STARTING_X;
    let y = HUDOffsetVector.Y + STARTING_Y;
    const lineLength = 15;

    const renderFrameCount = Isaac.GetFrameCount();
    const clientMessageDifference =
      renderFrameCount - g.frameLastClientMessageReceived;
    const shouldShowClientMessage =
      clientMessageDifference <=
      SECONDS_TO_SHOW_CLIENT_MESSAGE_FOR * RENDER_FRAMES_PER_SECOND;

    const lines: string[] = [];
    if (shouldShowClientMessage) {
      // We can't use a real newline to split the message because the socket protocol uses newlines
      // as a command terminator. Thus, we use an arbitrary sequence of characters to indicate a
      // line break.
      for (const line of g.race.message.split("[NEWLINE]")) {
        lines.push(line);
      }
    } else if (shouldShowVictoryLaps()) {
      // Display the number of victory laps. (This should have priority over showing the seed.)
      const victoryLaps = getNumVictoryLaps();
      lines.push(`Victory Lap #${victoryLaps}`);
    } else if (
      speedrunShouldShowEndOfRunText() ||
      raceShouldShowEndOfRunText()
    ) {
      // Show some run summary information. (It will be removed if they exit the room.)
      lines.push(`R+ ${VERSION} - ${seedString}`);

      if (speedrunShouldShowEndOfRunText()) {
        lines.push(
          `Avg. time per char: ${speedrunGetAverageTimePerCharacter()}`,
        );
      } else {
        const numRoomsEntered = mod.getNumRoomsEntered();
        lines.push(`Rooms entered: ${numRoomsEntered}`);
      }

      // Draw a 3rd line to show the total frames.
      if (!inSpeedrun() || isOnFinalCharacter()) {
        let frames: int;
        frames = inSpeedrun() ? speedrunGetFinishedFrames() : g.raceVars.finishedRenderFrames;
        const seconds = Math.floor(frames / 60);
        lines.push(`${frames} frames (${seconds}s)`);
      }
    } else if (shouldShowRaceID()) {
      lines.push(`Race ID: ${g.race.raceID}`);
    } else if (
      this.shouldShowSeededRaceTimeOffset() &&
      g.race.millisecondsBehindLeader > 0
    ) {
      const seconds = Math.round(
        g.race.millisecondsBehindLeader / SECOND_IN_MILLISECONDS,
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

  shouldShowSeededRaceTimeOffset(): boolean {
    const room = game.GetRoom();

    return (
      inSeededRace() &&
      !onFirstFloor() &&
      inStartingRoom() &&
      room.IsFirstVisit() &&
      g.race.placeMid !== 1 // Only show it if we are not in first place.
    );
  }
}
