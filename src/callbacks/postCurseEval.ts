import disableCurses from "../features/disableCurses";

export function main(curses: LevelCurse): LevelCurse {
  const levelCurse = disableCurses();
  if (levelCurse !== null) {
    return levelCurse;
  }

  return curses;
}
