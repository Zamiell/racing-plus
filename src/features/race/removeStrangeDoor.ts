import {
  getDoors,
  getRoomIndex,
  log,
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

  for (const door of getDoors()) {
    if (door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
      g.r.RemoveDoor(door.Slot);
      log("Manually removed the strange door (for races going to The Beast).");
    }
  }
}
