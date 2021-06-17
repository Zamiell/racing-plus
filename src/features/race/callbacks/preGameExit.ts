import g from "../../../globals";
import * as socket from "../socket";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.preGameExit();
}
