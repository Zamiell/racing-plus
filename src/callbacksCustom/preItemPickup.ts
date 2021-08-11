import { PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";

export function main(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
  streakText.preItemPickup(pickingUpItem);
  automaticItemInsertion.preItemPickup(player, pickingUpItem);
}
