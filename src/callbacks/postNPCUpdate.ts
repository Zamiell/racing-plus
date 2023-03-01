import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as fastClearPostNPCUpdate from "../features/optional/major/fastClear/callbacks/postNPCUpdate";
import { racePostNPCUpdateDarkEsau } from "../features/race/callbacks/postNPCUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_NPC_UPDATE, main);

  mod.AddCallback(
    ModCallback.POST_NPC_UPDATE,
    ragling,
    EntityType.RAGLING, // 246
  );

  mod.AddCallback(
    ModCallback.POST_NPC_UPDATE,
    dingle,
    EntityType.DINGLE, // 261
  );

  mod.AddCallback(
    ModCallback.POST_NPC_UPDATE,
    stoney,
    EntityType.STONEY, // 302
  );

  mod.AddCallback(
    ModCallback.POST_NPC_UPDATE,
    darkEsau,
    EntityType.DARK_ESAU, // 866
  );
}

function main(npc: EntityNPC) {
  // Major
  fastClearPostNPCUpdate.main(npc);
}

// EntityType.RAGLING (246)
function ragling(npc: EntityNPC) {
  fastClearPostNPCUpdate.ragling(npc);
}

// EntityType.DINGLE (261)
function dingle(npc: EntityNPC) {
  fastClearPostNPCUpdate.dingle(npc);
}

// EntityType.STONEY (302)
function stoney(npc: EntityNPC) {
  fastClearPostNPCUpdate.stoney(npc);
}

// EntityType.DARK_ESAU (866)
function darkEsau(npc: EntityNPC) {
  racePostNPCUpdateDarkEsau(npc);
}
