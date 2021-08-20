import {
  getDoors,
  getRoomIndex,
  getSurroundingGridEntities,
  onRepentanceStage,
} from "isaacscript-common";
import {
  NORMAL_TRAPDOOR_POSITION,
  ONE_BY_TWO_TRAPDOOR_POSITION,
  TWO_BY_ONE_TRAPDOOR_POSITION,
} from "../../constants";
import g from "../../globals";
import { removeGridEntity } from "../../utilGlobals";

// ModCallbacks.MC_PRE_USE_ITEM (23)
// CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER (84)
export function preUseItemWeNeedToGoDeeper(
  rng: RNG,
  player: EntityPlayer,
): boolean | void {
  const stage = g.l.GetStage();

  const trapdoorChance = rng.RandomFloat();
  const gridEntityType =
    trapdoorChance <= 0.1
      ? GridEntityType.GRID_STAIRS
      : GridEntityType.GRID_TRAPDOOR;

  player.AnimateCollectible(
    CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER,
    "UseItem",
  );

  // Do not allow trapdoors on stage 9 and above
  if (stage >= 9 && gridEntityType === GridEntityType.GRID_TRAPDOOR) {
    return undefined;
  }

  Isaac.GridSpawn(gridEntityType, 0, player.Position, true);

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

  lockRepentanceDoors();
  spawnTrapdoorInBossRooms();
}

function lockRepentanceDoors() {
  // This challenge is marked as 'secretpath="true"', which means that the Repentance doors will
  // spawn open without the player having to spend resources
  // Revert the doors to how they would be in vanilla
  for (const door of getDoors()) {
    if (
      door !== null &&
      door.TargetRoomIndex === GridRooms.ROOM_SECRET_EXIT_IDX
    ) {
      g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
      door.Close(true);

      if (isDoorToMines()) {
        // The door that requires 2 bombs is a special case
        door.Bar();
        door.SetVariant(DoorVariant.DOOR_LOCKED_CRACKED);
      } else {
        door.SetLocked(true);
      }
    }
  }
}

function isDoorToMines() {
  const stage = g.l.GetStage();

  return (
    (stage === 2 && onRepentanceStage()) ||
    ((stage === 3 || stage === 4) && !onRepentanceStage())
  );
}

function spawnTrapdoorInBossRooms() {
  const roomIndex = getRoomIndex();

  if (doesSecretPathChallengeSpawnTrapdoorOnThisFloor()) {
    return;
  }

  // Avoid opening trapdoors on negative boss room index (from The Emperor? card)
  if (roomIndex < 0) {
    return;
  }

  const trapdoorPosition = getTrapdoorPosition();
  const gridIndex = g.r.GetGridIndex(trapdoorPosition);
  const gridEntity = g.r.GetGridEntity(gridIndex);
  if (gridEntity !== null) {
    removeGridEntity(gridEntity);
  }
  const trapdoor = Isaac.GridSpawn(
    GridEntityType.GRID_TRAPDOOR,
    0,
    trapdoorPosition,
    true,
  );

  // Emulate the feature of vanilla where surrounding rocks will be destroyed and surrounding pits
  // will be filled
  clearSurroundingTiles(trapdoor);
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
      if (pit !== null) {
        pit.MakeBridge(null);
      }
    }
  }
}
