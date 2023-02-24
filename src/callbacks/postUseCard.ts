import { CardType, ModCallback, UseFlag } from "isaac-typescript-definitions";
import * as streakText from "../features/mandatory/streakText";
import {
  automaticItemInsertionPostUseCardHierophant,
  automaticItemInsertionPostUseCardJustice,
  automaticItemInsertionPostUseCardLovers,
} from "../features/optional/quality/automaticItemInsertion/callbacks/postUseCard";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_CARD, main);

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    hierophant,
    CardType.HIEROPHANT, // 6
  );

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    lovers,
    CardType.LOVERS, // 7
  );

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    justice,
    CardType.JUSTICE, // 9
  );
}

function main(
  cardType: CardType,
  _player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  streakText.postUseCard(cardType, useFlags);
}

// Card.HIEROPHANT (6)
function hierophant(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionPostUseCardHierophant(player);
}

// Card.LOVERS (7)
function lovers(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionPostUseCardLovers(player);
}

// Card.JUSTICE (9)
function justice(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionPostUseCardJustice(player);
}
