import { log } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { consoleCommand, restartAsCharacter } from "../../../util";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import raceStart from "../raceStart";
import * as raceTimer from "../raceTimer";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

export default function racePostRender(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postRender();
  raceTimer.postRender();
  placeLeft.postRender();

  if (g.race.status !== "none") {
    checkGameOpenedInMiddleOfRace();
    raceRoom.postRender();
    startingRoom.postRender();
    topSprite.postRender();
  }
}

function checkGameOpenedInMiddleOfRace() {
  // The race variables are normally set when the race status over the socket changes
  // Thus, if the game is closed and reopened in the middle of a race,
  // then the race will never become started
  // Explicitly check for this
  // (the timer won't be correct, but at least everything else will be functional)
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    !g.raceVars.started
  ) {
    log("The game was opened in the middle of a race!");
    raceStart();
  }
}

export function checkRestartWrongRaceCharacter(): boolean {
  if (
    !config.clientCommunication ||
    g.race.status === "none" ||
    g.race.format === "custom"
  ) {
    return false;
  }

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (character === g.race.character) {
    return false;
  }

  restartAsCharacter(g.race.character);
  return true;
}

export function checkRestartWrongRaceSeed(): boolean {
  if (
    !config.clientCommunication ||
    g.race.format !== "seeded" ||
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing"
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
