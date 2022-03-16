import {
  ensureAllCases,
  getCollectibles,
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRandomInt,
  getRepentanceDoor,
  preventCollectibleRotate,
  removeAllPickups,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { RepentanceDoorState } from "../../../enums/RepentanceDoorState";
import g from "../../../globals";
import { isPlanetariumFixWarping } from "../../mandatory/planetariumFix";
import { setDevilAngelEmpty } from "../../optional/major/betterDevilAngelRooms/v";
import { season2PostNewRoom } from "../season2/callbacks/postNewRoom";
import { inSpeedrun, isOnFirstCharacter } from "../speedrun";
import v from "../v";

export function speedrunPostNewRoom(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkFirstCharacterFirstFloorDevilRoom();
  checkWomb2IAMERROR();
  checkEnteringClearedBossRoom();
  checkEnteringRoomWithCheckpoint();
  season2PostNewRoom();
}

function checkFirstCharacterFirstFloorDevilRoom() {
  const roomType = g.r.GetType();
  const previousRoomType = v.level.previousRoomType;
  const effectiveStage = getEffectiveStage();

  v.level.previousRoomType = roomType;

  // Prevent players from resetting for a Devil Room item on the first character
  if (!isOnFirstCharacter() || effectiveStage !== 1) {
    return;
  }

  if (
    (roomType === RoomType.ROOM_DEVIL || roomType === RoomType.ROOM_ANGEL) &&
    previousRoomType === RoomType.ROOM_CURSE
  ) {
    emptyDevilAngelRoom();

    // Later on in this callback, the Devil Room or Angel Room will be replaced with a seeded
    // version of the room
    // Notify the seeded rooms feature to keep the room empty
    setDevilAngelEmpty();
  }
}

function emptyDevilAngelRoom() {
  removeAllPickups();

  if (isPlanetariumFixWarping()) {
    return;
  }

  // Signal that we are not supposed to get the items in this room
  // Since they are teleporting into the room, the animation will not actually play,
  // but they will still be able to hear the sound effect
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}

function checkWomb2IAMERROR() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const seed = g.l.GetDungeonPlacementSeed();

  if (stage !== 8 || roomType !== RoomType.ROOM_ERROR) {
    return;
  }

  // Since we are in a challenge that has 'altpath="true"',
  // the game will always spawn a beam of light going to the Cathedral
  // In vanilla, there would be a 50% chance to spawn a trapdoor
  // Emulate the vanilla functionality
  const trapdoorChance = getRandomInt(1, 2, seed);
  if (trapdoorChance === 1) {
    return;
  }

  const heavenDoors = getEffects(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  for (const heavenDoor of heavenDoors) {
    heavenDoor.Remove();
    const gridIndex = g.r.GetGridIndex(heavenDoor.Position);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_TRAPDOOR,
      TrapdoorVariant.NORMAL,
      gridIndex,
    );
  }
}

/**
 * The Repentance door spawned with the "TrySpawnSecretExit" method is ephemeral in that it will be
 * deleted if you leave the room. Thus, attempt to respawn it if we re-enter a cleared Boss Room.
 */
function checkEnteringClearedBossRoom() {
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();
  const effectiveStage = getEffectiveStage();

  if (
    roomType === RoomType.ROOM_BOSS &&
    (effectiveStage === 1 || effectiveStage === 2) &&
    roomClear
  ) {
    g.r.TrySpawnSecretExit(false, true);
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

    default: {
      ensureAllCases(v.level.repentanceDoorState);
    }
  }
}

/**
 * If Tainted Isaac re-enters a room with a checkpoint in it, it will no longer have the
 * "preventCollectibleRotate" property from the standard library. Thus, we need to reapply this
 * every time we re-enter the room.
 */
function checkEnteringRoomWithCheckpoint() {
  const checkpoints = getCollectibles(
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );
  for (const checkpoint of checkpoints) {
    preventCollectibleRotate(
      checkpoint,
      CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
    );
  }
}
