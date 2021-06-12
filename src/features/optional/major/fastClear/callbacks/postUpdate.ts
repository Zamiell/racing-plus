import g from "../../../../../globals";
import * as angels from "../angels";
import * as krampus from "../krampus";

export function main(): void {
  if (!g.config.fastClear) {
    return;
  }

  krampus.postUpdate();
  angels.postUpdate();
}
