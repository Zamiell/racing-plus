import g from "../../../globals";
import * as raceRoom from "../raceRoom";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";
import * as tempMoreOptions from "../tempMoreOptions";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postNewRoom();
  tempMoreOptions.postNewRoom();
  raceRoom.postNewRoom();
  startingRoom.postNewRoom();
}
