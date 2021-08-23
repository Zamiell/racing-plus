import { getRoomIndex } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as banFirstFloorTreasureRoom from "../banFirstFloorTreasureRoom";
import * as makeBossRushItemsFree from "../makeBossRushItemsFree";
import * as preventSacrificeRoomTeleport from "../preventSacrificeRoomTeleport";
import * as raceRoom from "../raceRoom";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeStrangeDoor from "../removeStrangeDoor";
import * as removeVoidDoor from "../removeVoidDoor";
import * as replaceScolex from "../replaceScolex";
import * as seededDeath from "../seededDeath";
import * as socket from "../socket";
import * as spawnCorpseTrapdoor from "../spawnCorpseTrapdoor";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";

// Home is 13, so we take the next stage number after that
const MEGA_SATAN_FAKE_STAGE_NUM = 14;

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
  preventSacrificeRoomTeleport.postNewRoom();
  removeVoidDoor.postNewRoom();
  replaceScolex.postNewRoom();
  seededDeath.postNewRoom();
  recordMegaSatanRoom();
}

function recordMegaSatanRoom() {
  const roomIndex = getRoomIndex();

  if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    socket.send("level", `${MEGA_SATAN_FAKE_STAGE_NUM}-0-false`);
  }
}
