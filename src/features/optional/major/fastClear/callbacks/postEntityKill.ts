import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingClear from "../trackingClear";
import * as trackingRemove from "../trackingRemove";

export function fastClearPostEntityKill(entity: Entity): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingClear.postEntityKill();
  trackingRemove.postEntityKill(entity);
}
