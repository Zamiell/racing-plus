import {
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  game,
  getCollectibles,
  getEffects,
  getPlayers,
  getRandom,
  getRepentanceDoor,
  hasUnusedDoorSlot,
  inRoomType,
  onFirstFloor,
  removeAllPickups,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { RepentanceDoorState } from "../../../enums/RepentanceDoorState";
import { mod } from "../../../mod";
import { isPlanetariumFixWarping } from "../../mandatory/planetariumFix";
import { setDevilAngelEmpty } from "../../optional/major/betterDevilAngelRooms/v";
import { speedrunShouldSpawnRepentanceDoor } from "../fastClear";
import { inSpeedrun, isOnFirstCharacter } from "../speedrun";
import { v } from "../v";

export function speedrunPostNewRoom(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkFirstCharacterFirstFloorDevilRoom();
  checkWomb2IAmError();
  checkEnteringClearedBossRoom();
  checkEnteringRoomWithCheckpoint();
}

function checkFirstCharacterFirstFloorDevilRoom() {
  const room = game.GetRoom();
  const roomType = room.GetType();
  const { previousRoomType } = v.level;

  v.level.previousRoomType = roomType;

  // Prevent players from resetting for a Devil Room item on the first character.
  if (!isOnFirstCharacter() || !onFirstFloor()) {
    return;
  }

  if (
    inRoomType(RoomType.DEVIL, RoomType.ANGEL) &&
    previousRoomType === RoomType.CURSE
  ) {
    emptyDevilAngelRoom();

    // Later on in this callback, the Devil Room or Angel Room will be replaced with a seeded
    // version of the room. Notify the seeded rooms feature to keep the room empty.
    setDevilAngelEmpty();
  }
}

function emptyDevilAngelRoom() {
  removeAllPickups();

  if (isPlanetariumFixWarping()) {
    return;
  }

  // Signal that we are not supposed to get the items in this room. Since they are teleporting into
  // the room, the animation will not actually play, but they will still be able to hear the sound
  // effect.
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}

function checkWomb2IAmError() {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const room = game.GetRoom();
  const levelSeed = level.GetDungeonPlacementSeed();

  if (stage !== LevelStage.WOMB_2 || !inRoomType(RoomType.ERROR)) {
    return;
  }

  // Since we are in a challenge that has 'altpath="true"', the game will always spawn a beam of
  // light going to the Cathedral. In vanilla, there would be a 50% chance to spawn a trapdoor.
  // Emulate the vanilla functionality.
  const trapdoorChance = getRandom(levelSeed);
  if (trapdoorChance < 0.5) {
    return;
  }

  const heavenDoors = getEffects(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  for (const heavenDoor of heavenDoors) {
    heavenDoor.Remove();
    const gridIndex = room.GetGridIndex(heavenDoor.Position);
    spawnGridEntityWithVariant(
      GridEntityType.TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}

/**
 * The Repentance door spawned with the "Room.TrySpawnSecretExit" method is ephemeral in that it
 * will be deleted if you leave the room. Thus, attempt to respawn it if we re-enter a cleared Boss
 * Room.
 */
function checkEnteringClearedBossRoom() {
  if (speedrunShouldSpawnRepentanceDoor() && hasUnusedDoorSlot()) {
    const room = game.GetRoom();
    room.TrySpawnSecretExit(false, true);
    setRepentanceDoorState();
  }
}

function setRepentanceDoorState() {
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

/**
 * If Tainted Isaac re-enters a room with a checkpoint in it, it will no longer have the
 * "preventCollectibleRotation" property from the standard library. Thus, we need to reapply this
 * every time we re-enter the room.
 */
function checkEnteringRoomWithCheckpoint() {
  const checkpoints = getCollectibles(CollectibleTypeCustom.CHECKPOINT);
  for (const checkpoint of checkpoints) {
    mod.preventCollectibleRotation(
      checkpoint,
      CollectibleTypeCustom.CHECKPOINT,
    );
  }
}
