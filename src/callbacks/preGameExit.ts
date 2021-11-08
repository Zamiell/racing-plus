import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";
import { racePreGameExit } from "../features/race/callbacks/preGameExit";

export function main(shouldSave: boolean): void {
  disableMultiplayer.preGameExit(shouldSave);
  racePreGameExit();
}
