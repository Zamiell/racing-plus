import { ModCallback } from "isaac-typescript-definitions";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";
import { racePreGameExit } from "../features/race/callbacks/preGameExit";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, main);
}

function main(shouldSave: boolean) {
  disableMultiplayer.preGameExit(shouldSave);
  racePreGameExit();
}
