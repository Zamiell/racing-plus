import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as betterDevilAngelRoomsPostNPCInit from "../features/optional/major/betterDevilAngelRooms/callbacks/postNPCInit";
import { fastClearPostNPCInit } from "../features/optional/major/fastClear/callbacks/postNPCInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_NPC_INIT, main);

  mod.AddCallback(
    ModCallback.POST_NPC_INIT,
    pitfall,
    EntityType.PITFALL, // 291
  );
}

function main(npc: EntityNPC) {
  fastClearPostNPCInit(npc);
}

// EntityType.PITFALL (291)
function pitfall(npc: EntityNPC) {
  betterDevilAngelRoomsPostNPCInit.pitfall(npc);
}
