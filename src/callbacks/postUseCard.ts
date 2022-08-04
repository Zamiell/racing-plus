import { Card, ModCallback, UseFlag } from "isaac-typescript-definitions";
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
    Card.HIEROPHANT, // 6
  );

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    lovers,
    Card.LOVERS, // 7
  );

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    justice,
    Card.JUSTICE, // 9
  );

  mod.AddCallback(
    ModCallback.POST_USE_CARD,
    blackRune,
    Card.RUNE_BLACK, // 41
  );
}

function main(card: Card, _player: EntityPlayer, _useFlags: BitFlags<UseFlag>) {
  streakText.useCard(card);
}

// Card.HIEROPHANT (6)
function hierophant(
  _card: Card,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardHierophant(player);
}

// Card.LOVERS (7)
function lovers(
  _card: Card,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardLovers(player);
}

// Card.JUSTICE (9)
function justice(
  _card: Card,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  automaticItemInsertionUseCardJustice(player);
}

// Card.RUNE_BLACK (41)
function blackRune(
  _card: Card,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  speedrunUseCard.blackRune();
}
