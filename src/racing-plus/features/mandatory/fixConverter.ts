// There is a bug in the vanilla game where Converter does not work properly on characters who
// cannot gain red hearts

import { CHARACTERS_WITH_NO_RED_HEARTS } from "isaacscript-common";

export function preUseItemConverter(player: EntityPlayer): boolean | void {
  const character = player.GetPlayerType();

  if (CHARACTERS_WITH_NO_RED_HEARTS.has(character)) {
    return true;
  }

  return undefined;
}
