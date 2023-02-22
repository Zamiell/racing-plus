import { config } from "../../../modConfigMenu";
import * as consistentDevilAngelRooms from "../consistentDevilAngelRooms";
import * as megaSatan from "../megaSatan";
import * as socket from "../socket";

export function racePostNewLevel(): void {
  if (!config.ClientCommunication) {
    return;
  }

  socket.postNewLevel();
  megaSatan.postNewLevel();
  consistentDevilAngelRooms.postNewLevel();
}
