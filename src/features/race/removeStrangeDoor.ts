import {
  getRepentanceDoor,
  inStartingRoom,
  onRepentanceStage,
  removeDoor,
} from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();

  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.THE_BEAST ||
    repentanceStage ||
    stage !== 6 ||
    !inStartingRoom()
  ) {
    return;
  }

  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor !== undefined) {
    removeDoor(repentanceDoor);
  }
}
