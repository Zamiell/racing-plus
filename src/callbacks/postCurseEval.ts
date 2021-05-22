import disableCurses from "../features/disableCurses";

export function main(curses: LevelCurse): LevelCurse {
  const newCurses = disableCurses();
  if (newCurses !== null) {
    return newCurses;
  }

  return curses;
}
