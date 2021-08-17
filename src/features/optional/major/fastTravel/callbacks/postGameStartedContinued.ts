import { FastTravelState } from "../enums";
import v from "../v";

export default function fastTravelPostGameStartedContinued(): void {
  // Cancel fast-travel if we save & quit in the middle of the jumping animation
  if (v.run.state === FastTravelState.FadingToBlack) {
    v.run.state = FastTravelState.Disabled;
  }
}
