import * as season8 from "../challenges/season8";

export function main(
  rng: RNG,
  currentCard: Card,
  includePlayingCards: boolean,
  includeRunes: boolean,
  onlyRunes: boolean,
): Card | null {
  return season8.getCard(
    rng,
    currentCard,
    includePlayingCards,
    includeRunes,
    onlyRunes,
  );
}
