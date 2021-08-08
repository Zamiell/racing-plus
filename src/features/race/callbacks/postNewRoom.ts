import { config } from "../../../modConfigMenu";
import * as banFirstFloorTreasureRoom from "../banFirstFloorTreasureRoom";
import * as makeBossRushItemsFree from "../makeBossRushItemsFree";
import * as raceRoom from "../raceRoom";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeStrangeDoor from "../removeStrangeDoor";
import * as socket from "../socket";
import * as spawnCorpseTrapdoor from "../spawnCorpseTrapdoor";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

export default function racePostNewRoom(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postNewRoom();
  raceRoom.postNewRoom();
  startingRoom.postNewRoom();
  topSprite.postNewRoom();
  banFirstFloorTreasureRoom.postNewRoom();
  spawnCorpseTrapdoor.postNewRoom();
  makeBossRushItemsFree.postNewRoom();
  removeStrangeDoor.postNewRoom();
  removeRepentanceDoor.postNewRoom();
}
