import { PickingUpItem } from "isaacscript-common";
import racePostItemPickup from "../features/race/callbacks/postItemPickup";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  racePostItemPickup(pickingUpItem);
}
