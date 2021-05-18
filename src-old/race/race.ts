import { Vector.Zero } from "../constants";
import { FastTravelState } from "../features/fastTravel/constants";
import g from "../globals";
import * as misc from "../misc";
import * as sprites from "../sprites";

// Called from the PostUpdate callback (the "CheckEntities.EntityRaceTrophy()" function)
export function finish(): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();

  // Finish the race
  g.raceVars.finished = true;
  g.raceVars.finishedTime = Isaac.GetTime() - g.raceVars.startedTime;
  g.raceVars.finishedFrames = Isaac.GetFrameCount() - g.raceVars.startedFrame;
  g.run.endOfRunText = true; // Show the run summary

  // Tell the client that the goal was achieved (and the race length)
  Isaac.DebugString(
    `Finished race ${g.race.raceID} with time: ${g.raceVars.finishedTime}`,
  );

  if (stage === 11) {
    // Spawn a button for the DPS feature
    let pos1 = misc.gridToPos(1, 1);
    if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
      pos1 = misc.gridToPos(1, 6); // A Y of 1 is out of bounds inside of the Mega Satan room
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
  }

  Isaac.DebugString(
    "Spawned a Victory Lap / Finished in the corners of the room.",
  );
}

export function victoryLap(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Remove the final place graphic if ( it is showing
  sprites.init("place2", "");

  // Make them float upwards
  // (the code is loosely copied from the "FastTravel.CheckTrapdoorEnter()" function)
  g.run.trapdoor.state = FastTravelState.PLAYER_ANIMATION;
  g.run.trapdoor.upwards = true;
  g.run.trapdoor.frame = gameFrameCount + 16;
  g.p.ControlsEnabled = false;
  g.p.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE; // 0
  // (this is necessary so that enemy attacks don't move the player while they are doing the jumping
  // animation)
  g.p.Velocity = Vector.Zero; // Remove all of the player's momentum
  g.p.PlayExtraAnimation("LightTravel");
  g.run.level.stage -= 1;
  // This is needed or else state 5 will not correctly trigger
  // (because the PostNewRoom callback will occur 3 times instead of 2)
  g.raceVars.victoryLaps += 1;
}
