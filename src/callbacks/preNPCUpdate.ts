import { EntityType, ModCallback } from "isaac-typescript-definitions";
import * as appearHands from "../features/optional/enemies/appearHands";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.PRE_NPC_UPDATE,
    momsHand,
    EntityType.MOMS_HAND, // 213
  );

  mod.AddCallback(
    ModCallback.PRE_NPC_UPDATE,
    momsDeadHand,
    EntityType.MOMS_DEAD_HAND, // 287
  );
}

// EntityType.MOMS_HAND (213)
function momsHand(npc: EntityNPC): boolean | undefined {
  return appearHands.preNPCUpdateMomsHand(npc);
}

// EntityType.MOMS_DEAD_HAND (287)
function momsDeadHand(npc: EntityNPC): boolean | undefined {
  return appearHands.preNPCUpdateMomsDeadHand(npc);
}
