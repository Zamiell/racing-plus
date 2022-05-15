import { LambVariant } from "isaac-typescript-definitions";
import { log } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.THE_LAMB (273)
export function postNPCUpdateLamb(npc: EntityNPC): void {
  if (!config.removeLambBody) {
    return;
  }

  // Remove The Lamb body once it is defeated so that it does not interfere with taking the trophy.
  if (
    npc.Variant === LambVariant.BODY &&
    npc.IsInvincible() && // It turns invincible once it is defeated
    !npc.IsDead() // The callback will be hit again during the removal
  ) {
    npc.Remove();
    log("Manually removed a Lamb body.");
  }
}
