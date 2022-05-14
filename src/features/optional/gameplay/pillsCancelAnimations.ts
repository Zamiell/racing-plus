// There are only two pills in the game that cannot cancel animations. Manually play either
// `AnimateHappy` or `AnimateSad` to grant the ability to these two pills.

import { config } from "../../../modConfigMenu";

// ModCallback.POST_USE_PILL (10)
// PillEffect.POWER (36)
export function usePillPowerPill(player: EntityPlayer): void {
  if (!config.pillsCancelAnimations) {
    return;
  }

  player.AnimateHappy();
}

// ModCallback.POST_USE_PILL (10)
// PillEffect.HORF (44)
export function usePillHorf(player: EntityPlayer): void {
  if (!config.pillsCancelAnimations) {
    return;
  }

  player.AnimateSad();
}
