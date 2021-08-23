import { config } from "../../../../../modConfigMenu";
import { FastTravelState } from "../enums";
import v from "../v";

export function disableInputFloat(): float | void {
  if (!config.fastTravel) {
    return undefined;
  }

  if (v.run.state > FastTravelState.DISABLED) {
    return 0;
  }

  return undefined;
}

export function disableInputBoolean(): boolean | void {
  if (!config.fastTravel) {
    return undefined;
  }

  if (v.run.state > FastTravelState.DISABLED) {
    return false;
  }

  return undefined;
}
