import g from "../../../../../globals";
import { setDeferClearForGhost } from "../clearRoom";

export function main(): void {
  if (!g.fastClear) {
    return;
  }

  setDeferClearForGhost(false);
}
