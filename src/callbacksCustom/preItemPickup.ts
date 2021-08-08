import { getItemName, PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const trinket = pickingUpItem.type === ItemType.ITEM_TRINKET;
  const itemName = getItemName(pickingUpItem.id, trinket);

  streakText.set(itemName);
}
