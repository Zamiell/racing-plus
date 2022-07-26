import { LevelCurse } from "isaac-typescript-definitions";
import { bitFlags } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function disableCurses(): BitFlags<LevelCurse> | undefined {
  if (!config.disableCurses) {
    return undefined;
  }

  return bitFlags(LevelCurse.NONE);
}
