import racePreGameExit from "../features/race/callbacks/preGameExit";
import { speedrunPreGameExit } from "../features/speedrun/callbacks/preGameExit";

export function main(shouldSave: boolean): void {
  racePreGameExit();
  speedrunPreGameExit(shouldSave);
}
