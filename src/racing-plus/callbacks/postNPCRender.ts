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

export function dummy(npc: EntityNPC): void {
  dummyDPS.postNPCRenderDummy(npc);
}
