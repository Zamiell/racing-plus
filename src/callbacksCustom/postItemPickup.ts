import { PickingUpItem } from "isaacscript-common";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  Isaac.DebugString(`PICKING UP ITEM: ${pickingUpItem.id}`);
}
