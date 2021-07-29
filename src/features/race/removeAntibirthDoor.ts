import g from "../../globals";
import log from "../../log";
import { getAllDoors, isAntibirthStage } from "../../utilGlobals";

export default function removeAntibirthDoor(): void {
  const stage = g.l.GetStage();
  const antibirthStage = isAntibirthStage();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    roomType !== RoomType.ROOM_BOSS ||
    ((!antibirthStage || stage !== 4) && (antibirthStage || stage !== 5))
  ) {
    return;
  }

  if (roomClear) {
    const dustClouds = Isaac.FindByType(
      EntityType.ENTITY_EFFECT,
      EffectVariant.DUST_CLOUD,
    );

    for (const dust of dustClouds) {
      dust.Remove();
      log("Manually removed the dust clouds (for races going to The Beast).");
    }

    for (const door of getAllDoors()) {
      if (door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
        g.r.RemoveDoor(door.Slot);
        log(
          "Manually removed the Mausoleum door (for races going to The Beast).",
        );
      }
    }
  }
}

export function postNewRoom(): void {
  const stage = g.l.GetStage();
  const antibirthStage = isAntibirthStage();
  const roomType = g.r.GetType();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    roomType !== RoomType.ROOM_BOSS ||
    ((!antibirthStage || stage !== 4) && (antibirthStage || stage !== 5))
  ) {
    return;
  }

  for (const door of getAllDoors()) {
    if (door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
      g.r.RemoveDoor(door.Slot);
      log(
        "Manually removed the Mausoleum door (for races going to The Beast).",
      );
    }
  }
}
