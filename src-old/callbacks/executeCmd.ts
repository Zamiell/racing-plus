import * as misc from "../misc";
import executeCmdFunctions from "./executeCmdFunctions";

export function main(cmd: string, params: string): void {
  let debugString = `MC_EXECUTE_CMD - ${cmd}`;
  if (params !== "") {
    debugString += params;
  }
  Isaac.DebugString(debugString);

  const executeCmdFunction = executeCmdFunctions.get(cmd);
  if (executeCmdFunction !== undefined) {
    executeCmdFunction(params);
  } else {
    misc.console("Unknown Racing+ command.");
  }
}
