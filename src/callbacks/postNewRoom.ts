import { getRoomIndex, log } from "isaacscript-common";
import * as cache from "../cache";
import charCharOrderPostNewRoom from "../features/changeCharOrder/callbacks/postNewRoom";
import * as beastPreventEnd from "../features/mandatory/beastPreventEnd";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as nerfCardReading from "../features/mandatory/nerfCardReading";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as trophy from "../features/mandatory/trophy";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as teleportInvalidEntrance from "../features/optional/bugfix/teleportInvalidEntrance";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as removeTreasureRoomEnemies from "../features/optional/enemies/removeTreasureRoomEnemies";
import * as combinedDualityDoors from "../features/optional/gameplay/combinedDualityDoors";
import moreStartingItemsPostNewRoom from "../features/optional/gameplay/moreStartingItems/callbacks/postNewRoom";
import betterDevilAngelRoomsPostNewRoom from "../features/optional/major/betterDevilAngelRooms/callbacks/postNewRoom";
import fastTravelPostNewRoom from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import showDreamCatcherItemPostNewRoom from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewRoom";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import racePostNewRoom from "../features/race/callbacks/postNewRoom";
import speedrunPostNewRoom from "../features/speedrun/callbacks/postNewRoom";
import g from "../globals";

export function main(): void {
  cache.updateAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomIndex = getRoomIndex();
  const roomDesc = g.l.GetRoomByIdx(roomIndex);
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;

  log(
    `MC_POST_NEW_ROOM - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Set variables
  g.run.roomsEntered += 1; // Keep track of how many rooms we enter over the course of the run

  // Mandatory features
  removeGloballyBannedItems.postNewRoom();
  nerfCardReading.postNewRoom();
  detectSlideAnimation.postNewRoom();
  controlsGraphic.postNewRoom();
  trophy.postNewRoom();
  beastPreventEnd.postNewRoom();
  tempMoreOptions.postNewRoom();

  // Major features
  racePostNewRoom();
  speedrunPostNewRoom();
  charCharOrderPostNewRoom();
  startWithD6.postNewRoom();
  betterDevilAngelRoomsPostNewRoom();
  freeDevilItem.postNewRoom();
  fastTravelPostNewRoom();

  // Character changes
  showEdenStartingItems.postNewRoom();

  // Enemy changes
  fastSatan.postNewRoom();
  appearHands.postNewRoom();
  removeTreasureRoomEnemies.postNewRoom();

  // Quality of life
  showDreamCatcherItemPostNewRoom();
  subvertTeleport.postNewRoom();

  // Gameplay changes
  combinedDualityDoors.postNewRoom();
  moreStartingItemsPostNewRoom();

  // Bux fixes
  teleportInvalidEntrance.postNewRoom();
}
