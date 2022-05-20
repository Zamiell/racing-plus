import { HeavenLightDoorSubType } from "isaac-typescript-definitions";
import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!config.fastTravel) {
    return;
  }

  if (effect.SubType === (HeavenLightDoorSubType.HEAVEN_DOOR as int)) {
    heavenDoor.postEffectUpdate(effect);
  }
}
