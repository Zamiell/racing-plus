import g from "../../globals";
import RaceVars from "./types/RaceVars";

export default function raceStart(): void {
  g.raceVars = new RaceVars();
  g.raceVars.started = true;
  g.raceVars.startedTime = Isaac.GetTime();
  g.raceVars.startedFrame = Isaac.GetFrameCount();
}
