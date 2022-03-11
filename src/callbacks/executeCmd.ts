import { log, printConsole } from "isaacscript-common";
import { executeCmdFunctions } from "./executeCmdFunctions";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_EXECUTE_CMD, main);
}

function main(command: string, parameters: string) {
  // Record every command
  let debugString = `MC_EXECUTE_CMD - ${command}`;
  if (parameters !== "") {
    debugString += ` ${parameters}`;
  }
  log(debugString);

  const lowercaseCommand = command.toLowerCase();
  const executeCmdFunction = executeCmdFunctions.get(lowercaseCommand);
  if (executeCmdFunction !== undefined) {
    executeCmdFunction(parameters);
  } else {
    printConsole("Unknown vanilla or Racing+ command.");
  }
}
