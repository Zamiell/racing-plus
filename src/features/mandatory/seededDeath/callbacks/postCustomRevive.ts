import { shouldSeededDeathApply } from "../seededDeath";

// ModCallbacksCustom.MC_POST_CUSTOM_REVIVE
export function seededDeathPostCustomRevive(player: EntityPlayer): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  // The 1-Up animation has started playing,
  // so we need to cancel it by playing the fetal position animation again
  player.PlayExtraAnimation("AppearVanilla");
}
