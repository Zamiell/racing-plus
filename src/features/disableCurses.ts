import g from "../globals";

export default function disableCurses(): LevelCurse | null {
  return g.config.disableCurses ? LevelCurse.CURSE_NONE : null;
}
