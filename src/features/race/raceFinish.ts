import g from "../../globals";
import log from "../../log";
import * as socket from "./socket";

export default function raceFinish(): void {
  // const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();

  g.raceVars.finished = true;
  g.raceVars.finishedTime = Isaac.GetTime() - g.raceVars.startedTime;
  g.raceVars.finishedFrames = Isaac.GetFrameCount() - g.raceVars.startedFrame;
  g.run.room.showEndOfRunText = true;

  // Tell the client that the goal was achieved (and the race length)
  socket.send("finish", g.raceVars.finishedTime.toString());
  log(`Finished race ${g.race.raceID} with time: ${g.raceVars.finishedTime}`);
  log(
    `The total amount of frames in the race was: ${g.raceVars.finishedFrames}`,
  );

  if (stage === 11) {
    /*
    // Spawn a button for the DPS feature
    let pos1 = gridToPos(1, 1);
    if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
      pos1 = gridToPos(1, 6); // A Y of 1 is out of bounds inside of the Mega Satan room
    }
    g.run.level.buttons.push({
      type: "dps",
      pos: pos1,
      roomIndex,
    });
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, pos1, true);
    sprites.init("dps-button", "dps-button");

    // Spawn a button for the Victory Lap feature
    let pos2 = misc.gridToPos(11, 1);
    if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
      pos2 = misc.gridToPos(11, 6); // A Y of 1 is out of bounds inside of the Mega Satan room
    }
    g.run.level.buttons.push({
      type: "victory-lap",
      pos: pos2,
      roomIndex,
    });
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, pos2, true);
    sprites.init("victory-lap-button", "victory-lap-button");
  */
  }
}
