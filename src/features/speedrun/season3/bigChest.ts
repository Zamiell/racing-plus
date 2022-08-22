import { onCathedral, onSheol } from "isaacscript-common";
import { BigChestReplacementAction } from "../../../enums/BigChestReplacementAction";
import { isOnFinalCharacter } from "../speedrun";
import { getSeason3GoalCorrespondingToRoom } from "./checkpoint";

export function getSeason3BigChestReplacementAction(): BigChestReplacementAction {
  if (onSheol()) {
    return BigChestReplacementAction.TRAPDOOR;
  }

  if (onCathedral()) {
    return BigChestReplacementAction.HEAVEN_DOOR;
  }

  const goal = getSeason3GoalCorrespondingToRoom();
  if (goal === undefined) {
    return BigChestReplacementAction.LEAVE_ALONE;
  }

  return isOnFinalCharacter()
    ? BigChestReplacementAction.TROPHY
    : BigChestReplacementAction.CHECKPOINT;
}
