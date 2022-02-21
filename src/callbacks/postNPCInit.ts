import * as fastColostomia from "../features/optional/bosses/fastColostomia";
import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import * as betterDevilAngelRoomsPostNPCInit from "../features/optional/major/betterDevilAngelRooms/callbacks/postNPCInit";
import { fastClearPostNPCInit } from "../features/optional/major/fastClear/callbacks/postNPCInit";
import { racePostNPCInitDarkEsau } from "../features/race/callbacks/postNPCInit";

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
    darkEsau,
    EntityType.ENTITY_DARK_ESAU, // 866
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_NPC_INIT,
    colostomia,
    EntityType.ENTITY_COLOSTOMIA, // 917
  );
}

export function main(npc: EntityNPC): void {
  fastClearPostNPCInit(npc);
}

// EntityType.ENTITY_DADDYLONGLEGS (101)
function daddyLongLegs(npc: EntityNPC) {
  clearerShadowAttacks.postNPCInitDaddyLongLegs(npc);
}

// EntityType.ENTITY_PITFALL (291)
function pitfall(npc: EntityNPC) {
  betterDevilAngelRoomsPostNPCInit.pitfall(npc);
}

// EntityType.ENTITY_DARK_ESAU (866)
function darkEsau(npc: EntityNPC) {
  racePostNPCInitDarkEsau(npc);
}

// EntityType.ENTITY_COLOSTOMIA (917)
function colostomia(npc: EntityNPC) {
  fastColostomia.postNPCInitColostomia(npc);
}
