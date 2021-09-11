import { config } from "../../../modConfigMenu";
import * as megaSatan from "../megaSatan";
import * as socket from "../socket";

export default function racePostNewLevel(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postNewLevel();
  megaSatan.postNewLevel();
}
