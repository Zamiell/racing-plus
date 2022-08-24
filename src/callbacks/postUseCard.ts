import { CardType, ModCallback, UseFlag } from "isaac-typescript-definitions";
import * as streakText from "../features/mandatory/streakText";
import {
  automaticItemInsertionUseCardHierophant,
  automaticItemInsertionUseCardJustice,
  automaticItemInsertionUseCardLovers,
} from "../features/optional/quality/automaticItemInsertion/callbacks/useCard";
import * as speedrunUseCard from "../features/speedrun/callbacks/postUseCard";

export function init(mod: Mod): void {
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

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    blackRune,
    CardType.RUNE_BLACK, // 41
  );
}

function main(
  cardType: CardType,
  _player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  streakText.useCard(cardType, useFlags);
}

// Card.HIEROPHANT (6)
function hierophant(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardHierophant(player);
}

// Card.LOVERS (7)
function lovers(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardLovers(player);
}

// Card.JUSTICE (9)
function justice(
  _cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardJustice(player);
}

// Card.RUNE_BLACK (41)
function blackRune(
  _cardType: CardType,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  speedrunUseCard.blackRune();
}
