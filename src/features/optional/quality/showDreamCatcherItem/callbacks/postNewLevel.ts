import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";

export function showDreamCatcherItemPostNewLevel(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  sprites.reset();
}
