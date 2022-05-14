import { ModCallback } from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import * as timeConsoleUsed from "../features/utils/timeConsoleUsed";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.EXECUTE_CMD, main);
}

function main(command: string, params: string) {
  recordEveryCommand(command, params);
  timeConsoleUsed.executeCmd();
}

function recordEveryCommand(command: string, params: string) {
  let debugString = `MC_EXECUTE_CMD - ${command}`;
  if (params !== "") {
    debugString += ` ${params}`;
  }
  log(debugString);
}
