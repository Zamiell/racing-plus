import * as streakText from "../features/mandatory/streakText";
import {
  automaticItemInsertionUseCardHierophant,
  automaticItemInsertionUseCardJustice,
  automaticItemInsertionUseCardLovers,
} from "../features/optional/quality/automaticItemInsertion/callbacks/useCard";
import * as speedrunUseCard from "../features/speedrun/callbacks/useCard";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_USE_CARD, main);

  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    hierophant,
    Card.CARD_HIEROPHANT, // 6
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    lovers,
    Card.CARD_LOVERS, // 7
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    justice,
    Card.CARD_JUSTICE, // 9
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    blackRune,
    Card.RUNE_BLACK, // 41
  );
}

function main(card: Card) {
  streakText.useCard(card);
}

// Card.CARD_HIEROPHANT (6)
function hierophant(_card: Card, player: EntityPlayer, _useFlags: int) {
  automaticItemInsertionUseCardHierophant(player);
}

// Card.CARD_LOVERS (7)
function lovers(_card: Card, player: EntityPlayer, _useFlags: int) {
  automaticItemInsertionUseCardLovers(player);
}

// Card.CARD_JUSTICE (9)
function justice(_card: Card, player: EntityPlayer, _useFlags: int) {
  automaticItemInsertionUseCardJustice(player);
}

// Card.RUNE_BLACK (41)
function blackRune(_card: Card, _player: EntityPlayer, _useFlags: int) {
  speedrunUseCard.blackRune();
}
