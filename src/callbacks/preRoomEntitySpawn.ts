import * as easyFirstFloorItems from "../features/optional/quality/easyFirstFloorItems";

export function main(
  _entityType: EntityType | int,
  _variant: int,
  _subType: int,
  gridIndex: int,
  _seed: int,
): [EntityType, int, int] | void {
  const newTable = easyFirstFloorItems.preRoomEntitySpawn(gridIndex);
  if (newTable !== null) {
    return newTable;
  }

  return undefined;
}
