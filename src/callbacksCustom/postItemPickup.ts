import { PickingUpItem } from "isaacscript-common";
import fastInsertion from "../features/optional/quality/fastInsertion/fastInsertion";
import racePostItemPickup from "../features/race/callbacks/postItemPickup";

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  postItemPickupFastInsertion(pickingUpItem);
  racePostItemPickup(pickingUpItem);
}

function postItemPickupFastInsertion(pickingUpItem: PickingUpItem) {
  const postItemFunction = fastInsertion.get(pickingUpItem.id);

  if (postItemFunction !== undefined) {
    postItemFunction();
  }
}
