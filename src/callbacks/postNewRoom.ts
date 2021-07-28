import * as cache from "../cache";
import * as postGridEntityInit from "../customCallbacks/postGridEntityInit";
import * as beastPreventEnd from "../features/mandatory/beastPreventEnd";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as removeMercurius from "../features/mandatory/removeMercurius";
import * as trophy from "../features/mandatory/trophy";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as teleportInvalidEntrance from "../features/optional/bugfix/teleportInvalidEntrance";
import * as appearHands from "../features/optional/enemies/appearHands";
import fastTravelPostNewRoom from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import showDreamCatcherItemPostNewRoom from "../features/optional/quality/showDreamCatcherItem/postNewRoom";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import racePostNewRoom from "../features/race/callbacks/postNewRoom";
import g from "../globals";
import log, { debugLog } from "../log";
import GlobalsRunRoom from "../types/GlobalsRunRoom";

export function main(): void {
  debugLog("MC_POST_NEW_ROOM", true);

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

  // Make sure the callbacks run in the right order
  // (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if (
    (gameFrameCount === 0 ||
      g.run.level.stage !== stage ||
      g.run.level.stageType !== stageType) &&
    !g.run.forceNextRoom
  ) {
    debugLog("MC_POST_NEW_ROOM", false);
    return;
  }
  g.run.forceNextRoom = false;

  newRoom();

  debugLog("MC_POST_NEW_ROOM", false);
}

export function newRoom(): void {
  debugLog("MC_POST_NEW_ROOM2", true);

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomClear = g.r.IsClear();

  log(
    `MC_POST_NEW_ROOM_2 - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Set variables
  g.run.room = new GlobalsRunRoom(roomClear);
  g.run.roomsEntered += 1; // Keep track of how many rooms we enter over the course of the run

  // Custom callbacks
  postGridEntityInit.postNewRoom();

  // Mandatory features
  removeMercurius.postNewRoom();
  detectSlideAnimation.postNewRoom();
  controlsGraphic.postNewRoom();

  // Major features
  beastPreventEnd.postNewRoom();
  racePostNewRoom();
  trophy.postNewRoom();
  startWithD6.postNewRoom();
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

  debugLog("MC_POST_NEW_ROOM2", false);
}
