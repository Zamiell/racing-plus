import { log } from "isaacscript-common";
import { executeCmdFunctions } from "./executeCmdFunctions";

export function main(command: string, parameters: string): void {
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
    Isaac.ConsoleOutput("Unknown vanilla or Racing+ command.");
  }
}
