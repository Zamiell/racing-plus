import { HeavenLightDoorSubType } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import * as heavenDoor from "../../../../../classes/features/optional/major/fastTravel/heavenDoor";
import { config } from "../../../../../modConfigMenu";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!config.FastTravel) {
    return;
  }

  if (effect.SubType === asNumber(HeavenLightDoorSubType.HEAVEN_DOOR)) {
    heavenDoor.postEffectUpdate(effect);
  }
}
