import g from "../../../../../globals";
import * as tracking from "../tracking";

export function main(npc: EntityNPC): void {
  if (!g.config.fastClear) {
    return;
  }

  tracking.checkAdd(npc);
}
