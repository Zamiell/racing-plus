import { PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import { speedrunPreItemPickup } from "../features/speedrun/callbacks/preItemPickup";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  // Mandatory
  streakText.preItemPickup(pickingUpItem);

  // Major
  speedrunPreItemPickup(player, pickingUpItem);

  // QoL
  automaticItemInsertion.preItemPickup(player, pickingUpItem);
}
