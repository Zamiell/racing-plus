import { config } from "../../../modConfigMenu";
import * as socket from "../socket";

export function racePreGameExit(): void {
  if (!config.ClientCommunication) {
    return;
  }

  socket.preGameExit();
}
