import { EntityType, HauntVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as disableInvulnerability from "../features/optional/enemies/disableInvulnerability";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    wizoob,
    EntityType.WIZOOB, // 219
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    lilHaunt,
    EntityType.THE_HAUNT, // 260
    HauntVariant.LIL_HAUNT,
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    redGhost,
    EntityType.RED_GHOST, // 285
  );
}

// EntityType.WIZOOB (219)
function wizoob(npc: EntityNPC) {
  disableInvulnerability.postNPCInitLateWizoob(npc);
}

// EntityType.THE_HAUNT (260)
function lilHaunt(npc: EntityNPC) {
  disableInvulnerability.postNPCInitLateLilHaunt(npc);
}

// EntityType.RED_GHOST (285)
function redGhost(npc: EntityNPC) {
  disableInvulnerability.postNPCInitLateRedGhost(npc);
}
