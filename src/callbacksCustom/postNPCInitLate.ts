import { EntityType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as fastPolties from "../features/optional/enemies/fastPolties";
import { mod } from "../mod";

export function init(): void {
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
