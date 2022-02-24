import * as streakText from "../features/mandatory/streakText";

export function main(
  _player: EntityPlayer,
  playerForm: PlayerForm,
  hasForm: boolean,
): void {
  Isaac.DebugString(`GETTING HERE - ${playerForm} - ${hasForm}`);
  streakText.postTransformation(playerForm, hasForm);
}
