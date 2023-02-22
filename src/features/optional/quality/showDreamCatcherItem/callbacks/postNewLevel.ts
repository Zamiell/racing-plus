import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";

export function showDreamCatcherItemPostNewLevel(): void {
  if (!config.ShowDreamCatcherItem) {
    return;
  }

  sprites.reset();
}
