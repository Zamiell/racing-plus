import * as streakText from "../features/mandatory/streakText";

export function main(
  player: EntityPlayer,
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  streakText.postTransformation(player, playerForm, hasForm);
}
