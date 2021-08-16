import { PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import { speedrunPreItemPickup } from "../features/speedrun/callbacks/preItemPickup";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  // Mandatory features
  streakText.preItemPickup(pickingUpItem);

  // Major features
  speedrunPreItemPickup(player, pickingUpItem);

  // Quality of life
  automaticItemInsertion.preItemPickup(player, pickingUpItem);
}
