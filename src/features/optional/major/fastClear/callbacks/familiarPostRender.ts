import g from "../../../../../globals";
import * as pc from "../paschalCandle";

export function paschalCandle(familiar: EntityFamiliar): void {
  if (!g.config.fastClear) {
    return;
  }

  pc.postRender(familiar);
}
