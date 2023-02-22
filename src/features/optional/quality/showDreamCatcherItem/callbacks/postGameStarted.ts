import { emptyArray } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import * as sprites from "../sprites";
import { v } from "../v";

export function showDreamCatcherItemPostGameStarted(): void {
  if (!config.ShowDreamCatcherItem) {
    return;
  }

  emptyArray(v.level.collectibles);
  emptyArray(v.level.bosses);

  sprites.reset();
}
