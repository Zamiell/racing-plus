import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as dummyDPS from "../features/mandatory/dummyDPS";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_NPC_RENDER,
    dummy,
    EntityType.DUMMY, // 964
  );
}

function dummy(npc: EntityNPC) {
  dummyDPS.postNPCRenderDummy(npc);
}
