import { PickingUpItem } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import racePostItemPickup from "../features/race/callbacks/postItemPickup";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  racePostItemPickup(pickingUpItem);
  startWithD6.postItemPickup(player, pickingUpItem);
}
