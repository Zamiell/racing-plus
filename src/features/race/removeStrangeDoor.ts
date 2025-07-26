import { LevelStage } from "isaac-typescript-definitions";
import {
  getRepentanceDoor,
  inStartingRoom,
  onRepentanceStage,
  onStage,
  removeDoor,
} from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS
    || g.race.myStatus !== RacerStatus.RACING
    || g.race.goal !== RaceGoal.THE_BEAST
  ) {
    return;
  }

  if (inRoomWithStrangeDoor()) {
    const repentanceDoor = getRepentanceDoor();
    if (repentanceDoor !== undefined) {
      removeDoor(repentanceDoor);
    }
  }
}

function inRoomWithStrangeDoor(): boolean {
  return (
    onStage(LevelStage.DEPTHS_2) && !onRepentanceStage() && inStartingRoom()
  );
}
