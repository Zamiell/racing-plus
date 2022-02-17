import g from "../../../../globals";
import { shouldSeededDeathApply } from "../seededDeath";

// ModCallbacksCustom.MC_POST_CUSTOM_REVIVE
export function seededDeathPostCustomRevive(player: EntityPlayer): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  // The 1-Up animation has started playing,
  // so we need to cancel it by playing the fetal position animation again
  player.PlayExtraAnimation("AppearVanilla");

  // Before the revival, use added Curse of the Unknown to hide the health UI
  // Now that we have revived, set things back to normal
  g.l.RemoveCurses(LevelCurse.CURSE_OF_THE_UNKNOWN);
}
