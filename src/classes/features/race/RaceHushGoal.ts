import {
  DoorSlot,
  EntityType,
  GridEntityType,
  LevelStage,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  inRoomType,
  isRoomInsideGrid,
  ModCallbackCustom,
  onStage,
  spawnGridEntity,
} from "isaacscript-common";
import { inRaceToHush } from "../../../features/race/v";
import { MandatoryModFeature } from "../../MandatoryModFeature";
import { spawnTrophy } from "../mandatory/misc/Trophy";

export class RaceHushGoal extends MandatoryModFeature {
  // 68, 407
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.HUSH)
  postEntityKillHush(): void {
    if (!inRaceToHush()) {
      return;
    }

    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    spawnTrophy(centerPos);
  }

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    checkDeleteDoor();
    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    checkDeleteDoor();
  }
}

function checkDeleteDoor() {
  if (shouldDeleteVoidDoor()) {
    deleteVoidDoor();
  }
}

function shouldDeleteVoidDoor() {
  return (
    inRaceToHush() &&
    onStage(LevelStage.BLUE_WOMB) &&
    inRoomType(RoomType.BOSS) &&
    isRoomInsideGrid()
  );
}

function deleteVoidDoor() {
  const room = game.GetRoom();

  const voidDoor = room.GetDoor(DoorSlot.UP_1);
  if (voidDoor === undefined) {
    return;
  }

  // Spawning a wall on top of the door will automatically delete the door.
  const gridIndex = voidDoor.GetGridIndex();
  spawnGridEntity(GridEntityType.WALL, gridIndex);
}
