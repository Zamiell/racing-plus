import { LevelCurse, ModCallback } from "isaac-typescript-definitions";
import { disableCurses } from "../features/optional/major/disableCurses";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_CURSE_EVAL, main);
}

function main(curses: BitFlags<LevelCurse>): BitFlags<LevelCurse> | undefined {
  const newCurses = disableCurses();
  if (newCurses !== undefined) {
    return newCurses;
  }

  return curses;
}
