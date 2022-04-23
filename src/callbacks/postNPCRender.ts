import * as dummyDPS from "../features/mandatory/dummyDPS";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_RENDER,
    dummy,
    EntityType.ENTITY_DUMMY, // 964
  );
}

function dummy(npc: EntityNPC) {
  dummyDPS.postNPCRenderDummy(npc);
}
