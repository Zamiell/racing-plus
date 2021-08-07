import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export default function racePreGameExit(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.preGameExit();
}
