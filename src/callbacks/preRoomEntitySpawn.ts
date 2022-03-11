import * as easyFirstFloorItems from "../features/optional/quality/easyFirstFloorItems";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, main);
}

function main(
  _entityType: EntityType | int,
  _variant: int,
  _subType: int,
  gridIndex: int,
  _seed: int,
): [EntityType, int, int] | void {
  const newTable = easyFirstFloorItems.preRoomEntitySpawn(gridIndex);
  if (newTable !== undefined) {
    return newTable;
  }

  return undefined;
}
