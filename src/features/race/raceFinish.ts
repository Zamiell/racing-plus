import { getElapsedRenderFramesSince, log } from "isaacscript-common";
import { spawnEndOfRaceButtons } from "../../classes/features/race/EndOfRaceButtons";
import { g } from "../../globals";
import * as socket from "./socket";
import { v } from "./v";

export function raceFinish(): void {
  g.raceVars.finished = true;
  g.raceVars.finishedTime = Isaac.GetTime() - g.raceVars.startedTime;
  g.raceVars.finishedRenderFrames = getElapsedRenderFramesSince(
    g.raceVars.startedRenderFrame,
  );

  v.room.showEndOfRunText = true;

  // Tell the client that the goal was achieved (and the race length).
  socket.send("finish", g.raceVars.finishedTime.toString());
  log(`Finished race ${g.race.raceID} with time: ${g.raceVars.finishedTime}`);
  log(
    `The total amount of frames in the race was: ${g.raceVars.finishedRenderFrames}`,
  );

  spawnEndOfRaceButtons();
}
