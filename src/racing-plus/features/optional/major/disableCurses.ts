import { config } from "../../../modConfigMenu";

export default function disableCurses(): LevelCurse | null {
  if (!config.disableCurses) {
    return null;
  }

  return LevelCurse.CURSE_NONE;
}
