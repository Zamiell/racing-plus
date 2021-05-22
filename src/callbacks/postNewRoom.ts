import * as cache from "../cache";
import * as fastClearPostNewRoom from "../features/fastClear/callbacks/postNewRoom";
import * as fixTeleportInvalidEntrance from "../features/fixTeleportInvalidEntrance";
import * as freeDevilItem from "../features/freeDevilItem";
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

  // Features
  freeDevilItem.postNewRoom();
  fastClearPostNewRoom.main();
  fixTeleportInvalidEntrance.postNewRoom();

  /*
  // Reset the state of whether the room is clear or not
  // (this is needed so that we don't get credit for clearing a room when
  // bombing from a room with enemies into an empty room)
  g.run.currentRoomClearState = roomClear;

  // Check to see if we need to remove the heart container from a Strength card on Keeper
  // (this has to be done before the resetting of the "g.run.usedStrength" variable)
  checkRemoveKeeperHeartContainerFromStrength();

  samael.CheckHairpin(); // Check to see if we need to fix the Wraith Skull + Hairpin bug
  schoolbag.postNewRoom(); // Handle the Glowing Hour Glass mechanics relating to the Schoolbag
  bossRush.postNewRoom();
  challengeRooms.postNewRoom();
  // Check to see if we need to respawn trapdoors / crawlspaces / beams of light
  fastTravel.entity.checkRespawn();
  fastTravel.trapdoor.checkNewFloor(); // Check if we are just arriving on a new floor
  fastTravel.crawlspace.checkMiscBugs(); // Check for miscellaneous crawlspace bugs

  checkDrawEdenStartingItems();
  // Remove the "More Options" buff if they have entered a Treasure Room
  checkRemoveMoreOptions();
  checkZeroHealth(); // Fix the bug where we don't die at 0 hearts
  checkStartingRoom(); // Draw the starting room graphic
  */
}
