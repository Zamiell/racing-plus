import {
  getBlueWombDoor,
  getRepentanceDoor,
  removeDoor,
  removeGridEntity,
} from "isaacscript-common";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { inClearedMomBossRoom } from "../../../../utils";
import { NORMAL_TRAPDOOR_GRID_INDEX } from "../../optional/major/fastTravel/fastTravelEntity";
import { season3HasHushGoal, season3HasOnlyDogmaLeft } from "./v";

export function season3PostFastClear(): void {
  if (!onSeason(3)) {
    return;
  }

  unlockRepentanceDoor();
  preventGoalSoftlocks();
}

function unlockRepentanceDoor() {
  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor !== undefined) {
    repentanceDoor.SetLocked(false);
    repentanceDoor.Open();
  }
}

function preventGoalSoftlocks() {
  checkHush();
  checkDogma();
}

function checkHush() {
  if (season3HasHushGoal()) {
    return;
  }

  const blueWombDoor = getBlueWombDoor();
  if (blueWombDoor !== undefined) {
    removeDoor(blueWombDoor);
  }
}

function checkDogma() {
  if (!season3HasOnlyDogmaLeft()) {
    return;
  }

  if (inClearedMomBossRoom()) {
    removeGridEntity(NORMAL_TRAPDOOR_GRID_INDEX, false);
  }
}
