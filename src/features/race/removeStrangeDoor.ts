import {
  getRepentanceDoor,
  getRoomIndex,
  onRepentanceStage,
} from "isaacscript-common";
import g from "../../globals";
import RaceGoal from "./types/RaceGoal";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();
  const repentanceStage = onRepentanceStage();

  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.THE_BEAST ||
    repentanceStage ||
    stage !== 6 ||
    roomIndex !== startingRoomIndex
  ) {
    return;
  }

  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor !== undefined) {
    g.r.RemoveDoor(repentanceDoor.Slot);
  }
}
