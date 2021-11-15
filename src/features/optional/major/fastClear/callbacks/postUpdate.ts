import * as earlyClearRoom from "../earlyClearRoom";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingClear from "../trackingClear";

export function fastClearPostUpdate(): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingClear.postUpdate();
  earlyClearRoom.postUpdate();
}
