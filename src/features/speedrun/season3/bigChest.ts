import { onCathedral, onSheol } from "isaacscript-common";
import { v } from "../../../classes/features/speedrun/season3/v";
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

  // Don't allow repeat goals over the course of the same 7 character speedrun.
  if (!v.persistent.remainingGoals.includes(goal)) {
    return BigChestReplacementAction.LEAVE_ALONE;
  }

  return isOnFinalCharacter()
    ? BigChestReplacementAction.TROPHY
    : BigChestReplacementAction.CHECKPOINT;
}
