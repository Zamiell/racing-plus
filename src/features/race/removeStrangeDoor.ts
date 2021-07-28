import { MAX_NUM_DOORS } from "../../constants";
import g from "../../globals";
import log from "../../log";
import { getRoomIndex, isAntibirthStage } from "../../misc";

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const antibirthStage = isAntibirthStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    antibirthStage ||
    stage !== 6 ||
    roomIndex !== startingRoomIndex
  ) {
    return;
  }

  for (let i = 0; i < MAX_NUM_DOORS; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
      g.r.RemoveDoor(i);
      log("Manually removed the strange door (for races going to The Beast).");
    }
  }
}
