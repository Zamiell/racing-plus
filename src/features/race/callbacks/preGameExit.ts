import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export function racePreGameExit(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.preGameExit();
}
