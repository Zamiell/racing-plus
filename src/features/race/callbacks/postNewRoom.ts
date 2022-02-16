import { FINAL_STAGE, getRoomSafeGridIndex } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import * as endOfRaceButtons from "../endOfRaceButtons";
import * as makeBossRushItemsFree from "../makeBossRushItemsFree";
import * as raceRoom from "../raceRoom";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeStrangeDoor from "../removeStrangeDoor";
import * as removeVoidDoor from "../removeVoidDoor";
import * as replaceScolex from "../replaceScolex";
import * as seeded3DollarBill from "../seeded3DollarBill";
import * as seededDeath from "../seededDeath";
import * as socket from "../socket";
import * as spawnCorpseTrapdoor from "../spawnCorpseTrapdoor";
import * as startingRoom from "../startingRoom";
import * as topSprite from "../topSprite";
import * as victoryLap from "../victoryLap";

// We take the next stage after the final vanilla stage
const MEGA_SATAN_FAKE_STAGE_NUM = FINAL_STAGE + 1;

export function racePostNewRoom(): void {
  if (!config.clientCommunication) {
    return;
  }

  socket.postNewRoom();
  raceRoom.postNewRoom();
  startingRoom.postNewRoom();
  topSprite.postNewRoom();
  spawnCorpseTrapdoor.postNewRoom();
  makeBossRushItemsFree.postNewRoom();
  removeStrangeDoor.postNewRoom();
  removeRepentanceDoor.postNewRoom();
  removeVoidDoor.postNewRoom();
  replaceScolex.postNewRoom();
  seededDeath.postNewRoom();
  seeded3DollarBill.postNewRoom();
  endOfRaceButtons.postNewRoom();
  victoryLap.postNewRoom();
  recordMegaSatanRoom();
}

function recordMegaSatanRoom() {
  const roomSafeGridIndex = getRoomSafeGridIndex();

  if (roomSafeGridIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    socket.send("level", `${MEGA_SATAN_FAKE_STAGE_NUM}-0-false`);
  }
}
