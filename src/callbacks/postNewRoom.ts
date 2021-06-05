import * as cache from "../cache";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as fastSatan from "../features/optional/bosses/fastSatan";
import * as fixTeleportInvalidEntrance from "../features/optional/bugfix/fixTeleportInvalidEntrance";
import * as appearHands from "../features/optional/enemies/appearHands";
import * as fastClearPostNewRoom from "../features/optional/major/fastClear/callbacks/postNewRoom";
import * as fastTravelPostNewRoom from "../features/optional/major/fastTravel/callbacks/postNewRoom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as showDreamCatcherItemPostNewRoom from "../features/optional/quality/showDreamCatcherItem/postNewRoom";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as subvertTeleport from "../features/optional/quality/subvertTeleport";
import g from "../globals";
import { log } from "../misc";
import GlobalsRunRoom from "../types/GlobalsRunRoom";

export function main(): void {
  cache.updateAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;

  log(
    `MC_POST_NEW_ROOM - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Make sure the callbacks run in the right order
  // (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if (
    gameFrameCount === 0 ||
    g.run.level.stage !== stage ||
    g.run.level.stageType !== stageType
  ) {
    return;
  }

  newRoom();
}

export function newRoom(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;
  const isClear = g.r.IsClear();

  log(
    `MC_POST_NEW_ROOM_2 - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType}) (game frame ${gameFrameCount})`,
  );

  // Set variables
  g.run.room = new GlobalsRunRoom(isClear);
  g.run.roomsEntered += 1; // Keep track of how many rooms we enter over the course of the run

  // Mandatory features
  detectSlideAnimation.postNewRoom();
  controlsGraphic.postNewRoom();

  // Major features
  startWithD6.postNewRoom();
  freeDevilItem.postNewRoom();
  fastClearPostNewRoom.main();
  fastTravelPostNewRoom.main();

  // Character changes
  showEdenStartingItems.postNewRoom();

  // Enemy changes
  fastSatan.postNewRoom();
  appearHands.postNewRoom();

  // Quality of life
  showDreamCatcherItemPostNewRoom.main();
  subvertTeleport.postNewRoom();

  // Bux fixes
  fixTeleportInvalidEntrance.postNewRoom();

  /*
  // Remove the "More Options" buff if they have entered a Treasure Room
  checkRemoveMoreOptions();
  */
}
