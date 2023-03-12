import { GridRoom } from "isaac-typescript-definitions";
import {
  game,
  getRoomGridIndex,
  getRoomStageID,
  getRoomSubType,
  getRoomType,
  getRoomVariant,
  log,
  ModCallbackCustom,
} from "isaacscript-common";
import * as banFirstFloorRoomType from "../features/mandatory/banFirstFloorRoomType";
import * as planetariumFix from "../features/mandatory/planetariumFix";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import { racePostNewRoom } from "../features/race/callbacks/postNewRoom";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();
  const roomStageID = getRoomStageID();
  const roomType = getRoomType();
  const roomVariant = getRoomVariant();
  const roomSubType = getRoomSubType();
  const roomGridIndex = getRoomGridIndex();
  const roomGridIndexSuffix =
    roomGridIndex >= 0 ? "" : ` (GridRoom.${GridRoom[roomGridIndex]})`;

  log(
    `POST_NEW_ROOM_REORDERED - Room: ${roomType}.${roomVariant}.${roomSubType} - Stage ID: ${roomStageID} - Stage: ${stage}.${stageType} - Grid index: ${roomGridIndex}${roomGridIndexSuffix} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  // Mandatory
  banFirstFloorRoomType.postNewRoom();
  preventSacrificeRoomTeleport.postNewRoom();
  planetariumFix.postNewRoom();

  // Major
  racePostNewRoom();
}
