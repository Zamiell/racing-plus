import * as streakText from "../features/mandatory/streakText";
import * as automaticInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_CARD,
    justice,
    Card.CARD_JUSTICE, // 9
  );
}

export function main(card: Card): void {
  streakText.useCard(card);
}

// Card.CARD_JUSTICE (9)
function justice(_card: Card, player: EntityPlayer, _useFlags: int): void {
  automaticInsertion.useCardJustice(player);
}
