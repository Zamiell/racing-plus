import { config } from "../../../modConfigMenu";

// There are only two pills in the game that cannot cancel animations
// Manually play either AnimateHappy or AnimateSad to grant the ability to these two pills

// ModCallbacks.MC_USE_PILL (10)
// PillEffect.PILLEFFECT_POWER (36)
export function usePillPowerPill(player: EntityPlayer): void {
  if (!config.pillsCancelAnimations) {
    return;
  }

  player.AnimateHappy();
}

// ModCallbacks.MC_USE_PILL (10)
// PillEffect.PILLEFFECT_HORF (44)
export function usePillHorf(player: EntityPlayer): void {
  if (!config.pillsCancelAnimations) {
    return;
  }

  player.AnimateSad();
}
