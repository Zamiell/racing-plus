import g from "../../../../../globals";
import * as heavenDoor from "../heavenDoor";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!g.config.fastTravel) {
    return;
  }

  if (effect.SubType === 0) {
    heavenDoor.postEffectUpdate(effect);
  }
}
