import * as disableCoop from "../disableCoop";
import { inSpeedrun } from "../speedrun";

export function speedrunPreGameExit(shouldSave: boolean): void {
  if (!inSpeedrun()) {
    return;
  }

  disableCoop.preGameExit(shouldSave);
}
