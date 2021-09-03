import * as fastColostomia from "../features/optional/bosses/fastColostomia";
import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import * as betterDevilAngelRoomsPostNPCInit from "../features/optional/major/betterDevilAngelRooms/callbacks/postNPCInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_INIT,
    daddyLongLegs,
    EntityType.ENTITY_DADDYLONGLEGS, // 101
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_INIT,
    pitfall,
    EntityType.ENTITY_PITFALL, // 291
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_INIT,
    colostomia,
    EntityType.ENTITY_COLOSTOMIA, // 917
  );
}

function daddyLongLegs(npc: EntityNPC) {
  clearerShadowAttacks.postNPCInitDaddyLongLegs(npc);
}

function pitfall(npc: EntityNPC) {
  betterDevilAngelRoomsPostNPCInit.pitfall(npc);
}

function colostomia(npc: EntityNPC) {
  fastColostomia.postNPCInitColostomia(npc);
}
