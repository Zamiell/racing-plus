import { LevelCurse } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

export function disableCurses(): LevelCurse | undefined {
  if (!config.disableCurses) {
    return undefined;
  }

  return LevelCurse.NONE;
}
