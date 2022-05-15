import { EntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as fastPolties from "../features/optional/enemies/fastPolties";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    polty,
    EntityType.POLTY, // 816
  );
}

// EntityType.POLTY (816)
function polty(npc: EntityNPC) {
  fastPolties.postNPCInitLatePolty(npc);
}
