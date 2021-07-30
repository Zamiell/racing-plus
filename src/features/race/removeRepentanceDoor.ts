// For races to The Beast, the player must go to Depths 2
// Thus, we must prevent them from going to the Mausoleum floors by deleting the doors

import { getDoors, isRepentanceStage, log } from "isaacscript-common";
import g from "../../globals";

// MC_POST_NEW_ROOM (18)
export function postNewRoom(): void {
  removeRepentanceDoor();
}

// MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  removeRepentanceDoor();
}

function removeRepentanceDoor() {
  const stage = g.l.GetStage();
  const repentanceStage = isRepentanceStage();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast" ||
    roomType !== RoomType.ROOM_BOSS ||
    ((!repentanceStage || stage !== 4) && (repentanceStage || stage !== 5))
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

    for (const door of getDoors()) {
      if (door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
        g.r.RemoveDoor(door.Slot);
        log(
          "Manually removed the Mausoleum door (for races going to The Beast).",
        );
      }
    }
  }
}
