import { enableAllInputs } from "isaacscript-common";
import { FAST_TRAVEL_FEATURE_NAME } from "../constants";
import { FastTravelState } from "../enums";
import v from "../v";

export function fastTravelPostGameStartedContinued(): void {
  // Cancel fast-travel if we save & quit in the middle of the jumping animation
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    v.run.state = FastTravelState.DISABLED;
    enableAllInputs(FAST_TRAVEL_FEATURE_NAME);
  }
}
