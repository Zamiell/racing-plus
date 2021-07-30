import { getPlayerIndex, getPlayers } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import g from "../globals";

const TRANSFORMATION_NAMES = [
  "Guppy",
  "Beelzebub",
  "Fun Guy",
  "Seraphim",
  "Bob",
  "Spun",
  "Yes Mother?",
  "Conjoined",
  "Leviathan",
  "Oh Crap",
  "Bookworm",
  "Adult",
  "Spider Baby",
  "Stompy",
  "Flight", // Unused
];

export function postUpdate(): void {
  for (const player of getPlayers()) {
    const index = getPlayerIndex(player);
    const transformations = g.run.transformations.get(index);
    if (transformations === undefined) {
      error(
        `Failed to get the transformation array for player index: ${index}`,
      );
    }

    for (let i = 0; i < PlayerForm.NUM_PLAYER_FORMS; i++) {
      const hasForm = player.HasPlayerForm(i);
      const storedForm = transformations[i];
      if (storedForm === undefined)
        if (hasForm && !storedForm) {
          // We have gotten a new transformation that has not been recorded yet
          transformations[i] = true;
          postTransformation(i);
        }
    }
  }
}

function postTransformation(transformation: PlayerForm) {
  showStreakText(transformation);
}

function showStreakText(transformation: PlayerForm) {
  const transformationName = TRANSFORMATION_NAMES[transformation];
  streakText.set(transformationName);
}
