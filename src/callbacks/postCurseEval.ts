import { disableCurses } from "../features/optional/major/disableCurses";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, main);
}

function main(curses: int) {
  const newCurses = disableCurses();
  if (newCurses !== undefined) {
    return newCurses;
  }

  return curses;
}
