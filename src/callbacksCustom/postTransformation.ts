import * as streakText from "../features/mandatory/streakText";

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

export function main(
  _player: EntityPlayer,
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  if (hasForm) {
    showStreakText(playerForm);
  }
}

function showStreakText(playerForm: PlayerForm) {
  const transformationName = TRANSFORMATION_NAMES[playerForm];
  streakText.set(transformationName);
}
