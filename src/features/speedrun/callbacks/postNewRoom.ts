import {
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRandomInt,
  removeAllCollectibles,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../../globals";
import { setDevilAngelEmpty } from "../../optional/major/betterDevilAngelRooms/v";
import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import { inSpeedrun, isOnFirstCharacter } from "../speedrun";
import v from "../v";

export function speedrunPostNewRoom(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkFirstCharacterFirstFloorDevilRoom();
  checkWomb2IAMERROR();
  allowVanillaPathsInRepentanceChallenge.postNewRoom();
}

function checkFirstCharacterFirstFloorDevilRoom() {
  // Prevent players from resetting for a Devil Room item on the first character
  if (!isOnFirstCharacter()) {
    return;
  }

  const effectiveStage = getEffectiveStage();
  const roomType = g.r.GetType();

  if (effectiveStage !== 1) {
    return;
  }

  if (
    (roomType === RoomType.ROOM_DEVIL || roomType === RoomType.ROOM_ANGEL) &&
    v.level.previousRoomType === RoomType.ROOM_CURSE
  ) {
    emptyDevilAngelRoom();

    // Later on in this callback, the Devil Room or Angel Room will be replaced with a seeded
    // version of the room
    // Notify the seeded rooms feature to keep the room empty
    setDevilAngelEmpty();
  }

  v.level.previousRoomType = roomType;
}

function emptyDevilAngelRoom() {
  removeAllCollectibles();

  // Signal that we are not supposed to get the items in this room
  // If they are teleporting into the Treasure Room, the animation will not actually play,
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
