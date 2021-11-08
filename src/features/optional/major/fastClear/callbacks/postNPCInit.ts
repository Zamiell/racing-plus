import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as tracking from "../tracking";

export function fastClearPostNPCInit(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  tracking.checkAdd(npc);
}
