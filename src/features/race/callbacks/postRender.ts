import g from "../../../globals";
import { consoleCommand, restartAsCharacter } from "../../../misc";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import raceStart from "../raceStart";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postRender();

  if (g.race.status !== "none") {
    checkGameOpenedInMiddleOfRace();
    raceRoom.postRender();
    startingRoom.postRender();
    placeLeft.postRender();
    topSprite.postRender();
  }
}

function checkGameOpenedInMiddleOfRace() {
  // The race variables are normally set when the race status over the socket changes
  // Thus, if the game is closed and reopened in the middle of a race,
  // then the race will never become started
  // Explicitly check for this
  // (the timer won't be correct, but at least everything else will be functional)
  if (g.race.status === "in progress" && !g.raceVars.started) {
    raceStart();
  }
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
  //
  // Race active
  //

  if (g.race.status === "in progress") {
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
