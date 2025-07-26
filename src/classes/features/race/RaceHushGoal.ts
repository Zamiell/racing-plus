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
  ModCallbackCustom,
  game,
  inRoomType,
  isRoomInsideGrid,
  onStage,
  spawnGridEntity,
} from "isaacscript-common";
import { inRaceToHush } from "../../../features/race/v";
import type { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";
import { spawnTrophy } from "../mandatory/misc/Trophy";

export class RaceHushGoal extends ConfigurableModFeature {
  configKey: keyof Config = "ClientCommunication";

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
  if (shouldRemoveVoidDoor()) {
    removeVoidDoor();
  }
}

function shouldRemoveVoidDoor() {
  return (
    inRaceToHush()
    && onStage(LevelStage.BLUE_WOMB)
    && inRoomType(RoomType.BOSS)
    && isRoomInsideGrid()
  );
}

function removeVoidDoor() {
  const room = game.GetRoom();

  const voidDoor = room.GetDoor(DoorSlot.UP_1);
  if (voidDoor === undefined) {
    return;
  }

  // Spawning a wall on top of the door will automatically delete the door.
  const gridIndex = voidDoor.GetGridIndex();
  spawnGridEntity(GridEntityType.WALL, gridIndex);
}
