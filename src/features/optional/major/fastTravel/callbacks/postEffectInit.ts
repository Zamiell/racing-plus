import g from "../../../../../globals";
import * as heavenDoor from "../heavenDoor";

export function heavenLightDoor(effect: EntityEffect): void {
  if (!g.config.fastTravel) {
    return;
  }

  heavenDoor.postEffectInit(effect);
}
