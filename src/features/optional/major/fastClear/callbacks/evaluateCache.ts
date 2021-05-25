import g from "../../../../../globals";
import * as paschalCandle from "../paschalCandle";

export function fireDelay(player: EntityPlayer): void {
  if (!g.config.fastClear) {
    return;
  }

  paschalCandle.fireDelay(player);
}
