import { RaceVars } from "../../classes/RaceVars";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { inRaceRoom } from "./raceRoom";

export function raceStart(): void {
  g.raceVars = new RaceVars();
  g.raceVars.started = true;
  g.raceVars.startedTime = Isaac.GetTime();
  g.raceVars.startedRenderFrame = Isaac.GetFrameCount();
}

export function shouldShowRaceID(): boolean {
  return (
    config.clientCommunication &&
    g.race.raceID !== -1 &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    !inRaceRoom() &&
    // Only show it in the first two seconds of the race.
    Isaac.GetTime() - g.raceVars.startedTime <= 2000
  );
}
