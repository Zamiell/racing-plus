import * as dummyDPS from "../features/mandatory/dummyDPS";
import fastClearPostNPCRender from "../features/optional/major/fastClear/callbacks/postNPCRender";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_RENDER,
    dummy,
    EntityType.ENTITY_DUMMY, // 964
  );
}

export function main(npc: EntityNPC): void {
  fastClearPostNPCRender(npc);
}

function dummy(npc: EntityNPC) {
  dummyDPS.postNPCRenderDummy(npc);
}
