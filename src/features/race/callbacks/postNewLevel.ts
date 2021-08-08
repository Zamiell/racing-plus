import { config } from "../../../modConfigMenu";
import * as megaSatan from "../megaSatan";
import * as placeLeft from "../placeLeft";
import * as socket from "../socket";

export default function racePostNewLevel(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postNewLevel();
  placeLeft.postNewLevel();
  megaSatan.postNewLevel();
}
