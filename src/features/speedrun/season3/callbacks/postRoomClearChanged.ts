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
import g from "../../../../globals";
import { Season3Goal } from "../constants";
import v from "../v";

/**
 * Fast clear will be triggered after clearing Hush, so to avoid conflicting with that feature, we
 * spawn the Checkpoint in the `POST_ROOM_CLEAR_CHANGED` callback, which only triggers on the
 * subsequent frame.
 */
export function season3PostRoomClearChanged(roomCleared: boolean): void {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (
    stage === LevelStage.BLUE_WOMB &&
    roomType === RoomType.BOSS &&
    isRoomInsideGrid() &&
    roomCleared &&
    v.persistent.remainingGoals.includes(Season3Goal.HUSH)
  ) {
    removeAllTrapdoors();
    removeAllEffects(EffectVariant.HEAVEN_LIGHT_DOOR);

    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = g.r.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
