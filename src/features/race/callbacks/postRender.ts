import g from "../../../globals";
import { consoleCommand, restartAsCharacter } from "../../../misc";
import * as raceRoom from "../raceRoom";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postRender();
  raceRoom.postRender();
  startingRoom.postRender();
}

export function checkRestartWrongCharacter(): boolean {
  if (
    !g.config.clientCommunication ||
    g.race.status === "none" ||
    g.race.format === "custom"
  ) {
    return false;
  }

  const player = Isaac.GetPlayer(0);
  if (player === null) {
    return false;
  }
  const character = player.GetPlayerType();

  if (character === g.race.character) {
    return false;
  }

  restartAsCharacter(g.race.character);
  return true;
}

export function checkRestartWrongSeed(): boolean {
  if (
    !g.config.clientCommunication ||
    g.race.format !== "seeded" ||
    g.race.status !== "in progress"
  ) {
    return false;
  }

  const startSeedString = g.seeds.GetStartSeedString();

  if (startSeedString !== g.race.seed) {
    // This command will change the seed of the run and restart the game
    consoleCommand(`seed ${g.race.seed}`);

    return true;
  }

  return false;
}

/*
function race() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();
  const topSprite = sprites.sprites.get("top");

  // If we are not in a race, do nothing
  if (g.race.status === "none") {
    sprites.clearPostRaceStartGraphics();
  }
  if (g.race.status === "none") {
    // Remove graphics as soon as the race is over
    sprites.init("top", "");
    sprites.clearStartingRoomGraphicsTop();
    sprites.clearStartingRoomGraphicsBottom();
    if (!g.raceVars.finished) {
      sprites.init("place", ""); // Keep the place there at the end of a race
    }
    return;
  }

  //
  // Race validation / show warning messages
  //

  if (
    g.race.difficulty === "hard" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.format !== "custom"
  ) {
    sprites.init("top", "error-not-hard-mode"); // Error: You are not on hard mode.
    return;
  }

  if (
    topSprite !== undefined &&
    topSprite.spriteName === "error-not-hard-mode"
  ) {
    sprites.init("top", "");
  }

  if (
    g.race.difficulty === "normal" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL &&
    g.race.format !== "custom"
  ) {
    sprites.init("top", "error-hard-mode"); // Error: You are on hard mode.
    return;
  }

  if (topSprite !== undefined && topSprite.spriteName === "error-hard-mode") {
    sprites.init("top", "");
  }

  //
  // Graphics for the "Race Start" room
  //

  // Show the graphics for the "Race Start" room (the top half)
  if (g.race.status === "open" && roomIndex === GridRooms.ROOM_DEBUG_IDX) {
    sprites.init("top", "wait"); // "Wait for the race to begin!"
    sprites.init("myStatus", g.race.myStatus);
    sprites.init("ready", g.race.placeMid.toString());
    // We use "placeMid" to hold this variable, since it isn't used before a race starts
    sprites.init("slash", "slash");
    sprites.init("readyTotal", g.race.numEntrants.toString());
  } else {
    if (topSprite !== undefined && topSprite.spriteName === "wait") {
      // There can be other things on the "top" sprite location and we don't want to have to reload
      // it on every frame
      sprites.init("top", "");
    }
    sprites.clearStartingRoomGraphicsTop();
  }

  // Show the graphics for the "Race Start" room (the bottom half)
  if (
    (g.race.status === "open" || g.race.status === "starting") &&
    roomIndex === GridRooms.ROOM_DEBUG_IDX
  ) {
    if (g.race.ranked || !g.race.solo) {
      sprites.init("raceRanked", "ranked");
      sprites.init("raceRankedIcon", "ranked-icon");
    } else {
      sprites.init("raceRanked", "unranked");
      sprites.init("raceRankedIcon", "unranked-icon");
    }
    sprites.init("raceFormat", g.race.format);
    sprites.init("raceFormatIcon", `${g.race.format}-icon`);
    sprites.init("goal", "goal");
    sprites.init("raceGoal", g.race.goal);
  } else {
    sprites.clearStartingRoomGraphicsBottom();
  }

  //
  // Countdown graphics
  //

  // Show the appropriate countdown graphic/text
  if (g.race.status === "starting") {
    if (g.race.countdown === 10) {
      sprites.init("top", "10");
    } else if (g.race.countdown === 5) {
      sprites.init("top", "5");
    } else if (g.race.countdown === 4) {
      sprites.init("top", "4");
    } else if (g.race.countdown === 3) {
      sprites.init("top", "3");
    } else if (g.race.countdown === 2) {
      sprites.init("top", "2");
    } else if (g.race.countdown === 1) {
      sprites.init("top", "1");
    }
  }

  //
  // Race active
  //

  if (g.race.status === "in progress") {
    // The client will set countdown equal to 0 and the status equal to "in progress" at the same
    // time
    if (!g.raceVars.started) {
      // Reset some race-related variables
      Isaac.DebugString(`Starting the race! (${g.race.format})`);
    }

    // Find out how much time has passed since the race started
    const elapsedMilliseconds = Isaac.GetTime() - g.raceVars.startedTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;

    // Draw the "Go!" graphic
    if (elapsedSeconds < 3) {
      sprites.init("top", "go");
    } else {
      sprites.init("top", "");
    }

    // Draw the graphic that shows what place we are in
    if (
      stage >= 2 && // Our place is irrelevant on the first floor, so don't bother showing it
      // It is irrelevant to show "1st" when there is only one person in the race
      !g.race.solo
    ) {
      sprites.init("place", g.race.placeMid.toString());
    } else {
      sprites.init("place", "");
    }
  }

  // Remove graphics as soon as we enter another room
  // (this is done separately from the above if block in case the client and mod become
  // desynchronized)
  if (g.raceVars.started === true && g.run.roomsEntered > 1) {
    sprites.clearPostRaceStartGraphics();
  }
}
*/
