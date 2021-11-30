import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingRemove from "../trackingRemove";

export function fastClearPostEntityKill(entity: Entity): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingRemove.postEntityKill(entity);
}
