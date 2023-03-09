import { FAST_TRAVEL_FEATURE_NAME } from "../../../../../classes/features/optional/major/fastTravel/constants";
import { setNewFastTravelState } from "../../../../../classes/features/optional/major/fastTravel/setNewState";
import { v } from "../../../../../classes/features/optional/major/fastTravel/v";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import { mod } from "../../../../../mod";

export function fastTravelPostGameStartedContinued(): void {
  // Cancel fast-travel if we save & quit in the middle of the jumping animation.
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    setNewFastTravelState(FastTravelState.DISABLED);
    mod.enableAllInputs(FAST_TRAVEL_FEATURE_NAME);
  }
}
