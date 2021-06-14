/*
function changedStatus() {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (g.race.status === "open") {
    if (stage === 1 && roomIndex === startingRoomIndex) {
      // Doing a "restart" won't work if we are just starting a run,
      // so mark to reset on the next frame
      g.run.restart = true;
      Isaac.DebugString("Restarting so that we can go to the race room.");
    } else {
      // We are in the middle of a run, so don't go to the Race Room until a reset occurs
      g.raceVars.started = false;
      g.raceVars.startedTime = 0;
      if (g.race.myStatus === "not ready") {
        sprites.init("place", "pre1");
      } else if (g.race.myStatus === "ready") {
        sprites.init("place", "pre2");
      }
    }
  } else if (g.race.status === "starting") {
    // Remove the final place graphic, if present
    sprites.init("place2", "");
  } else if (
    g.race.status === "in progress" ||
    (g.race.status === "none" && roomIndex === GridRooms.ROOM_DEBUG_IDX)
  ) {
    // Doing a "restart" won't work if we are just starting a run,
    // so mark to reset on the next frame
    g.run.restart = true;
    Isaac.DebugString("Restarting because we want to exit the race room.");
  }
}

function changedMyStatus() {
  const roomIndex = misc.getRoomIndex();

  if (
    (g.race.status === "open" || g.race.status === "starting") &&
    g.race.myStatus === "not ready" &&
    roomIndex !== GridRooms.ROOM_DEBUG_IDX
  ) {
    sprites.init("place", "pre1");
  } else if (
    (g.race.status === "open" || g.race.status === "starting") &&
    g.race.myStatus === "ready" &&
    roomIndex !== GridRooms.ROOM_DEBUG_IDX
  ) {
    sprites.init("place", "pre2");
  }
}

function changedPlace() {
  if (g.raceVars.finished) {
    // Show a big graphic at the top of the screen with our final place
    // (the client won't send a new place for solo races)
    sprites.init("place2", g.race.place.toString());

    // Also, update the place graphic on the left by the R+ icon with our final place
    sprites.init("place", g.race.place.toString());
  }
}
*/
