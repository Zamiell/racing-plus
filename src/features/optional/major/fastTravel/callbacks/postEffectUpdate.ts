import { HeavenLightDoorSubType } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!config.FastTravel) {
    return;
  }

  if (effect.SubType === asNumber(HeavenLightDoorSubType.HEAVEN_DOOR)) {
    heavenDoor.postEffectUpdate(effect);
  }
}
