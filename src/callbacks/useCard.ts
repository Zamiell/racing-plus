import * as preventItemRotate from "../features/mandatory/preventItemRotate";
import * as streakText from "../features/mandatory/streakText";
import * as automaticInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as speedrunUseCard from "../features/speedrun/callbacks/useCard";

export function init(mod: Mod): void {
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

  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    soulOfIsaac,
    Card.CARD_SOUL_ISAAC, // 81
  );
}

export function main(card: Card): void {
  streakText.useCard(card);
}

// Card.CARD_JUSTICE (9)
function justice(_card: Card, player: EntityPlayer, _useFlags: int) {
  automaticInsertion.useCardJustice(player);
}

// Card.RUNE_BLACK (41)
function blackRune(_card: Card, _player: EntityPlayer, _useFlags: int) {
  speedrunUseCard.blackRune();
}

// Card.CARD_SOUL_ISAAC (81)
function soulOfIsaac(_card: Card, _player: EntityPlayer, _useFlags: int) {
  preventItemRotate.useCardSoulOfIsaac();
}
