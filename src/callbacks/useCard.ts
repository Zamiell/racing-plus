import * as streakText from "../features/mandatory/streakText";

export function main(card: Card): void {
  // This callback does not pass the player, so we have to assume player 0 ate the pill
  const player = Isaac.GetPlayer();

  streakText.useCard(player, card);
}
