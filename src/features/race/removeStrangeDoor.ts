import {
  getRepentanceDoor,
  inStartingRoom,
  onRepentanceStage,
  removeDoor,
} from "isaacscript-common";
import g from "../../globals";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

// ModCallbacks.MC_POST_NEW_ROOM (19)
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
