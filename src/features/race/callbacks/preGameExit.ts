import g from "../../../globals";
import * as socket from "../socket";

export default function racePreGameExit(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.preGameExit();
}
