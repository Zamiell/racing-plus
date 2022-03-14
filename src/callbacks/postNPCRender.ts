import * as debugDisplay from "../features/mandatory/debugDisplay";
import * as dummyDPS from "../features/mandatory/dummyDPS";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_NPC_RENDER, main);

  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_RENDER,
    dummy,
    EntityType.ENTITY_DUMMY, // 964
  );
}

function main(npc: EntityNPC) {
  debugDisplay.postNPCRender(npc);
}

function dummy(npc: EntityNPC) {
  dummyDPS.postNPCRenderDummy(npc);
}
