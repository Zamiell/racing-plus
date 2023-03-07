import { CardType, ModCallback, UseFlag } from "isaac-typescript-definitions";
import * as streakText from "../features/mandatory/streakText";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_CARD, main);
}

function main(
  cardType: CardType,
  _player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  streakText.postUseCard(cardType, useFlags);
}
