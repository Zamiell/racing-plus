import { LevelCurse, ModCallback } from "isaac-typescript-definitions";
import { disableCurses } from "../features/optional/major/disableCurses";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_CURSE_EVAL, main);
}

function main(curses: BitFlags<LevelCurse>): BitFlags<LevelCurse> | undefined {
  const newCurses = disableCurses();
  if (newCurses !== undefined) {
    return newCurses;
  }

  return curses;
}
