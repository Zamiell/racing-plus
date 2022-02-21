import {
  getRoomStageID,
  getRoomSubType,
  getRoomVariant,
  log,
} from "isaacscript-common";
import { updateCachedAPIFunctions } from "../cache";
import { charCharOrderPostNewRoom } from "../features/changeCharOrder/callbacks/postNewRoom";
import * as banFirstFloorTreasureRoom from "../features/mandatory/banFirstFloorTreasureRoom";
import * as beastPreventEnd from "../features/mandatory/beastPreventEnd";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as nerfCardReading from "../features/mandatory/nerfCardReading";
import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import { seededDeathPostNewRoom } from "../features/mandatory/seededDeath/callbacks/postNewRoom";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as trophy from "../features/mandatory/trophy";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as removeInvalidPitfalls from "../features/optional/bugfix/removeInvalidPitfalls";
import * as teleportInvalidEntrance from "../features/optional/bugfix/teleportInvalidEntrance";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as removeTreasureRoomEnemies from "../features/optional/enemies/removeTreasureRoomEnemies";
import { extraStartingItemsPostNewRoom } from "../features/optional/gameplay/extraStartingItems/callbacks/postNewRoom";
import { betterDevilAngelRoomsPostNewRoom } from "../features/optional/major/betterDevilAngelRooms/callbacks/postNewRoom";
import { fastClearPostNewRoom } from "../features/optional/major/fastClear/callbacks/postNewRoom";
import { fastTravelPostNewRoom } from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as roll from "../features/optional/other/roll";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import { showDreamCatcherItemPostNewRoom } from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewRoom";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import { racePostNewRoom } from "../features/race/callbacks/postNewRoom";
import * as planetariumFix from "../features/race/planetariumFix";
import { speedrunPostNewRoom } from "../features/speedrun/callbacks/postNewRoom";
import * as detectSlideAnimation from "../features/util/detectSlideAnimation";
import * as roomsEntered from "../features/util/roomsEntered";
import g from "../globals";

export function main(): void {
  updateCachedAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const isaacFrameCount = Isaac.GetFrameCount();
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
  const roomSubType = getRoomSubType();

  log(
    `MC_POST_NEW_ROOM - Room: ${roomStageID}.${roomVariant}.${roomSubType} - Stage: ${stage}.${stageType} - Game frame: ${gameFrameCount} - Isaac frame: ${isaacFrameCount}`,
  );

  // Util
  detectSlideAnimation.postNewRoom();
  roomsEntered.postNewRoom();

  // Special features that must be executed first
  showDreamCatcherItemPostNewRoom(); // 566

  // Mandatory
  removeGloballyBannedItems.postNewRoom();
  nerfCardReading.postNewRoom();
  controlsGraphic.postNewRoom();
  trophy.postNewRoom();
  beastPreventEnd.postNewRoom();
  tempMoreOptions.postNewRoom();
  banFirstFloorTreasureRoom.postNewRoom();
  preventSacrificeRoomTeleport.postNewRoom();
  seededDeathPostNewRoom();

  // Major
  racePostNewRoom();
  planetariumFix.postNewRoom();
  speedrunPostNewRoom();
  charCharOrderPostNewRoom();
  startWithD6.postNewRoom();
  betterDevilAngelRoomsPostNewRoom();
  fastClearPostNewRoom();
  fastTravelPostNewRoom();

  // Chars
  showEdenStartingItems.postNewRoom();

  // Enemies
  fastSatan.postNewRoom();
  appearHands.postNewRoom();
  removeTreasureRoomEnemies.postNewRoom();

  // QoL
  fastVanishingTwin.postNewRoom(); // 697
  subvertTeleport.postNewRoom();

  // Gameplay
  combinedDualityDoors.postNewRoom();
  extraStartingItemsPostNewRoom();

  // Bug fixes
  teleportInvalidEntrance.postNewRoom();
  removeInvalidPitfalls.postNewRoom();

  // Other
  roll.postNewRoom();
}
