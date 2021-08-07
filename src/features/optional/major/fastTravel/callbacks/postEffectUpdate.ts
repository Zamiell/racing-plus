import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!config.fastTravel) {
    return;
  }

  if (effect.SubType === 0) {
    heavenDoor.postEffectUpdate(effect);
  }
}
