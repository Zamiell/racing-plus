import {
  getBlueWombDoor,
  removeDoor,
  removeGridEntity,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { inClearedMomBossRoom } from "../../../utilsGlobals";
import { NORMAL_TRAPDOOR_GRID_INDEX } from "../../optional/major/fastTravel/fastTravel";
import { season3HasHushGoal, season3HasOnlyDogmaLeft } from "./v";

export function season3FastClear(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  preventGoalSoftlocks();
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
