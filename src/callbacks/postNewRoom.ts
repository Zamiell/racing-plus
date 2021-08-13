import { log } from "isaacscript-common";
import * as cache from "../cache";
import charCharOrderPostNewRoom from "../features/changeCharOrder/callbacks/postNewRoom";
import * as beastPreventEnd from "../features/mandatory/beastPreventEnd";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as removeGloballyBannedItems from "../features/mandatory/removeGloballyBannedItems";
import * as tempMoreOptions from "../features/mandatory/tempMoreOptions";
import * as trophy from "../features/mandatory/trophy";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as teleportInvalidEntrance from "../features/optional/bugfix/teleportInvalidEntrance";
import * as appearHands from "../features/optional/enemies/appearHands";
import betterDevilAngelRoomsPostNewRoom from "../features/optional/major/betterDevilAngelRooms/callbacks/postNewRoom";
import fastTravelPostNewRoom from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import showDreamCatcherItemPostNewRoom from "../features/optional/quality/showDreamCatcherItem/callbacks/postNewRoom";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import racePostNewRoom from "../features/race/callbacks/postNewRoom";
import g from "../globals";

export function main(): void {
  cache.updateAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
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
  detectSlideAnimation.postNewRoom();
  controlsGraphic.postNewRoom();
  trophy.postNewRoom();
  beastPreventEnd.postNewRoom();
  tempMoreOptions.postNewRoom();

  // Major features
  racePostNewRoom();
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

  // Quality of life
  showDreamCatcherItemPostNewRoom();
  subvertTeleport.postNewRoom();

  // Bux fixes
  teleportInvalidEntrance.postNewRoom();
}
