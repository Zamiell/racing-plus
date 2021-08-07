import { getItemName, PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const itemName = getItemName(pickingUpItem.id);

  streakText.set(itemName);
}
