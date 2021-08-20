import { getRoomIndex } from "isaacscript-common";
import {
  NORMAL_TRAPDOOR_POSITION,
  ONE_BY_TWO_TRAPDOOR_POSITION,
  TWO_BY_ONE_TRAPDOOR_POSITION,
} from "../../constants";
import g from "../../globals";

export function spawnTrapdoorOnBossRooms(): void {
  const trapdoorPosition = getTrapdoorPosition();
  const gridIndex = g.r.GetGridIndex(trapdoorPosition);
  const gridEntity = g.r.GetGridEntity(gridIndex);
  const roomIndex = getRoomIndex();

  // Avoid opening trapdoors on negative boss room index (from The Emperor? card)
  if (roomIndex < 0) {
    return;
  }

  if (gridEntity !== null) {
    gridEntity.Destroy(true);
  }

  Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, trapdoorPosition, true);
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

export function spawnTrapdoorWeNeedToGoDeeper(
  rng: RNG,
  player: EntityPlayer,
): void {
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

  // Only spawn crawlspaces above stage 8
  if (stage > 8 && trapdoorChance > 0.1) {
    return;
  }

  Isaac.GridSpawn(gridEntityType, 0, player.Position, true);
}
