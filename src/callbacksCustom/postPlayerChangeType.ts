import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(
  player: EntityPlayer,
  _oldCharacter: PlayerType,
  _newCharacter: PlayerType,
): void {
  startWithD6.postPlayerChangeType(player);
}
