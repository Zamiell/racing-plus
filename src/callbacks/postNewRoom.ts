import * as cache from "../cache";
import * as controlsGraphic from "../features/mandatory/controlsGraphic";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as fixTeleportInvalidEntrance from "../features/optional/bugfix/fixTeleportInvalidEntrance";
import * as fastClearPostNewRoom from "../features/optional/major/fastClear/callbacks/postNewRoom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as showDreamCatcherItemPostNewRoom from "../features/optional/quality/showDreamCatcherItem/postNewRoom";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import g from "../globals";
import GlobalsRunRoom from "../types/GlobalsRunRoom";

export function main(): void {
  cache.updateAPIFunctions();

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;

  Isaac.DebugString(
    `MC_POST_NEW_ROOM - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType})`,
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
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;

  Isaac.DebugString(
    `MC_POST_NEW_ROOM_2 - ${roomStageID}.${roomVariant} (on stage ${stage}.${stageType})`,
  );

  // Set variables
  g.run.room = new GlobalsRunRoom();
  g.run.roomsEntered += 1; // Keep track of how many rooms we enter over the course of the run

  // Mandatory features
  detectSlideAnimation.postNewRoom();
  controlsGraphic.postNewRoom();

  // Optional features - Major
  startWithD6.postNewRoom();
  freeDevilItem.postNewRoom();
  fastClearPostNewRoom.main();

  // Optional features - Quality of Life
  showEdenStartingItems.postNewRoom();
  showDreamCatcherItemPostNewRoom.main();

  // Optional features - Bux Fixes
  fixTeleportInvalidEntrance.postNewRoom();

  /*
  // Check to see if we need to respawn trapdoors / crawlspaces / beams of light
  fastTravel.entity.checkRespawn();
  fastTravel.trapdoor.checkNewFloor(); // Check if we are just arriving on a new floor
  fastTravel.crawlspace.checkMiscBugs(); // Check for miscellaneous crawlspace bugs

  // Remove the "More Options" buff if they have entered a Treasure Room
  checkRemoveMoreOptions();
  */
}
