import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";
import * as trackingClear from "../trackingClear";

export function fastClearPostNPCInit(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingClear.postNPCInit();
  trackingAdd.postNPCInit(npc);
}
