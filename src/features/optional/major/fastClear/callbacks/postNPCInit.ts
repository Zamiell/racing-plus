import shouldEnableFastClear from "../shouldDisable";
import * as tracking from "../tracking";

export default function fastClearPostNPCInit(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  tracking.checkAdd(npc);
}
