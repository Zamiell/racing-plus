import g from "../../../../../globals";
import * as pc from "../paschalCandle";

export function paschalCandle(familiar: EntityFamiliar): void {
  if (!g.fastClear) {
    return;
  }

  pc.postRender(familiar);
}
