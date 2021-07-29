import { log } from "isaacscript-common";
import g from "../../../globals";

// Remove The Lamb body once it is defeated so that it does not interfere with taking the trophy
export function postNPCUpdate(npc: EntityNPC): void {
  if (!g.config.removeLambBody) {
    return;
  }

  if (
    npc.Variant === LambVariant.BODY &&
    npc.IsInvincible() && // It turns invincible once it is defeated
    !npc.IsDead() // The callback will be hit again during the removal
  ) {
    npc.Remove();
    log("Manually removed a Lamb body.");
  }
}
