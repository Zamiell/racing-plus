import {
  Dimension,
  LevelStage,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getAngelRoomDoor,
  getDevilRoomDoor,
  getDimension,
  getRepentanceDoor,
  hasUnusedDoorSlot,
  inRoomType,
  isRoomInsideGrid,
  onRepentanceStage,
  removeDoor,
} from "isaacscript-common";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constants";
import { inSpeedrun, onSeason } from "../../../speedrun/utilsSpeedrun";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { combineDevilAngelRoomDoors } from "../optional/quality/CombinedDualityDoors";
import { season3HasMotherGoal } from "./season3/v";

enum RepentanceDoorState {
  INITIAL,
  UNLOCKED,

  /**
   * Doors to the Mines can be half-bombed, but we don't need to track this. (The game appears to
   * track it properly without having to do anything additional.)
   */

  /**
   * Doors to Mausoleum can be half-donated-to, but we don't need to track this. (The game appears
   * to track it properly without having to do anything additional.)
   */
}

const v = {
  level: {
    repentanceDoorState: RepentanceDoorState.INITIAL,
  },
};

/**
 * Paths to Repentance floors will not appear in custom challenges that have a goal of Blue Baby.
 * Thus, we spawn the path manually if we are on a custom challenge.
 *
 * However, we only spawn the the Downpour/Dross doors to avoid the bug where picking up Goat Head
 * in a Boss Room and then re-entering the room causes the Devil Room to become blocked.
 */
export class SpawnRepentanceDoor extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkRepentanceDoorState();
  }

  checkRepentanceDoorState(): void {
    const repentanceDoorState = this.getRepentanceDoorState();
    if (repentanceDoorState !== undefined) {
      v.level.repentanceDoorState = repentanceDoorState;
    }
  }

  getRepentanceDoorState(): RepentanceDoorState | undefined {
    const repentanceDoor = getRepentanceDoor();
    if (repentanceDoor === undefined) {
      return undefined;
    }

    if (repentanceDoor.IsLocked()) {
      return RepentanceDoorState.INITIAL;
    }

    return RepentanceDoorState.UNLOCKED;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.checkEnteringClearedBossRoom();
  }

  /**
   * The Repentance door spawned with the "Room.TrySpawnSecretExit" method is ephemeral in that it
   * will be deleted if you leave the room. Thus, attempt to respawn it if we re-enter a cleared
   * Boss Room.
   */
  checkEnteringClearedBossRoom(): void {
    if (shouldSpawnRepentanceDoor() && hasUnusedDoorSlot()) {
      const room = game.GetRoom();
      room.TrySpawnSecretExit(false, true);
      this.setRepentanceDoorState();
    }
  }

  setRepentanceDoorState(): void {
    const repentanceDoor = getRepentanceDoor();
    if (repentanceDoor === undefined) {
      return;
    }

    switch (v.level.repentanceDoorState) {
      case RepentanceDoorState.INITIAL: {
        if (!repentanceDoor.IsLocked()) {
          repentanceDoor.SetLocked(true);
        }

        break;
      }

      case RepentanceDoorState.UNLOCKED: {
        if (repentanceDoor.IsLocked()) {
          repentanceDoor.SetLocked(false);
        }

        break;
      }
    }
  }
}

export function spawnRepentanceDoorPostFastClear(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkSpawnRepentanceDoor();
}

function checkSpawnRepentanceDoor() {
  const room = game.GetRoom();

  if (!shouldSpawnRepentanceDoor()) {
    return;
  }

  if (hasUnusedDoorSlot()) {
    room.TrySpawnSecretExit(true, true);
  } else {
    const devilRoomDoor = getDevilRoomDoor();
    const angelRoomDoor = getAngelRoomDoor();
    if (devilRoomDoor !== undefined && angelRoomDoor !== undefined) {
      // Both a Devil Room and an Angel Room door spawned, so there was no room left for the
      // Repentance door. Delete the Angel Room door and respawn the Repentance door.
      removeDoor(angelRoomDoor);
      room.TrySpawnSecretExit(true, true);

      // Leverage the "CombinedDualityDoors" feature to combine the Devil Room door with the Angel
      // Room door.
      combineDevilAngelRoomDoors(devilRoomDoor);
    }
  }
}

function shouldSpawnRepentanceDoor(): boolean {
  const room = game.GetRoom();
  const roomClear = room.IsClear();
  const dimension = getDimension();

  return (
    isCorrectStageForRepentanceDoor() &&
    inRoomType(RoomType.BOSS) &&
    isRoomInsideGrid() && // Handle the case of Emperor? card rooms.
    dimension === Dimension.MAIN &&
    roomClear
  );
}

function isCorrectStageForRepentanceDoor(): boolean {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const repentanceStage = onRepentanceStage();

  if (onSeason(3)) {
    if (!season3HasMotherGoal()) {
      return false;
    }

    return (
      // Basement 2 --> Downpour/Dross 2
      (stage === LevelStage.BASEMENT_2 && !repentanceStage) ||
      // Downpour/Dross 2 --> Mines/Ashpit 1
      (stage === LevelStage.BASEMENT_2 && repentanceStage) ||
      // Mines/Ashpit 2 --> Mausoleum/Gehenna 1
      (stage === LevelStage.CAVES_2 && repentanceStage)
    );
  }

  return (
    (stage === LevelStage.BASEMENT_1 || stage === LevelStage.BASEMENT_2) &&
    !repentanceStage
  );
}
