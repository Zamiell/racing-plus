import g from "../../../globals";
import * as placeLeft from "../placeLeft";
import * as socket from "../socket";
import * as tempMoreOptions from "../tempMoreOptions";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postNewLevel();
  tempMoreOptions.postNewLevel();
  placeLeft.postNewLevel();
}
