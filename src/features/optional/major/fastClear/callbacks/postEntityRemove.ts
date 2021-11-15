import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingClear from "../trackingClear";
import * as trackingRemove from "../trackingRemove";

export function fastClearPostEntityRemove(entity: Entity): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingClear.postEntityRemove();
  trackingRemove.postEntityRemove(entity);
}
