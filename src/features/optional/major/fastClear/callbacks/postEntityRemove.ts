import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingRemove from "../trackingRemove";

export function fastClearPostEntityRemove(entity: Entity): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingRemove.postEntityRemove(entity);
}
