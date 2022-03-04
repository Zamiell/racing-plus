import {
  getRepentanceDoor,
  getSurroundingGridEntities,
  isDoorToDownpour,
  isDoorToMausoleum,
  isDoorToMines,
  isRepentanceDoor,
  isRoomInsideMap,
  onRepentanceStage,
  spawnGridEntity,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import {
  NORMAL_TRAPDOOR_POSITION,
  ONE_BY_TWO_TRAPDOOR_POSITION,
  TWO_BY_ONE_TRAPDOOR_POSITION,
} from "../../constants";
import g from "../../globals";
import { initSprite } from "../../sprite";
import { RepentanceDoorState } from "../../types/RepentanceDoorState";
import { ChallengeCustom } from "./enums";
import v from "./v";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  setRepentanceDoors();
}

// ModCallbacks.MC_PRE_USE_ITEM (23)
// CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER (84)
export function preUseItemWeNeedToGoDeeper(
  rng: RNG,
  player: EntityPlayer,
): boolean | void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const challenge = Isaac.GetChallenge();
  const isMirrorWorld = g.r.IsMirrorWorld();

  // Rarely, the shovel will trigger two times on the same frame
  // It is unknown why this happens
  // Prevent this bug by preventing the shovel from being used two or more times on the same frame
  if (gameFrameCount === v.room.usedShovelFrame) {
    return true;
  }

  // In vanilla, We Need to Go Deeper will do nothing in a dungeon
  if (roomType === RoomType.ROOM_DUNGEON) {
    return true;
  }

  const trapdoorChance = rng.RandomFloat();
  const gridEntityType =
    trapdoorChance <= 0.1
      ? GridEntityType.GRID_STAIRS
      : GridEntityType.GRID_TRAPDOOR;

  // Do not allow trapdoors on stage 9 and above
  // (or stage 8 for seasons that go to the Dark Room)
  const finalFloorForTrapdoors = challenge === ChallengeCustom.SEASON_2 ? 7 : 8;
  if (
    stage > finalFloorForTrapdoors &&
    gridEntityType === GridEntityType.GRID_TRAPDOOR
  ) {
    return undefined;
  }

  // In vanilla, We Need to Go Deeper will not spawn any trapdoors in mirror world
  if (isMirrorWorld && gridEntityType === GridEntityType.GRID_TRAPDOOR) {
    return true;
  }

  const gridIndex = g.r.GetGridIndex(player.Position);
  spawnGridEntity(gridEntityType, gridIndex);

  player.AnimateCollectible(
    CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER,
    PlayerItemAnimation.USE_ITEM,
  );

  // Keep track of when we use the shovel to prevent bugs (see above)
  v.room.usedShovelFrame = gameFrameCount;

  return true;
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  emulateClearingNormalChallengeBossRoom();
}

function emulateClearingNormalChallengeBossRoom() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  // This challenge is marked as 'secretpath="true"', which means that the Repentance doors will
  // spawn open without the player having to spend resources
  // Revert the doors to how they would be in vanilla
  setRepentanceDoors();

  spawnTrapdoorInBossRooms();
}

function setRepentanceDoors() {
  const door = getRepentanceDoor();
  if (door === undefined) {
    return;
  }

  if (isDoorToDownpour(door)) {
    if (v.level.repentanceDoorState === RepentanceDoorState.INITIAL) {
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      door.Close(true);
      door.SetLocked(true);
    }
  } else if (isDoorToMines(door)) {
    if (v.level.repentanceDoorState === RepentanceDoorState.INITIAL) {
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      door.Close(true);
      door.Bar();
      door.SetVariant(DoorVariant.DOOR_LOCKED_CRACKED);
    } else if (
      v.level.repentanceDoorState === RepentanceDoorState.HALF_BOMBED
    ) {
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      door.SetVariant(DoorVariant.DOOR_LOCKED_CRACKED);

      const sprite = door.GetSprite();
      sprite.Play("Closed", true);

      const woodenBoardSprite = initSprite("gfx/grid/door_mines_planks.anm2");
      woodenBoardSprite.PlayOverlay("Damaged", true);
      woodenBoardSprite.Rotation = getWoodenBoardRotation(door);
      door.ExtraSprite = woodenBoardSprite;
      door.ExtraVisible = true;

      door.State = DoorState.STATE_HALF_CRACKED;
    }
  } else if (isDoorToMausoleum(door)) {
    // The game will remember the donation status of the door,
    // so the below code will not do anything in the case of the door already being opened,
    // and handle the other two cases properly
    g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
    door.Close(true);
    door.SetLocked(true);
  }
}

