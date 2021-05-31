import g from "../globals";

export function main(card: Card): void {
  showStreakText(card);
}

function showStreakText(card: Card) {
  if (card !== Card.RUNE_BLANK) {
    // We ignore Blank Runes because we want to show the streak text of the actual random effect
    g.run.streakText.text = g.itemConfig.GetCard(card).Name;
    g.run.streakText.frame = Isaac.GetFrameCount();
  }
}
