import { ModCallback } from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import * as timeConsoleUsed from "../features/utils/timeConsoleUsed";
import { mod } from "../mod";

export function init(): void {
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
