import { log } from "isaacscript-common";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import { raceStart } from "../raceStart";
import * as raceTimer from "../raceTimer";
import * as shadows from "../shadows/shadows";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

export function racePostRender(): void {
  if (!config.ClientCommunication) {
    return;
  }

  socket.postRender();
  raceTimer.postRender();
  placeLeft.postRender();
  endOfRaceButtons.postRender();
  shadows.postRender();

  if (g.race.status !== RaceStatus.NONE) {
    checkGameOpenedInMiddleOfRace();
    raceRoom.postRender();
    startingRoom.postRender();
    topSprite.postRender();
  }
}

function checkGameOpenedInMiddleOfRace() {
  // The race variables are normally set when the race status over the socket changes. Thus, if the
  // game is closed and reopened in the middle of a race, then the race will never become started.
  // Explicitly check for this. (The timer won't be correct, but at least everything else will be
  // functional.)
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    !g.raceVars.started
  ) {
    log("The game was opened in the middle of a race!");
    raceStart();
  }
}
