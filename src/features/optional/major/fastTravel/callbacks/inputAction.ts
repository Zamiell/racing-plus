import { config } from "../../../../../modConfigMenu";
import { FastTravelState } from "../enums";
import v from "../v";

// Used to disable InputHook.GET_ACTION_VALUE inputs
export function disableInput(): float | void {
  if (!config.fastTravel) {
    return undefined;
  }

  if (v.run.state > FastTravelState.Disabled) {
    return 0;
  }

  return undefined;
}
