// The state of Moonlight starts at 0 and increments by 1 on every frame
// The player is only able to step into it on frame 60 at beyond
// This limit makes no sense, so we immediately set the state to 60 as soon as it ticks upwards for

import { config } from "../../../modConfigMenu";

// the first time
const ACTIVATION_STATE = 60;

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
// EffectVariant.HEAVEN_LIGHT_DOOR (39)
export function postEffectUpdateHeavenLightDoor(effect: EntityEffect): void {
  if (!config.fastMoonlight) {
    return;
  }

  if (
    effect.SubType === HeavenLightDoorSubType.MOONLIGHT &&
    effect.State === 1
  ) {
    effect.State = ACTIVATION_STATE;
  }
}
