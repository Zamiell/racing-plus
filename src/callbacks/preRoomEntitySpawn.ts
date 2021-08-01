import betterDevilAngelRoomsPreRoomEntitySpawn from "../features/optional/major/betterDevilAngelRooms/callbacks/preRoomEntitySpawn";
import * as easyFirstFloorItems from "../features/optional/quality/easyFirstFloorItems";

export function main(
  entityType: EntityType | int,
  _variant: int,
  _subType: int,
  gridIndex: int,
  _seed: int,
): [EntityType, int, int] | void {
  let newTable: [EntityType, int, int] | void;

  newTable = easyFirstFloorItems.preRoomEntitySpawn(gridIndex);
  if (newTable !== null) {
    return newTable;
  }

  newTable = betterDevilAngelRoomsPreRoomEntitySpawn(entityType);
  if (newTable !== null) {
    return newTable;
  }

  return undefined;
}
