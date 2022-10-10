import {
  EntityType,
  GridEntityXMLType,
  ModCallback,
} from "isaac-typescript-definitions";
import * as easyFirstFloorItems from "../features/optional/quality/easyFirstFloorItems";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.PRE_ROOM_ENTITY_SPAWN, main);
}

function main(
  _entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
  _variant: int,
  _subType: int,
  gridIndex: int,
  _seed: int,
): [EntityType, int, int] | undefined {
  return easyFirstFloorItems.preRoomEntitySpawn(gridIndex);
}
