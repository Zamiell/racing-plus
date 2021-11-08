import { config } from "../../../modConfigMenu";

export function disableCurses(): LevelCurse | undefined {
  if (!config.disableCurses) {
    return undefined;
  }

  return LevelCurse.CURSE_NONE;
}
