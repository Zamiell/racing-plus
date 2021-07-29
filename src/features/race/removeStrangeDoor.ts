import { getDoors, getRoomIndex, log } from "isaacscript-common";
import g from "../../globals";
import { isAntibirthStage } from "../../utilGlobals";

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

  for (const door of getDoors()) {
    if (door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
      g.r.RemoveDoor(door.Slot);
      log("Manually removed the strange door (for races going to The Beast).");
    }
  }
}
