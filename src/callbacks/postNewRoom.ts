import * as cache from "../cache";
import * as fastClearPostNewRoom from "../features/fastClear/callbacks/postNewRoom";
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
    `MC_POST_NEW_ROOM - ${roomStageID}.${roomVariant} (on stage ${stage})`,
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

function newRoom() {
  const stage = g.l.GetStage();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomStageID = roomDesc.Data.StageID;
  const roomVariant = roomDesc.Data.Variant;

  Isaac.DebugString(
    `MC_POST_NEW_ROOM_2 - ${roomStageID}.${roomVariant} (on stage ${stage})`,
  );

  // Set variables
  g.run.room = new GlobalsRunRoom();
  g.run.roomsEntered += 1; // Keep track of how many rooms we enter over the course of the run

  // Features
  fastClearPostNewRoom.main();
}
