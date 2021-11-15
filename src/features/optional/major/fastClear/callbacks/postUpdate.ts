import * as earlyClearRoom from "../earlyClearRoom";
import { shouldEnableFastClear } from "../shouldEnableFastClear";

export function fastClearPostUpdate(): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  earlyClearRoom.postUpdate();
}
