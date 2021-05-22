import g from "../globals";

export default function disableCurses(): LevelCurse | null {
  if (!g.config.disableCurses) {
    return null;
  }

  return LevelCurse.CURSE_NONE;
}
