import g from "../../../globals";
import * as banFirstFloorTreasureRoom from "../banFirstFloorTreasureRoom";
import * as raceRoom from "../raceRoom";
import * as socket from "../socket";
import * as startingRoom from "../startingRoom";
import * as tempMoreOptions from "../tempMoreOptions";
import * as topSprite from "../topSprite";

export default function racePostNewRoom(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  socket.postNewRoom();
  tempMoreOptions.postNewRoom();
  raceRoom.postNewRoom();
  startingRoom.postNewRoom();
  topSprite.postNewRoom();
  banFirstFloorTreasureRoom.postNewRoom();
}
