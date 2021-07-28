import { MAX_NUM_DOORS } from "../../constants";
import g from "../../globals";
import log from "../../log";
import { isAntibirthStage } from "../../misc";

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const antibirthStage = isAntibirthStage();
  const strangeDoor = GridRooms.ROOM_SECRET_EXIT_IDX;
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    antibirthStage ||
    stage !== 6 ||
    strangeDoor !== startingRoomIndex
  ) {
    return;
  }

  for (let i = 0; i < MAX_NUM_DOORS; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.TargetRoomIndex === strangeDoor) {
      g.r.RemoveDoor(i);
      log("Removed the Strange door on D2.");
    }
  }
}
