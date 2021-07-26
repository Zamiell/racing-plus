import g from "../../../globals";
import * as megaSatan from "../megaSatan";
import * as placeLeft from "../placeLeft";
import * as socket from "../socket";
import * as tempMoreOptions from "../tempMoreOptions";

export default function racePostNewLevel(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postNewLevel();
  tempMoreOptions.postNewLevel();
  placeLeft.postNewLevel();
  megaSatan.postNewLevel();
}
