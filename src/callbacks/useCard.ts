import * as streakText from "../features/mandatory/streakText";
import g from "../globals";

export function main(card: Card): void {
  showStreakText(card);
}

function showStreakText(card: Card) {
  // We ignore Blank Runes because we want to show the streak text of the actual random effect
  if (card !== Card.RUNE_BLANK) {
    const cardName = g.itemConfig.GetCard(card).Name;
    streakText.set(cardName);
  }
}
