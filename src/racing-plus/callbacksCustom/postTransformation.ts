import * as streakText from "../features/mandatory/streakText";

export function main(
  _player: EntityPlayer,
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  streakText.postTransformation(playerForm, hasForm);
}
