import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";

export function showDreamCatcherItemPostRender(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  sprites.draw();
}
