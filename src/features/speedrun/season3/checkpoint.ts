import { LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  inMegaSatanRoom,
  onChest,
  onDarkRoom,
  onRepentanceStage,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import g from "../../../globals";
import { Season3Goal } from "./constants";
import v from "./v";

/** We need to remove the corresponding goal related to this Checkpoint. */
export function season3CheckpointTouched(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  // Show the remaining goals.
  v.run.goalCompleted = true;

  const goal = getSeason3GoalCorrespondingToRoom();
  if (goal !== undefined) {
    arrayRemoveInPlace(v.persistent.remainingGoals, goal);
  }
}

export function getSeason3GoalCorrespondingToRoom(): Season3Goal | undefined {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const repentanceStage = onRepentanceStage();

  // First, check for goals related to the specific room type.
  if (roomType === RoomType.BOSS_RUSH) {
    return Season3Goal.BOSS_RUSH;
  }

  if (inMegaSatanRoom()) {
    return Season3Goal.MEGA_SATAN;
  }

  // Second, check for goals relating to the stage.
  if (stage === LevelStage.BLUE_WOMB) {
    return Season3Goal.HUSH;
  }

  if (onChest()) {
    return Season3Goal.BLUE_BABY;
  }

  if (onDarkRoom()) {
    return Season3Goal.THE_LAMB;
  }

  if (stage === LevelStage.WOMB_2 && repentanceStage) {
    return Season3Goal.MOTHER;
  }

  if (stage === LevelStage.HOME) {
    return Season3Goal.DOGMA;
  }

  return undefined;
}
