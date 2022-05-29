import {
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  ensureAllCases,
  getCollectibles,
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRandom,
  getRepentanceDoor,
  isRoomInsideMap,
  preventCollectibleRotation,
  removeAllPickups,
  spawnGridWithVariant,
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
  const { previousRoomType } = v.level;
  const effectiveStage = getEffectiveStage();

  v.level.previousRoomType = roomType;

  // Prevent players from resetting for a Devil Room item on the first character.
  if (!isOnFirstCharacter() || effectiveStage !== 1) {
    return;
  }

  if (
    (roomType === RoomType.DEVIL || roomType === RoomType.ANGEL) &&
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

function checkWomb2IAMERROR() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const levelSeed = g.l.GetDungeonPlacementSeed();

  if (stage !== LevelStage.WOMB_2 || roomType !== RoomType.ERROR) {
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
    const gridIndex = g.r.GetGridIndex(heavenDoor.Position);
    spawnGridWithVariant(
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
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();
  const effectiveStage = getEffectiveStage();
  const roomInsideMap = isRoomInsideMap();

  if (
    roomType === RoomType.BOSS &&
    (effectiveStage === 1 || effectiveStage === 2) &&
    roomClear &&
    roomInsideMap // Handle the case of Emperor? card rooms
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
 * "preventCollectibleRotation" property from the standard library. Thus, we need to reapply this
 * every time we re-enter the room.
 */
function checkEnteringRoomWithCheckpoint() {
  const checkpoints = getCollectibles(CollectibleTypeCustom.CHECKPOINT);
  for (const checkpoint of checkpoints) {
    preventCollectibleRotation(checkpoint, CollectibleTypeCustom.CHECKPOINT);
  }
}
