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
import { charCharOrderPostNewRoom } from "../features/changeCharOrder/callbacks/postNewRoom";
import * as banFirstFloorRoomType from "../features/mandatory/banFirstFloorRoomType";
import * as nerfCardReading from "../features/mandatory/nerfCardReading";
import * as planetariumFix from "../features/mandatory/planetariumFix";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import { seededDeathPostNewRoom } from "../features/mandatory/seededDeath/callbacks/postNewRoom";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as fastBossRush from "../features/optional/bosses/fastBossRush";
import * as preventUltraSecretRoomSoftlock from "../features/optional/bugfix/preventUltraSecretRoomSoftlock";
import * as removeInvalidPitfalls from "../features/optional/bugfix/removeInvalidPitfalls";
import * as teleportInvalidEntrance from "../features/optional/bugfix/teleportInvalidEntrance";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import { extraStartingItemsPostNewRoom } from "../features/optional/gameplay/extraStartingItems/callbacks/postNewRoom";
import * as roll from "../features/optional/hotkeys/roll";
import { betterDevilAngelRoomsPostNewRoom } from "../features/optional/major/betterDevilAngelRooms/callbacks/postNewRoom";
import { fastClearPostNewRoom } from "../features/optional/major/fastClear/callbacks/postNewRoom";
import { fastTravelPostNewRoom } from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { showDreamCatcherItemPostNewRoom } from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewRoom";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import { racePostNewRoom } from "../features/race/callbacks/postNewRoom";
import { speedrunPostNewRoom } from "../features/speedrun/callbacks/postNewRoom";
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
    `MC_POST_NEW_ROOM_REORDERED - Room: ${roomType}.${roomVariant}.${roomSubType} - Stage ID: ${roomStageID} - Stage: ${stage}.${stageType} - Grid index: ${roomGridIndex}${roomGridIndexSuffix} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  // Mandatory
  removeGloballyBannedItems.postNewRoom();
  nerfCardReading.postNewRoom();
  tempMoreOptions.postNewRoom();
  banFirstFloorRoomType.postNewRoom();
  preventSacrificeRoomTeleport.postNewRoom();
  seededDeathPostNewRoom();
  planetariumFix.postNewRoom();

  // Major
  racePostNewRoom();
  speedrunPostNewRoom();
  charCharOrderPostNewRoom();
  betterDevilAngelRoomsPostNewRoom();
  fastClearPostNewRoom();
  fastTravelPostNewRoom();

  // Characters
  showEdenStartingItems.postNewRoom();

  // Bosses
  fastBossRush.postNewRoom();

  // QoL
  showDreamCatcherItemPostNewRoom(); // 566
  fastVanishingTwin.postNewRoom(); // 697
  subvertTeleport.postNewRoom();

  // Gameplay
  combinedDualityDoors.postNewRoom();
  extraStartingItemsPostNewRoom();

  // Bug fixes
  preventUltraSecretRoomSoftlock.postNewRoom();
  teleportInvalidEntrance.postNewRoom();
  removeInvalidPitfalls.postNewRoom();

  // Other
  roll.postNewRoom();
}
