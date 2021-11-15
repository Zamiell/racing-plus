import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";

export function fastClearPostNPCInit(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingAdd.postNPCInit(npc);
}
