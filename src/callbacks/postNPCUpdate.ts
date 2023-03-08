import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { racePostNPCUpdateDarkEsau } from "../features/race/callbacks/postNPCUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_NPC_UPDATE,
    darkEsau,
    EntityType.DARK_ESAU, // 866
  );
}

// EntityType.DARK_ESAU (866)
function darkEsau(npc: EntityNPC) {
  racePostNPCUpdateDarkEsau(npc);
}
