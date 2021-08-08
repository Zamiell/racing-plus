import g from "../../globals";
import { config } from "../../modConfigMenu";
import { inRaceRoom } from "./raceRoom";
import RaceVars from "./types/RaceVars";

export default function raceStart(): void {
  g.raceVars = new RaceVars();
  g.raceVars.started = true;
  g.raceVars.startedTime = Isaac.GetTime();
  g.raceVars.startedFrame = Isaac.GetFrameCount();
}

export function shouldShowRaceID(): boolean {
  return (
    config.clientCommunication &&
    g.race.raceID !== -1 &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    !inRaceRoom() &&
    // Only show it in the first two seconds of the race
    Isaac.GetTime() - g.raceVars.startedTime <= 2000
  );
}
