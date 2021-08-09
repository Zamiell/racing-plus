import * as betterDevilAngelRoomsPostNPCInit from "../features/optional/major/betterDevilAngelRooms/callbacks/postNPCInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_INIT,
    pitfall,
    EntityType.ENTITY_PITFALL, // 291
  );
}

function pitfall(npc: EntityNPC) {
  betterDevilAngelRoomsPostNPCInit.pitfall(npc);
}
