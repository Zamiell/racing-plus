import {
  getBlueWombDoor,
  getRepentanceDoor,
  removeDoor,
  removeGridEntity,
} from "isaacscript-common";
import {
  season3HasHushGoal,
  season3HasOnlyDogmaLeft,
} from "../../../classes/features/speedrun/season3/v";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { inClearedMomBossRoom } from "../../../utilsGlobals";
import { NORMAL_TRAPDOOR_GRID_INDEX } from "../../optional/major/fastTravel/fastTravel";

export function season3FastClear(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
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
