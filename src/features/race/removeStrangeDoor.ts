import {
  getRepentanceDoor,
  getRoomIndex,
  onRepentanceStage,
} from "isaacscript-common";
import g from "../../globals";

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();
  const repentanceStage = onRepentanceStage();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    repentanceStage ||
    stage !== 6 ||
    roomIndex !== startingRoomIndex
  ) {
    return;
  }

  const repentanceDoor = getRepentanceDoor();
  if (repentanceDoor !== null) {
    g.r.RemoveDoor(repentanceDoor.Slot);
  }
}
