import {
  EffectVariant,
  LevelStage,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  isRoomInsideGrid,
  removeAllEffects,
  removeAllTrapdoors,
  spawnPickup,
} from "isaacscript-common";
import { season3HasHushGoal } from "../../../../classes/features/speedrun/season3/v";
import { g } from "../../../../globals";
import { onSeason } from "../../speedrun";

/** This intentionally does not use the `PRE_SPAWN_CLEAR_AWARD` callback. */
export function season3PostRoomClearChanged(roomClear: boolean): void {
  if (!onSeason(3)) {
    return;
  }

  if (!roomClear) {
    return;
  }

  checkHushCleared();
}

/**
 * Fast clear will be triggered after clearing Hush, so to avoid conflicting with that feature, we
 * spawn the Checkpoint in the `POST_ROOM_CLEAR_CHANGED` callback, which only triggers on the
 * subsequent frame.
 */
function checkHushCleared() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (
    stage === LevelStage.BLUE_WOMB &&
    roomType === RoomType.BOSS &&
    isRoomInsideGrid() &&
    season3HasHushGoal()
  ) {
    removeAllTrapdoors();
    removeAllEffects(EffectVariant.HEAVEN_LIGHT_DOOR);

    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = g.r.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
