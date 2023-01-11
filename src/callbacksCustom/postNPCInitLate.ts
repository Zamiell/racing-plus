import { EntityType, HauntVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as disableInvulnerability from "../features/optional/enemies/disableInvulnerability";
import * as fastPolties from "../features/optional/enemies/fastPolties";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    momsHand,
    EntityType.MOMS_HAND, // 213
  );

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

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    momsDeadHand,
    EntityType.MOMS_DEAD_HAND, // 287
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    polty,
    EntityType.POLTY, // 816
  );
}

// EntityType.MOMS_HAND (213)
function momsHand(npc: EntityNPC) {
  appearHands.postNPCInitLateMomsHand(npc);
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

// EntityType.MOMS_DEAD_HAND (287)
function momsDeadHand(npc: EntityNPC) {
  appearHands.postNPCInitLateMomsDeadHand(npc);
}

// EntityType.POLTY (816)
function polty(npc: EntityNPC) {
  fastPolties.postNPCInitLatePolty(npc);
}
