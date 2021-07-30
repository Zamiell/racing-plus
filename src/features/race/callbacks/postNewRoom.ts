import g from "../../../globals";
import * as banFirstFloorTreasureRoom from "../banFirstFloorTreasureRoom";
import * as makeBossRushItemsFree from "../makeBossRushItemsFree";
import * as raceRoom from "../raceRoom";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeStrangeDoor from "../removeStrangeDoor";
import * as seededRooms from "../seededRooms";
import * as socket from "../socket";
import * as spawnCorpseTrapdoor from "../spawnCorpseTrapdoor";
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
  spawnCorpseTrapdoor.postNewRoom();
  makeBossRushItemsFree.postNewRoom();
  removeStrangeDoor.postNewRoom();
  removeRepentanceDoor.postNewRoom();
  seededRooms.postNewRoom();
}
