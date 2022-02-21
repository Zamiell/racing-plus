import { arrayEmpty } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";
import v from "../v";

export function showDreamCatcherItemPostGameStarted(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  arrayEmpty(v.level.collectibles);
  arrayEmpty(v.level.bosses);

  sprites.reset();
}
