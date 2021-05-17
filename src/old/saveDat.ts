import g from "./globals";
import * as misc from "./misc";
import * as sprites from "./sprites";
import RaceData from "./types/RaceData";

// Variables
let failedCounter = 0;

// Read the "save.dat" file for updates from the Racing+ client
export function load(): void {
  if (g.racingPlus === null) {
    error("The Racing+ mod object was nil.");
  }

  // Since since file reads are expensive, we do not want to load the "save#.dat" file on every frame
  if (!shouldLoadSaveDatOnThisFrame()) {
    return;
  }

  // Check to see if there a "save.dat" file for this save slot
  if (!Isaac.HasModData(g.racingPlus)) {
    Isaac.DebugString(
      'The "save.dat" file does not exist for this save slot. Writing defaults.',
    );
    save();
    return;
  }

  // Mark that we have loaded on this frame
  g.raceVars.loadOnNextFrame = false;

  // Make a backup in case loading fails (see below)
  const oldRace = g.race;

  // The server will write JSON data for us to the "save#.dat" file in the mod subdirectory
  function loadJSON(this: void) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const modDataString = Isaac.LoadModData(g.racingPlus!);
    g.race = json.decode(modDataString) as RaceData;
  }
  const [ok] = pcall(loadJSON);
  if (ok) {
    loadSucceeded(oldRace);
  } else {
    loadFailed(oldRace);
  }
}

function shouldLoadSaveDatOnThisFrame() {
  // Local variables
  const isaacFrameCount = Isaac.GetFrameCount();

  return (
    g.raceVars.loadOnNextFrame || // We need to check on the first frame of the run
    (g.race.status === "starting" &&
      // We want to check for updates on every other frame if the race is starting so that the
      // countdown is smooth
      isaacFrameCount % 2 === 0) ||
    // Otherwise, only check for updates every half second
    // (Isaac runs at 60 frames per second)
    isaacFrameCount % 30 === 0
  );
}

function loadSucceeded(oldRace: RaceData) {
  // Loading succeeded
  failedCounter = 0;

  // If anything changed, write it to the log
  if (oldRace.userID !== g.race.userID) {
    Isaac.DebugString(
      `ModData userID changed: ${oldRace.userID} --> ${g.race.userID}`,
    );
  }
  if (oldRace.raceID !== g.race.raceID) {
    Isaac.DebugString(
      `ModData raceID changed: ${oldRace.raceID} --> ${g.race.raceID}`,
    );
  }
  if (oldRace.status !== g.race.status) {
    Isaac.DebugString(
      `ModData status changed: ${oldRace.status} --> ${g.race.status}`,
    );
    changedStatus();
  }
  if (oldRace.myStatus !== g.race.myStatus) {
    Isaac.DebugString(
      `ModData myStatus changed: ${oldRace.myStatus} --> ${g.race.myStatus}`,
    );
    changedMyStatus();
  }
  if (oldRace.ranked !== g.race.ranked) {
    Isaac.DebugString(
      `ModData ranked changed: ${oldRace.ranked} --> ${g.race.ranked}`,
    );
  }
  if (oldRace.solo !== g.race.solo) {
    Isaac.DebugString(
      `ModData solo changed: ${oldRace.solo} --> ${g.race.solo}`,
    );
  }
  if (oldRace.rFormat !== g.race.rFormat) {
    Isaac.DebugString(
      `ModData rFormat changed: ${oldRace.rFormat} --> ${g.race.rFormat}`,
    );
    changedFormat();
  }
  if (oldRace.difficulty !== g.race.difficulty) {
    Isaac.DebugString(
      `ModData difficulty changed: ${oldRace.difficulty} --> ${g.race.difficulty}`,
    );
  }
  if (oldRace.character !== g.race.character) {
    Isaac.DebugString(
      `ModData character changed: ${oldRace.character} --> ${g.race.character}`,
    );
  }
  if (oldRace.goal !== g.race.goal) {
    Isaac.DebugString(
      `ModData goal changed: ${oldRace.goal} --> ${g.race.goal}`,
    );
  }
  if (oldRace.seed !== g.race.seed) {
    Isaac.DebugString(
      `ModData seed changed: ${oldRace.seed} --> ${g.race.seed}`,
    );
  }
  if (!misc.arrayEquals(oldRace.startingItems, g.race.startingItems)) {
    Isaac.DebugString(
      `ModData startingItems changed to: [${g.race.startingItems.join(", ")}]`,
    );
  }
  if (oldRace.countdown !== g.race.countdown) {
    Isaac.DebugString(
      `ModData countdown changed: ${oldRace.countdown} --> ${g.race.countdown}`,
    );
  }
  if (oldRace.placeMid !== g.race.placeMid) {
    Isaac.DebugString(
      `ModData placeMid changed: ${oldRace.placeMid} --> ${g.race.placeMid}`,
    );
  }
  if (oldRace.place !== g.race.place) {
    Isaac.DebugString(
      `ModData place changed: ${oldRace.place} --> ${g.race.place}`,
    );
    changedPlace();
  }
  if (oldRace.numEntrants !== g.race.numEntrants) {
    Isaac.DebugString(
      `ModData numEntrants changed: ${oldRace.numEntrants} --> ${g.race.numEntrants}`,
    );
  }
}

function loadFailed(oldRace: RaceData) {
  // Sometimes loading can fail if the file is currently being being written to,
  // so give up for now and try again on the next frame
  g.raceVars.loadOnNextFrame = true;
  g.race = oldRace; // Restore the backup
  failedCounter += 1;
  if (failedCounter >= 100) {
    Isaac.DebugString(
      'Loading the "save.dat" file failed 100 times in a row. Writing defaults.',
    );
    save();
  } else {
    Isaac.DebugString(
      'Loading the "save.dat" file failed. Trying again on the next frame+.',
    );
  }
}

function save() {
  if (g.racingPlus === null) {
    error("The Racing+ mod object was nil.");
  }

  const raceTableString = json.encode(g.race);
  Isaac.SaveModData(g.racingPlus, raceTableString);
}

function changedStatus() {
  // Local variables
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
  // Local variables
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

function changedFormat() {
  if (g.race.rFormat === "pageant") {
    // For special rulesets, fix the bug where it is not loaded on the first run
    // Doing a "restart" won't work since we are just starting a run,
    // so mark to reset on the next frame
    g.run.restart = true;
    Isaac.DebugString(
      'Restarting because the race format was changed to "pageant".',
    );
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
