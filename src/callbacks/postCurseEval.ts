import { disableCurses } from "../features/optional/major/disableCurses";

export function main(curses: int): LevelCurse {
  const newCurses = disableCurses();
  if (newCurses !== undefined) {
    return newCurses;
  }

  return curses;
}