function spawnTrapdoorInBossRooms() {
  const isMirrorWorld = g.r.IsMirrorWorld();

  // Trapdoors do not spawn in the mirror world
  if (isMirrorWorld) {
    return;
  }

  if (doesSecretPathChallengeSpawnTrapdoorOnThisFloor()) {
    return;
  }

  // Avoid opening trapdoors on boss rooms outside the map (e.g. from The Emperor? card)
  if (!isRoomInsideMap()) {
    return;
  }

  const trapdoorPosition = getTrapdoorPosition();
  const gridIndex = g.r.GetGridIndex(trapdoorPosition);
  const trapdoor = spawnGridEntityWithVariant(
    GridEntityType.GRID_TRAPDOOR,
    TrapdoorVariant.NORMAL,
    gridIndex,
  );

  // Emulate the feature of vanilla where surrounding rocks will be destroyed and surrounding pits
  // will be filled
  if (trapdoor !== undefined) {
    clearSurroundingTiles(trapdoor);
  }
}

// In challenges with 'secretpath="true"', trapdoors will only spawn on certain floors
function doesSecretPathChallengeSpawnTrapdoorOnThisFloor() {
  const stage = g.l.GetStage();

  // On normal stages, a trapdoor will naturally spawn Depths 2, Womb 2, and above
  if (!onRepentanceStage() && (stage === 6 || stage >= 8)) {
    return true;
  }

  // On Repentance stages, a trapdoor will naturally spawn on odd floors and on Mausoleum 2
  if (
    onRepentanceStage() &&
    (stage === 1 || stage === 3 || stage === 5 || stage === 6)
  ) {
    return true;
  }

  return false;
}

function getTrapdoorPosition(): Vector {
  const roomShape = g.r.GetRoomShape();

  if (roomShape === RoomShape.ROOMSHAPE_2x1) {
    return TWO_BY_ONE_TRAPDOOR_POSITION;
  }

  if (roomShape === RoomShape.ROOMSHAPE_1x2) {
    return ONE_BY_TWO_TRAPDOOR_POSITION;
  }

  return NORMAL_TRAPDOOR_POSITION;
}

function clearSurroundingTiles(centerGridEntity: GridEntity) {
  const gridEntities = getSurroundingGridEntities(centerGridEntity);
  for (const gridEntity of gridEntities) {
    const gridEntityType = gridEntity.GetType();
    if (gridEntityType === GridEntityType.GRID_ROCK) {
      gridEntity.Destroy(true);
    } else if (gridEntityType === GridEntityType.GRID_PIT) {
      const pit = gridEntity.ToPit();
      if (pit !== undefined) {
        pit.MakeBridge(undefined);
      }
    }
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_DOOR (16)
export function postGridEntityUpdateDoor(gridEntity: GridEntity): void {
  const door = gridEntity.ToDoor();
  if (door !== undefined && isRepentanceDoor(door)) {
    updateRepentanceDoorState(door);
  }
}

function updateRepentanceDoorState(door: GridEntityDoor) {
  if (isDoorToDownpour(door)) {
    const doorState = door.IsLocked()
      ? RepentanceDoorState.INITIAL
      : RepentanceDoorState.UNLOCKED;
    v.level.repentanceDoorState = doorState;
  } else if (isDoorToMines(door)) {
    v.level.repentanceDoorState = getDoorStateForMinesDoor(door);

    // The extra sprite will not be removed properly if the door is opened via Dad's Key
    if (v.level.repentanceDoorState === RepentanceDoorState.UNLOCKED) {
      door.ExtraVisible = false;
    }
  }
  // (Mausoleum doors are handled automatically)
}

function getDoorStateForMinesDoor(door: GridEntityDoor) {
  switch (door.State) {
    case DoorState.STATE_CLOSED: {
      return RepentanceDoorState.INITIAL;
    }

    case DoorState.STATE_HALF_CRACKED: {
      return RepentanceDoorState.HALF_BOMBED;
    }

    case DoorState.STATE_OPEN: {
      return RepentanceDoorState.UNLOCKED;
    }

    default: {
      return error("A Mines door had an unknown state.");
    }
  }
}

function getWoodenBoardRotation(door: GridEntityDoor): number {
  // Left slots
  if (door.Slot % 4 === 0) {
    return 270;
  }

  // Up slots
  if (door.Slot % 4 === 1) {
    return 0;
  }

  // Right slots
  if (door.Slot % 4 === 2) {
    return 90;
  }

  // Down slots
  if (door.Slot % 4 === 3) {
    return 180;
  }

  return 0;
}
