import { ModCallback } from "isaac-typescript-definitions";
import { Callback, log } from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

export class LogConsoleCommands extends MandatoryModFeature {
  @Callback(ModCallback.EXECUTE_CMD)
  executeCmd(command: string, params: string): void {
    const fullCommand = params === "" ? command : `${command} ${params}`;
    log(`EXECUTE_CMD - ${fullCommand}`);
  }
}
