import { ModCallback } from "isaac-typescript-definitions";
import { racePreGameExit } from "../features/race/callbacks/preGameExit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, main);
}

function main() {
  racePreGameExit();
}
