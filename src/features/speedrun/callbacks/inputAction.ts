import { inSpeedrun } from "../speedrun";
import v from "../v";

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_CONSOLE (28)
export function isActionTriggeredConsole(): boolean | void {
  if (!inSpeedrun()) {
    return;
  }

  v.nonpersistent.timeConsoleOpened = Isaac.GetTime();
}
