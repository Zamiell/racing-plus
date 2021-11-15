import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as fastPolties from "../features/optional/enemies/fastPolties";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_NPC_INIT_LATE,
    polty,
    EntityType.ENTITY_POLTY, // 816
  );
}

// EntityType.ENTITY_POLTY (816)
function polty(npc: EntityNPC) {
  fastPolties.postNPCInitLatePolty(npc);
}
