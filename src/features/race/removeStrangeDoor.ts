import { LevelStage } from "isaac-typescript-definitions";
import {
  getRepentanceDoor,
  inStartingRoom,
  onEffectiveStage,
  onRepentanceStage,
  removeDoor,
} from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.THE_BEAST
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
    onEffectiveStage(LevelStage.DEPTHS_2) &&
    inStartingRoom() &&
    !onRepentanceStage()
  );
}
