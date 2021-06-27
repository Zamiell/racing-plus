import g from "../../../../../globals";
import { FastTravelState } from "../enums";

// Used to disable InputHook.GET_ACTION_VALUE inputs
export function disableInput(): float | void {
  if (!g.config.fastTravel) {
    return undefined;
  }

  if (g.run.fastTravel.state > FastTravelState.Disabled) {
    return 0;
  }

  return undefined;
}
