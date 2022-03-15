import { enableAllInputs } from "isaacscript-common";
import { FAST_TRAVEL_FEATURE_NAME } from "../constants";
import { setNewFastTravelState } from "../setNewState";
import { FastTravelState } from "../types/FastTravelState";
import v from "../v";

export function fastTravelPostGameStartedContinued(): void {
  // Cancel fast-travel if we save & quit in the middle of the jumping animation
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    setNewFastTravelState(FastTravelState.DISABLED);
    enableAllInputs(FAST_TRAVEL_FEATURE_NAME);
  }
}
